const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_MSG_LENGTH = 2000;
const RATE_LIMIT_MAX = 10;      // messages
const RATE_LIMIT_WINDOW = 10000; // ms
const ADMIN_TOKEN = process.env.ADMIN_SOCKET_TOKEN || "";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Simple in-memory per-socket rate limiter */
const rateLimiters = new Map(); // socketId -> { count, resetAt }

function isRateLimited(socketId) {
  const now = Date.now();
  let entry = rateLimiters.get(socketId);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW };
    rateLimiters.set(socketId, entry);
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

/** Format a DB session for socket emission */
function formatSession(session) {
  return {
    id: session.visitorId,
    userId: session.userId || null,
    isClosed: session.isClosed,
    lastActive: session.lastActive,
    messages: (session.messages || []).map(formatMessage),
  };
}

function formatMessage(m) {
  return { id: m.id, text: m.text, sender: m.sender, timestamp: m.createdAt };
}

/** Upsert a chat session by visitorId */
async function upsertSession(visitorId, userId = null) {
  return prisma.chatSession.upsert({
    where: { visitorId },
    update: { lastActive: new Date(), ...(userId ? { userId } : {}) },
    create: { visitorId, lastActive: new Date(), ...(userId ? { userId } : {}) },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
}

// ─── Server 

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // ── 1. Admin joins the admin room ─────────────────────────────────────────
    socket.on("join_admin", async ({ token } = {}) => {
      // Token check — if ADMIN_TOKEN is configured, enforce it
      if (ADMIN_TOKEN && token !== ADMIN_TOKEN) {
        socket.emit("auth_error", "Invalid admin token");
        console.warn("Rejected admin join from:", socket.id);
        return;
      }

      socket.join("admin_room");
      console.log("Admin joined:", socket.id);

      try {
        const openSessions = await prisma.chatSession.findMany({
          where: {
            isClosed: false,
            lastActive: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
          include: { messages: { orderBy: { createdAt: "asc" } } },
          orderBy: { lastActive: "desc" },
        });

        const closedSessions = await prisma.chatSession.findMany({
          where: {
            isClosed: true,
            lastActive: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
          include: { messages: { orderBy: { createdAt: "asc" } } },
          orderBy: { lastActive: "desc" },
        });

        socket.emit("all_sessions", openSessions.map(formatSession));
        socket.emit("closed_sessions", closedSessions.map(formatSession));
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    });

    // ── 2. User starts a session or reconnects ────────────────────────────────
    socket.on("register_user", async ({ sessionId, userId } = {}) => {
      if (!sessionId) return;

      socket.join(sessionId);
      console.log(`User ${socket.id} joined session ${sessionId}`);

      try {
        const session = await upsertSession(sessionId, userId || null);
        const isNew = session.messages.length === 0;

        socket.emit("session_history", session.messages.map(formatMessage));

        if (isNew) {
          io.to("admin_room").emit("session_updated", formatSession(session));
        } else {
          // Refresh lastActive in admin view
          io.to("admin_room").emit("session_updated", formatSession(session));
        }
      } catch (err) {
        console.error("Error registering user session:", err);
      }
    });

    // ── 3. User sends a message 
    socket.on("user_send_message", async ({ sessionId, text }) => {
      // Validation
      if (!sessionId || typeof text !== "string") return;
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > MAX_MSG_LENGTH) return;

      // Rate limit
      if (isRateLimited(socket.id)) {
        socket.emit("rate_limited", "You are sending messages too fast. Please slow down.");
        return;
      }

      try {
        const session = await upsertSession(sessionId);

        const savedMessage = await prisma.chatMessage.create({
          data: { sessionId: session.id, text: trimmed, sender: "user" },
        });

        const message = formatMessage(savedMessage);
        // Use socket.to() (not io.to()) so the sender doesn't receive their own
        // message echoed back — the customer widget already added it optimistically.
        socket.to(sessionId).emit("receive_message", message);

        // Refresh admin panel
        const updated = await prisma.chatSession.findUnique({
          where: { visitorId: sessionId },
          include: { messages: { orderBy: { createdAt: "asc" } } },
        });
        io.to("admin_room").emit("session_updated", formatSession(updated));
      } catch (err) {
        console.error("Error sending user message:", err);
      }
    });

    // ── 4. Admin sends a reply
    socket.on("admin_send_reply", async ({ sessionId, text }) => {
      if (!sessionId || typeof text !== "string") return;
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > MAX_MSG_LENGTH) return;

      try {
        const session = await prisma.chatSession.findUnique({
          where: { visitorId: sessionId },
        });
        if (!session || session.isClosed) return;

        await prisma.chatSession.update({
          where: { visitorId: sessionId },
          data: { lastActive: new Date() },
        });

        const savedMessage = await prisma.chatMessage.create({
          data: { sessionId: session.id, text: trimmed, sender: "admin" },
        });

        const message = formatMessage(savedMessage);
        io.to(sessionId).emit("receive_message", message);

        const updated = await prisma.chatSession.findUnique({
          where: { visitorId: sessionId },
          include: { messages: { orderBy: { createdAt: "asc" } } },
        });
        io.to("admin_room").emit("session_updated", formatSession(updated));
      } catch (err) {
        console.error("Error sending admin reply:", err);
      }
    });

    // ── 5. Admin closes a session ─────────────────────────────────────────────
    socket.on("close_session", async ({ sessionId, token } = {}) => {
      if (ADMIN_TOKEN && token !== ADMIN_TOKEN) {
        socket.emit("auth_error", "Invalid admin token");
        return;
      }
      if (!sessionId) return;

      try {
        const updated = await prisma.chatSession.update({
          where: { visitorId: sessionId },
          data: { isClosed: true },
          include: { messages: { orderBy: { createdAt: "asc" } } },
        });

        // Notify the user their session was closed
        io.to(sessionId).emit("session_closed", { sessionId });
        // Update admin room
        io.to("admin_room").emit("session_closed_ack", formatSession(updated));
      } catch (err) {
        console.error("Error closing session:", err);
      }
    });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      rateLimiters.delete(socket.id);
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

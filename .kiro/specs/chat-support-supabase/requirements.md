# Chat Support System - Supabase Real-time

## Overview
Replace Socket.IO-based chat with Supabase Real-time subscriptions for a scalable, managed solution.

## User Stories

### User (Customer)
1. **Initiate Chat**: As a customer, I can click the support widget and start a chat session without logging in
2. **Send Messages**: I can send messages and see them appear in real-time
3. **See Admin Responses**: I receive admin responses instantly
4. **Session Persistence**: My chat history persists across browser sessions
5. **Typing Indicator**: I can see when an admin is typing

### Admin (Support Staff)
1. **View Active Sessions**: I can see a list of all active chat sessions sorted by most recent
2. **Receive Notifications**: I get notified when new chat requests arrive
3. **Send Responses**: I can send messages to customers in real-time
4. **Session Management**: I can close sessions and view chat history
5. **Multiple Chats**: I can handle multiple concurrent chat sessions
6. **Typing Indicator**: Customers see when I'm typing

## Acceptance Criteria

### Chat Functionality
- [ ] Users can send and receive messages in real-time using Supabase subscriptions
- [ ] Messages are persisted to PostgreSQL database with proper user relationships
- [ ] Authenticated users' sessions are linked to their User account
- [ ] Guest sessions work without authentication (tracked via visitorId)
- [ ] Chat history is retrievable and shows correct user ownership
- [ ] Sessions auto-create for new visitors with unique visitor IDs
- [ ] Typing indicators work in both directions
- [ ] Message sender name is displayed correctly (user name or "Guest")

### User Relationship & Data Integrity
- [ ] Authenticated users' ChatSessions have userId set to their User.id
- [ ] Guest ChatSessions have userId = NULL but unique visitorId
- [ ] Deleting a User cascades properly (ChatSessions set userId to NULL)
- [ ] Only the session owner can view their chat history (via RLS)
- [ ] Admins can view all sessions regardless of user relationship
- [ ] Sessions can transition from guest to authenticated user

### User Experience
- [ ] Floating widget opens/closes smoothly
- [ ] Connection status is displayed
- [ ] Offline gracefully degrades to email/contact form
- [ ] Message timestamps are accurate
- [ ] Chat scrolls to latest message automatically
- [ ] Session persists across browser refreshes (authenticated users via userId, guests via visitorId)

### Admin Features
- [ ] Admin dashboard shows list of active sessions with user names/emails
- [ ] Admin can view full chat history for each session
- [ ] Admin can send messages that appear instantly for users
- [ ] Admin receives toast notification for new chats
- [ ] Admin can mark sessions as closed/resolved
- [ ] Admin dashboard shows which sessions belong to authenticated users

### Performance & Scalability
- [ ] No hard limit on concurrent chat sessions (via Supabase)
- [ ] Messages sync within 100ms for real-time feel
- [ ] Database automatically handles scaling
- [ ] No server-side chat infrastructure needed
- [ ] Efficient queries with proper indexes on userId, visitorId, lastActive

### Security
- [ ] Visitors can only see their own chat sessions (via RLS)
- [ ] Admins need authentication to access admin panel
- [ ] Message data encrypted in transit (HTTPS)
- [ ] No sensitive data in browser console

## Technical Requirements

### Database Schema

**Key Design Decisions:**
- `ChatSession` has BOTH `userId` (authenticated users) AND `visitorId` (guests)
- For authenticated users: `userId` is required, `visitorId` is auto-generated for consistency
- For guests: `userId` is NULL, `visitorId` uniquely identifies the session
- Proper foreign key relationship to `User` model for data integrity
- RLS policies will control access based on user ownership

```prisma
model User {
  // ... existing fields ...
  chatSessions  ChatSession[]  // New relation
}

model ChatSession {
  id            String        @id @default(cuid())
  userId        String?       // Nullable: NULL for guest chats
  user          User?         @relation(fields: [userId], references: [id], onDelete: SetNull)
  visitorId     String        @unique // Unique identifier for all sessions (guest or authenticated)
  status        String        @default("active") // active, closed, resolved
  lastActive    DateTime      @default(now())
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  messages      ChatMessage[]

  @@index([userId])
  @@index([visitorId])
  @@index([lastActive])
}

model ChatMessage {
  id            String        @id @default(cuid())
  sessionId     String
  session       ChatSession   @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  text          String        @db.Text
  sender        String        // "user" or "admin"
  senderName    String?       // Display name of sender (optional)
  isRead        Boolean       @default(false)
  createdAt     DateTime      @default(now())

  @@index([sessionId])
  @@index([createdAt])
}
```

### RLS Policies for Chat

```sql
-- ChatSession RLS
-- Users can view their own sessions
CREATE POLICY "Users can view own chat sessions"
  ON ChatSession
  FOR SELECT
  USING (auth.uid()::text = "userId" OR "userId" IS NULL);

-- Users can create sessions
CREATE POLICY "Users can create chat sessions"
  ON ChatSession
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId" OR "userId" IS NULL);

-- Admins can view all sessions
CREATE POLICY "Admins can view all chat sessions"
  ON ChatSession
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- ChatMessage RLS
-- Users can view messages from their sessions
CREATE POLICY "Users can view own session messages"
  ON ChatMessage
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ChatSession s
      WHERE s.id = "sessionId" 
      AND (s."userId" = auth.uid()::text OR s."userId" IS NULL)
    )
  );

-- Admins can view all messages
CREATE POLICY "Admins can view all chat messages"
  ON ChatMessage
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- Users can send messages to their sessions
CREATE POLICY "Users can send messages to own sessions"
  ON ChatMessage
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ChatSession s
      WHERE s.id = "sessionId"
      AND (s."userId" = auth.uid()::text OR s."userId" IS NULL)
    )
  );
```

### Frontend Dependencies
- `@supabase/supabase-js` - Supabase client
- `@chatscope/chat-ui-kit-react` - Chat UI (keep existing)
- `react-hot-toast` - Notifications

### Supabase Setup
- Enable Real-time on `ChatMessage` table
- Enable Real-time on `ChatSession` table
- Create RLS policies for data access control

## Implementation Steps

1. **Database Updates**
   - Add `user` relation to ChatSession pointing to User model
   - Add `userId` foreign key index to ChatSession
   - Add `visitorId` unique index to ChatSession
   - Add `chatSessions` relation to User model
   - Add `status` field to ChatSession
   - Add `senderName` field to ChatMessage
   - Add `isRead` field to ChatMessage
   - Create RLS policies with proper user ownership checks
   - Migrate existing ChatSession data (set visitorId for all records)

2. **Backend API Routes**
   - `POST /api/chat/sessions` - Create chat session (auto-link to authenticated user if logged in)
   - `GET /api/chat/sessions` - List admin sessions (admin only)
   - `GET /api/chat/sessions/[id]/messages` - Get message history (with user ownership check via RLS)
   - `GET /api/users/[userId]/chat-sessions` - Get user's chat history
   - `POST /api/chat/sessions/[id]/close` - Close session (admin only)
   - `POST /api/chat/sessions/[id]/messages` - Send message (with proper user/session validation)

3. **Frontend - User Identification**
   - If user is authenticated: Set `userId` from session when creating/joining chat
   - If user is guest: Generate and store `visitorId` in localStorage
   - Pass appropriate identifiers to Supabase subscriptions
   - Load user name/email from authenticated session or display "Guest"

4. **Frontend Components**
   - Update FloatingSupport.js to use Supabase Real-time with user linking
   - Update admin/support/page.js to show user information with sessions
   - Add notification system for new chats
   - Add typing indicators with Supabase
   - Display user email/name in session list (admin only)
   - Show "Guest - [visitorId]" for unauthenticated sessions

5. **Testing**
   - Test authenticated user chat creation (userId is set)
   - Test guest chat creation (userId is NULL, visitorId is set)
   - Test real-time message sync with user ownership
   - Test session persistence across login/logout
   - Test RLS policies prevent unauthorized access
   - Test admin can see all sessions
   - Test user can only see own sessions
   - Test multiple concurrent sessions from different users
   - Test message history retrieval with proper filtering

## Success Metrics
- Messages sync within 100ms
- Support panel loads in under 2 seconds
- No message loss
- Handles 100+ concurrent sessions
- Zero downtime (managed Supabase)

## Constraints
- Supabase cost increases with message volume
- Real-time subscriptions have connection limits
- Some latency in very high traffic scenarios

## Notes
- Keep existing @chatscope UI components
- Migrate gradually (keep Socket.IO fallback initially)
- Consider Supabase Edge Functions for auto-responses

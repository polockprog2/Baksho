# Chat Support Data Model

## Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                   │
├─────────────────────────────────────────────────────────────┤

                         ┌──────────────┐
                         │     User     │
                         ├──────────────┤
                         │ id (PK)      │
                         │ email        │
                         │ name         │
                         │ role         │
                         └──────┬───────┘
                                │
                    1:N         │
                                │
                    ┌───────────▼──────────────┐
                    │   ChatSession           │
                    ├───────────────────────────┤
                    │ id (PK)                 │
                    │ userId (FK) - NULLABLE  │◄─── Can be NULL for guests
                    │ visitorId (UNIQUE)      │◄─── Present for all sessions
                    │ status                  │
                    │ lastActive              │
                    │ createdAt               │
                    │ updatedAt               │
                    └────────────┬────────────┘
                                 │
                      1:N        │
                                 │
                    ┌────────────▼──────────────┐
                    │   ChatMessage           │
                    ├───────────────────────────┤
                    │ id (PK)                 │
                    │ sessionId (FK)          │
                    │ text                    │
                    │ sender                  │ (user/admin)
                    │ senderName              │
                    │ isRead                  │
                    │ createdAt               │
                    └────────────────────────┘

└─────────────────────────────────────────────────────────────┘
```

## Two Types of Chat Sessions

### 1. Authenticated User Chat Session
```
User (logged in)
    │
    ├─ email: "customer@example.com"
    ├─ id: "user_abc123"
    └─ chatSessions: [ChatSession]
         │
         └─ ChatSession {
              userId: "user_abc123"        ← Links to User
              visitorId: "visitor_xyz789"  ← Still unique for tracking
              status: "active"
              messages: [ChatMessage]
           }
```

**Advantages:**
- Clear user ownership
- Can retrieve all chats for a user
- Admin can identify authenticated customers
- Supports customer service follow-up
- RLS policies enforce user privacy

### 2. Guest Chat Session (No Login)
```
Guest (not logged in)
    │
    └─ ChatSession {
         userId: NULL                    ← No user linkage
         visitorId: "visitor_abc123"    ← Unique ID for guest
         status: "active"
         messages: [ChatMessage]
      }
```

**Advantages:**
- Guests can chat without creating account
- Tracked via browser localStorage
- Lower friction for support inquiries
- Admin can still manage guest sessions
- Can convert to authenticated later

## Data Flow Examples

### Scenario 1: Authenticated User Starting Chat
```
1. User logs in
   └─ session.user.id = "user_abc123"

2. User opens chat widget
   └─ Check authentication status

3. Create ChatSession
   {
     userId: "user_abc123"           ← From authenticated session
     visitorId: "visitor_generated"  ← Auto-generate
     status: "active"
     createdAt: now
   }

4. User sends message
   └─ ChatMessage {
        sessionId: "chat_session_123"
        sender: "user"
        senderName: "John Doe"       ← From user.name
        text: "Help with order"
      }

5. Admin retrieves chat
   └─ Via /api/chat/sessions/[id]/messages
   └─ Can see user email: "customer@example.com"
```

### Scenario 2: Guest Starting Chat
```
1. Guest visits site (no login)
   └─ session = null

2. Guest opens chat widget
   └─ Check localStorage for visitorId
   └─ If not found, generate new one: "visitor_xyz789"
   └─ Save to localStorage

3. Create ChatSession
   {
     userId: NULL                    ← No user linked
     visitorId: "visitor_xyz789"    ← From localStorage
     status: "active"
     createdAt: now
   }

4. Guest sends message
   └─ ChatMessage {
        sessionId: "chat_session_456"
        sender: "user"
        senderName: "Guest"          ← Default name
        text: "Question about prices"
      }

5. Admin retrieves chat
   └─ Via /api/chat/sessions/[id]/messages
   └─ Shows: "Guest - visitor_xyz789"
   └─ Can still respond and help
```

### Scenario 3: Guest Converts to Authenticated User
```
1. Guest had chat session with userId = NULL
   └─ visitorId: "visitor_xyz789"

2. Guest decides to create account & login
   └─ New User created: id "user_new123"
   └─ Authentication successful

3. Update existing ChatSession
   ```sql
   UPDATE ChatSession
   SET userId = "user_new123"
   WHERE visitorId = "visitor_xyz789"
   ```

4. Future chats automatically link to userId
   └─ Full customer history available
   └─ All chats show under user profile
```

## RLS Policy Protection

### User's Own Session Access
```sql
-- User can only see their own sessions
WHERE userId = auth.uid() 
   OR userId IS NULL (guests using their visitorId)
```

### Guest Session Access  
```sql
-- Guest identified by visitorId from localStorage
-- Checked on frontend, enforced by Supabase RLS
WHERE visitorId = request_visitorId
```

### Admin Full Access
```sql
-- Admin with role = 'ADMIN' can see all
WHERE admin_user.role = 'ADMIN'
```

## Indexes for Performance

```prisma
@@index([userId])        // Fast user lookups
@@index([visitorId])     // Fast guest lookups
@@index([lastActive])    // Sort sessions by activity
@@index([status])        // Filter by active/closed
```

## Migration Path for Existing Data

If migrating from current Socket.IO system:

```sql
-- 1. Add new columns (nullable initially)
ALTER TABLE ChatSession ADD COLUMN userId STRING;
ALTER TABLE ChatSession ADD COLUMN visitorId STRING UNIQUE;

-- 2. Generate visitorIds for existing sessions
UPDATE ChatSession 
SET visitorId = 'visitor_' || id || '_legacy'
WHERE visitorId IS NULL;

-- 3. Link existing guest sessions to temp user if needed
-- OR set userId = NULL for guest sessions

-- 4. Backfill with any existing user relationships from logs

-- 5. Add foreign key constraint
ALTER TABLE ChatSession 
ADD CONSTRAINT fk_user 
FOREIGN KEY (userId) REFERENCES User(id) ON DELETE SET NULL;
```

## Benefits of This Model

✅ **Authenticated users** - Full user history, email, name
✅ **Guest users** - No account required, still tracked
✅ **Privacy** - RLS enforces per-user access
✅ **Flexibility** - Guest can convert to user
✅ **Admin power** - Can manage both user and guest sessions
✅ **Analytics** - Can track authenticated vs guest support
✅ **Scalability** - Clean relationships support growth
✅ **Data integrity** - Foreign keys ensure consistency

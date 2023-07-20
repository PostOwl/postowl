pragma journal_mode = WAL;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS posts (
   post_id INTEGER PRIMARY KEY,
   is_public INTEGER DEFAULT FALSE,
   slug TEXT UNIQUE NOT NULL,
   title TEXT,
   teaser TEXT,
   teaser_image TEXT,
   content TEXT NOT NULL,
   created_at TEXT,
   updated_at TEXT
);

CREATE TABLE IF NOT EXISTS old_post_slugs (
  slug TEXT PRIMARY KEY,
  post_id INTEGER REFERENCES posts NOT NULL
);

CREATE TABLE IF NOT EXISTS friends (
  friend_id INTEGER PRIMARY KEY,
  name TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS recipients (
  recipient_id INTEGER PRIMARY KEY,
  secret TEXT NOT NULL, -- this will serve as the secret for accessing private posts
  post_id INTEGER REFERENCES posts NOT NULL,
  friend_id INTEGER REFERENCES friends NOT NULL,
  has_seen INTEGER DEFAULT FALSE,
  UNIQUE(post_id, friend_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  expires TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pages (
  page_id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- counters (for view counts and everything you want to track anonymously)
CREATE TABLE IF NOT EXISTS counters (
  counter_id TEXT PRIMARY KEY,
  count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS assets (
  asset_id TEXT PRIMARY KEY,
  mime_type TEXT NOT NULL,
  updated_at TEXT DEFAULT NULL,
  size INTEGER NOT NULL,
  data BLOB NOT NULL
);
COMMIT;

-- We might want to ensure the datetime fields follow a certain format
-- CREATE TABLE IF NOT EXISTS events (
--     id INTEGER PRIMARY KEY,
--     date_string TEXT NOT NULL CHECK (
--         strftime('%Y-%m-%dT%H:%M:%S', date_string) = date_string
--     )
-- );

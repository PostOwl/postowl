PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
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

DROP TABLE IF EXISTS old_post_slugs;
CREATE TABLE old_post_slugs (
  slug TEXT PRIMARY KEY,
  post_id INTEGER REFERENCES posts NOT NULL
);

DROP TABLE IF EXISTS friends;
CREATE TABLE friends (
  friend_id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT DEFAULT NULL
);

DROP TABLE IF EXISTS recipients;
CREATE TABLE recipients (
  recipient_id INTEGER PRIMARY KEY,
  secret TEXT NOT NULL, -- this will serve as the secret for accessing private posts
  post_id INTEGER REFERENCES posts NOT NULL,
  friend_id INTEGER REFERENCES friends NOT NULL,
  UNIQUE(post_id, friend_id)
);

DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions (
  session_id TEXT PRIMARY KEY,
  expires TEXT NOT NULL
);

DROP TABLE IF EXISTS pages;
CREATE TABLE pages (
  page_id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- counters (for view counts and everything you want to track anonymously)
DROP TABLE IF EXISTS counters;
CREATE TABLE counters (
  counter_id TEXT PRIMARY KEY,
  count INTEGER NOT NULL
);
COMMIT;


-- We might want to ensure the datetime fields follow a certain format
-- CREATE TABLE events (
--     id INTEGER PRIMARY KEY,
--     date_string TEXT NOT NULL CHECK (
--         strftime('%Y-%m-%dT%H:%M:%S', date_string) = date_string
--     )
-- );
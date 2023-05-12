CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- posts
DROP TABLE IF EXISTS posts cascade;
CREATE TABLE posts (
  post_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_public boolean DEFAULT false, -- private posts will only be visible to others if recipients are selected
  slug varchar(100) UNIQUE NOT NULL, -- always has the latest post slug
  title varchar(100), -- title is optional
  teaser varchar(1000), -- post teaser
  teaser_image varchar(200), -- teaser image
  content text NOT NULL,
  created_at timestamptz DEFAULT NOW()::timestamptz,
  updated_at timestamptz NULL
);

-- we keep copies of old post slugs for a simple redirect logic
DROP TABLE IF EXISTS old_post_slugs cascade;
CREATE TABLE old_post_slugs (
  slug varchar(100) PRIMARY KEY,
  post_id uuid REFERENCES posts NOT NULL
);

-- friends (aka the contact list)
DROP TABLE IF EXISTS friends cascade;
CREATE TABLE friends (
  friend_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) UNIQUE NOT NULL,
  email varchar(100) UNIQUE NOT NULL,
  created_at timestamptz DEFAULT NOW()::timestamptz,
  updated_at timestamptz NULL
);

-- recipients (individuals able to receive/view a private post)
DROP TABLE IF EXISTS recipients cascade;
CREATE TABLE recipients (
  recipient_id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- this will serve as the secret for accessing private posts
  post_id uuid REFERENCES posts NOT NULL,
  friend_id uuid REFERENCES friends NOT NULL,
  UNIQUE(post_id, friend_Id)
);

-- sessions
DROP TABLE IF EXISTS sessions cascade;
CREATE TABLE sessions (
  session_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expires timestamptz NOT NULL
);

-- pages
DROP TABLE IF EXISTS pages cascade;
CREATE TABLE pages (
	page_id varchar(100) PRIMARY KEY,
	data json NOT NULL,
  updated_at timestamptz DEFAULT NOW()::timestamptz
);

-- counters (for view counts and everything you want to track anonymously)
DROP TABLE IF EXISTS counters cascade;
CREATE TABLE counters (
  counter_id varchar(100) PRIMARY KEY,
  count integer NOT NULL
);

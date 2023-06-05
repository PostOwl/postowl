import slugify from 'slugify';
import Database from 'better-sqlite3';
import { nanoid } from 'nanoid'
import { DEFAULT_BIO } from '$lib/constants';
import { DB_PATH, ADMIN_PASSWORD } from '$env/static/private';

const db = new Database(DB_PATH, { verbose: console.log });
// db.pragma('journal_mode = WAL');
db.pragma('case_sensitive_like = true');

/**
 * Creates a post
 */
export async function createPost(title, content, teaser, teaser_image, recipients, is_public, currentUser) {
  if (!currentUser) throw new Error('Not authorized');

  return db.transaction(() => {
    const slug = slugify(title, {
      lower: true,
      strict: true
    });
    const post = db.prepare("INSERT INTO posts (slug, title, content, teaser, teaser_image, is_public, created_at) values(?, ?, ?, ?, ?, ?, ?) RETURNING slug, post_id, created_at")
      .get(slug, title, content, teaser, teaser_image, is_public ? 1 : 0, new Date().toISOString());
    
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      let friend_id = recipient.friend_id;
      if (!friend_id) {
        const friend = db.prepare("INSERT INTO friends (name, email) values('', ?) RETURNING friend_id")
          .get(recipient.email);
        friend_id = friend.friend_id;
      }
      const secret = nanoid();
      db.prepare("INSERT INTO recipients (post_id, friend_id, secret) values(?, ?, ?) RETURNING recipient_id")
        .get(post.post_id, friend_id, secret);
  
      // TODO: email `friend.email` with a link containing `secret`.
    }
    return post;
  })();
}

// TODO: Improve this code, as soon as we are certain about the correct behavior
// 
// Challenge
// OLD: [f1,f2,f3]
// NEW: [f1,f3,xyz@foo.bar]
// RESULT: [f1,f3,f4]
export async function updatePost(slug, title, content, teaser, teaser_image, recipients, is_public, currentUser) {
  if (!currentUser) throw new Error('Not authorized');

  return db.transaction(() => {
    const post = db.prepare("UPDATE posts SET title= ?, content = ?, teaser = ?, teaser_image = ?, is_public = ?, updated_at = ? WHERE slug = ? RETURNING slug, post_id, updated_at")
      .get(title, content, teaser, teaser_image, is_public ? 1 : 0, new Date().toISOString(), slug);
    const previousRecipients = db.prepare("SELECT recipient_id FROM recipients WHERE post_id = ?")
      .all(post.post_id)
      .map(r => r.recipient_id);
    const new_recipients = [];
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      let friend_id = recipient.friend_id;
      if (!friend_id) {
        const friend = db.prepare("INSERT INTO friends (name, email) values('', ?) RETURNING friend_id")
          .get(recipient.email);
        friend_id = friend.friend_id;
      }
      const recipient_exists = db.prepare("SELECT recipient_id FROM recipients WHERE post_id = ? AND friend_id = ?")
        .get(post.post_id, friend_id);
      if (!recipient_exists) {
        const secret = nanoid();
        const { recipient_id } = db.prepare("INERT INTO recipients (post_id, friend_id, secret) values(?, ?, ?) RETURNING recipient_id")
          .get(post.post_id, friend_id, secret);
        // TODO: Email this new recipient here
        new_recipients.push(recipient_id);
      } else {
        new_recipients.push(recipient_exists.recipientId);
      }
    }

    for (let i = 0; i < previousRecipients.length; i++) {
      const r = previousRecipients[i];
      // If one the previousRecipients is no longer there, we need to delete it.
      if (new_recipients.indexOf(r) === -1) {
        db.prepare("DELETE FROM recipients WHERE recipient_id = ?").run(r);
      }
    }
    return post;
  })();
}

/*
  This can be replaced with any user-based authentication system
*/
export async function authenticate(password, sessionTimeout) {
  const expires = __getDateTimeMinutesAfter(sessionTimeout);
  if (password === ADMIN_PASSWORD) {
    const sessionId = nanoid();

    // Now is a good time to remove expired sessions
    db.prepare('DELETE FROM sessions WHERE expires < ?')
      .run(new Date().toISOString());

    // Create a new session
    db.prepare('INSERT INTO sessions (session_id, expires) values(?, ?) returning session_id')
      .run(sessionId, expires);

    return { sessionId };
  } else {
    throw 'Authentication failed.';
  }
}

/*
  Log out of the admin session ...
*/
export async function destroySession(sessionId) {
  db.prepare('DELETE FROM sessions WHERE session_id = ?')
    .run(sessionId);
  return true;
}

/**
 * List posts (either public, or all if you are the site owner)
 */
export async function getPosts(currentUser) {
  const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all()
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    post.recipients = db.prepare(`
      SELECT
      coalesce(f.name, f.email) AS name
      FROM recipients r
      INNER JOIN friends f ON (r.friend_id=f.friend_id)
      WHERE r.post_id = ?
    `).all(post.post_id)
  }
  return posts;
}

/**
 * List all friends/contacts.
 */
export async function getFriends(currentUser) {
  if (!currentUser) throw new Error('Not authorized');
  return db.prepare("SELECT * FROM friends ORDER BY created_at DESC").all();
}

/**
 * Get friend for a given friendId
 */
export async function getFriend(friend_id) {
  const friend = db.prepare("SELECT * FROM friends WHERE friend_id = ?").all(friend_id);
  return { ...friend };
}

/**
 * Create a new friend
 */
export async function createFriend(name, email, currentUser) {
  if (!currentUser) throw new Error('Not authorized');

  const friend = db.prepare("INSERT INTO friends (name, email) VALUES (?, ?) RETURNING friend_id, created_at")
    .get(name, email);
}

/**
 * Update friend record with new data
 */
export async function updateFriend(friendId, name, email, currentUser) {
  if (!currentUser) throw new Error('Not authorized');
  return db.prepare("UPDATE friends SET name= ?, email = ?, updated_at = NOW() WHERE friend_id = ? RETURNING friend_id, updated_at")
    .get(name, email, friend_id);
}

/**
 * Delete friend and remove associated recipient entries
 */
export async function deleteFriend(friend_id, currentUser) {
  if (!currentUser) throw new Error('Not authorized');

  return db.transaction(() => {
    // Remove recipients associated with the friend if there are any entries
    db.prepare("DELETE FROM recipients WHERE friend_id = ?").run(friend_id);
    // Delete the friend record itself
    db.prepare("DELETE FROM friends WHERE friend_id = ?").run(friend_id);
    return true;
  })()
}

/**
 * Get post for a given slug
 */
export async function getPostBySlug(slug, currentUser) {
  const post = db.prepare("SELECT * FROM posts WHERE slug = ?")
    .get(slug);
  
  let recipients = [];

  // Only expose recipients for the admin
  if (currentUser) {
    recipients = db.prepare("SELECT f.name, f.email, f.friend_id FROM recipients r INNER JOIN friends f ON (r.friend_id=f.friend_id) WHERE r.post_id = ?")
      .all(post.post_id);
  }
  return { ...post, recipients };
}

/**
 * Remove a post
 */
export async function deletePost(slug, currentUser) {
  if (!currentUser) throw new Error('Not authorized');
  return db.transaction(() => {
    const { post_id } = db.prepare("SELECT post_id FROM posts WHERE slug = ?").get(slug);
    // Remove recipients first
    db.prepare("DELETE FROM recipients WHERE post_id = ?").run(post_id);
    db.prepare("DELETE FROM posts WHERE slug = ?").run(slug);
    return true;
  })();
}

/**
 * In this minimal setup there is only one user, the website admin.
 * If you want to support multiple users/authors you want to return the current user record here.
 */
export async function getCurrentUser(session_id) {
  const stmt = db.prepare('SELECT session_id, expires FROM sessions WHERE session_id = ? AND expires > ?');
  const session = stmt.get(session_id, new Date().toISOString());
  
  if (session) {
    return { name: 'Admin' };
  } else {
    return null;
  }
}

/**
 * Search within friends (contacts)
 */
export async function searchFriends(q, currentUser) {
  if (currentUser) {
    const result = db.prepare("SELECT * FROM friends WHERE email LIKE ? OR name LIKE ? ORDER BY created_at DESC LIMIT 6")
      .all(`%${q}%`, `%${q}%`);
    return result;
  }
}

/**
 * Update the page
 */
export async function createOrUpdatePage(page_id, page, currentUser) {
  if (!currentUser) throw new Error('Not authorized');
  const pageExists = db.prepare("SELECT page_id FROM pages WHERE page_id = ?").get(page_id);
  if (pageExists) {
    return db.prepare("UPDATE pages SET data = ?, updated_at = ? WHERE page_id = ? RETURNING page_id").get(JSON.stringify(page), new Date().toISOString(), page_id);
  } else {
    return db.prepare("INSERT INTO pages (page_id, data, updated_at) values(?, ?, ?) RETURNING page_id").get(page_id, JSON.stringify(page), new Date().toISOString());
  }
}

/**
 * E.g. getPage("home") gets all dynamic data for the home page
 */
export async function getPage(page_id) {
  const page = db.prepare("SELECT data FROM pages WHERE page_id = ?").get(page_id);
  if (page?.data) {
    return JSON.parse(page.data);
  } else {
    return null;
  }
}

/**
 * Just proxying the getPage API to ensure defaults for bio.
 */
export async function getBio() {
  const bio = await getPage('bio')
  return bio || DEFAULT_BIO;
}

/**
 * We can count all kinds of things with this.
 */
export async function createOrUpdateCounter(counter_id) {
  return { count: 43 }

  return db.transaction(() => {
    // Remove recipients associated with the friend if there are any entries
    const counter_exists = db.prepare("SELECT counter_id FROM counters WHERE counter_id = ?").get(counter_id);
    if (counter_exists) {
      return db.prepare("UPDATE counters SET count = count + 1 WHERE counter_id = ? RETURNING count").get(counter_id);
    } else {
      return db.prepare("INSERT INTO counters (counter_id, count) values(?, 1) RETURNING count").get(counter_id);
    }
  })()
}

export async function getSitemap() {
  return db.transaction(() => {
    const posts = db.prepare("SELECT slug, created_at, COALESCE(created_at, updated_at) AS modified_at FROM posts ORDER BY created_at DESC").all();
    const mostRecentPost = posts[0];
    const sitemap = [];
    posts.forEach(a => {
      sitemap.push({
        url: `/posts/${a.slug}`,
        lastmod: new Date(a.modified_at).toISOString()
      });
    });
    return sitemap.concat([{ url: '/', lastmod: new Date(mostRecentPost?.modified_at).toISOString() }]);
  })();
}

/**
 * Helpers
 */
function __getDateTimeMinutesAfter(minutes) {
  return new Date(new Date().getTime() + minutes * 60000).toISOString();
}

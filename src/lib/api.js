import slugify from 'slugify';
import _db from './_db';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

/** Use a singleton DB instance */
const db = _db.instance;

/**
 * Creates a post
 */
export async function createPost(title, content, teaser, teaserImage, recipients, isPublic, currentUser) {
  if (!currentUser) throw new Error('Not authorized');

  const slug = slugify(title, {
    lower: true,
    strict: true
  });

  return await db.tx('create-post', async t => {
    const post = await t.one(
      'INSERT INTO posts (slug, title, content, teaser, teaser_image, is_public) values($1, $2, $3, $4, $5, $6) RETURNING slug, post_id, created_at',
      [slug, title, content, teaser, teaserImage, isPublic]
    );

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      let friendId = recipient.friendId
      if (!friendId) {
        const friend  = await t.one(
          "INSERT INTO friends (name, email) values('', $1) RETURNING friend_id",
          [recipient.email]
        );
        friendId = friend.friendId;
      }
      const r = await t.one(
        'INSERT INTO recipients (post_id, friend_id) values($1, $2) RETURNING recipient_id',
        [post.postId, friendId]
      );
    }
    return post;
  });
}

export async function updatePost(slug, title, content, teaser, teaserImage, currentUser) {
  if (!currentUser) throw new Error('Not authorized');
  return await db.tx('update-post', async t => {
    return await t.one(
      'UPDATE posts SET title= $1, content = $2, teaser = $3, teaser_image = $4, updated_at = NOW() WHERE slug = $5 RETURNING slug, updated_at',
      [title, content, teaser, teaserImage, slug]
    );
  });
}

/*
  This can be replaced with any user-based authentication system
*/
export async function authenticate(password, sessionTimeout) {
  return await db.tx('create-session', async t => {
    const expires = __getDateTimeMinutesAfter(sessionTimeout);
    if (password === ADMIN_PASSWORD) {
      const { sessionId } = await t.one(
        'INSERT INTO sessions (expires) values($1) returning session_id',
        [expires]
      );
      return { sessionId };
    } else {
      throw 'Authentication failed.';
    }
  });
}

/*
  Log out of the admin session ...
*/
export async function destroySession(sessionId) {
  return await db.tx('destroy-session', async t => {
    await t.any('DELETE FROM sessions WHERE session_id = $1', [sessionId]);
    return true;
  });
}

/**
 * List posts (either public, or all if you are the site owner)
 */
export async function getPosts(currentUser) {
  return db.tx('get-posts', async t => {
    let posts;
    if (currentUser) {
      posts = await t.any(`
        SELECT
          p.*,
          (SELECT
            coalesce(json_agg(x.*), '[]'::json)
            FROM
            (
              SELECT
                coalesce(f.name, f.email) AS name
              FROM recipients r
              INNER JOIN friends f ON (r.friend_id=f.friend_id)
              WHERE r.post_id = p.post_id
            ) x
          ) AS recipients
        FROM posts p;
      `);
    } else {
      posts = await t.any('SELECT * FROM posts WHERE is_public IS TRUE ORDER BY created_at DESC');
    }
    return posts;
  });
}

/**
 * List all friends/contacts.
 */
export async function getFriends(currentUser) {
  if (!currentUser) throw new Error('Not authorized');
  return db.tx('get-friends', async t => {
      return t.any('SELECT * FROM friends ORDER BY created_at DESC');
  });
}

/**
 * Get friend for a given friendId
 */
export async function getFriend(friendId) {
  return await db.tx('get-friend', async t => {
    const friend = await t.one('SELECT * FROM friends WHERE friend_id = $1', [friendId]);
    return { ...friend };
  });
}

/**
 * Create a new friend
 */
export async function createFriend(name, email, currentUser) {
  if (!currentUser) throw new Error('Not authorized');

  return await db.tx('create-friend', async t => {
    const friend = await t.one(
      'INSERT INTO friends (name, email) VALUES ($1, $2) RETURNING friend_id, created_at',
      [name, email]
    );
    return friend;
  });
}

export async function updateFriend(friendId, name, email, currentUser) {
  if (!currentUser) throw new Error('Not authorized');
  return await db.tx('update-friend', async t => {
    return await t.one(
      'UPDATE friends SET name= $1, email = $2, updated_at = NOW() WHERE friend_id = $3 RETURNING friend_id, updated_at',
      [name, email, friendId]
    );
  });
}

export async function deleteFriend(friendId, currentUser) {
  if (!currentUser) throw new Error('Not authorized');
  return await db.tx('delete-friend', async t => {
    await t.any('DELETE FROM friends WHERE friend_id = $1', [friendId]);
    return true;
  });
}

/**
 * Get post for a given slug
 */
export async function getPostBySlug(slug) {
  return await db.tx('get-post-by-slug', async t => {
    const post = await t.one('SELECT * FROM posts WHERE slug = $1', [slug]);
    return { ...post };
  });
}

/**
 * Remove a post
 */
export async function deletePost(slug, currentUser) {
  if (!currentUser) throw new Error('Not authorized');
  return await db.tx('delete-post', async t => {
    await t.any('DELETE FROM posts WHERE slug = $1', [slug]);
    return true;
  });
}

/**
 * In this minimal setup there is only one user, the website admin.
 * If you want to support multiple users/authors you want to return the current user record here.
 */
export async function getCurrentUser(sessionId) {
  return await db.tx('get-current-user', async t => {
    const session = await t.oneOrNone('SELECT session_id FROM sessions WHERE session_id = $1', [
      sessionId
    ]);
    if (session) {
      return {
        name: 'Admin'
      };
    } else {
      return null;
    }
  });
}

/**
 * Update the page
 */
export async function createOrUpdatePage(pageId, page, currentUser) {
  if (!currentUser) throw new Error('Not authorized');
  return await db.tx('create-or-update-page', async t => {
    const pageExists = await t.oneOrNone('SELECT page_id FROM pages WHERE page_id = $1', [pageId]);
    if (pageExists) {
      return await t.one('UPDATE pages SET data = $1 WHERE page_id = $2 RETURNING page_id', [
        page,
        pageId
      ]);
    } else {
      return await t.one('INSERT INTO pages (page_id, data) values($1, $2) RETURNING page_id', [
        pageId,
        page
      ]);
    }
  });
}

/**
 * Search within friends (contacts)
 */
export async function searchFriends(q, currentUser) {
  return await db.tx('search-friends', async t => {
    let result;
    if (currentUser) {
      result = await t.any(
        "SELECT * FROM friends WHERE email ILIKE $1 OR name ILIKE $1 ORDER BY created_at DESC LIMIT 6",
        [`%${q}%`]
      );
    }
    return result;
  });
}

/**
 * E.g. getPage("home") gets all dynamic data for the home page
 */
export async function getPage(pageId) {
  return await db.tx('get-page', async t => {
    const page = await t.oneOrNone('SELECT data FROM pages WHERE page_id = $1', [pageId]);
    return page?.data;
  });
}

/**
 * TODO: Turn this into a Postgres function
 */
export async function createOrUpdateCounter(counterId) {
  return await db.tx('create-or-update-counter', async t => {
    const counterExists = await t.oneOrNone(
      'SELECT counter_id FROM counters WHERE counter_id = $1',
      [counterId]
    );
    if (counterExists) {
      return await t.one(
        'UPDATE counters SET count = count + 1 WHERE counter_id = $1 RETURNING count',
        [counterId]
      );
    } else {
      return await t.one('INSERT INTO counters (counter_id, count) values($1, 1) RETURNING count', [
        counterId
      ]);
    }
  });
}

export async function getSitemap() {
  return await db.tx('get-sitemap', async t => {
    const posts = await t.any(
      'SELECT slug, published_at, COALESCE(published_at, updated_at) AS modified_at FROM posts ORDER BY published_at DESC'
    );

    const { updatedAt } = await t.oneOrNone(
      'SELECT updated_at FROM pages WHERE page_id = $1',
      'home'
    );

    const sitemap = [];
    posts.forEach(a => {
      sitemap.push({
        url: `/p/${a.slug}`,
        lastmod: new Date(a.modifiedAt).toISOString()
      });
    });
    return sitemap.concat([{ url: '/', lastmod: new Date(updatedAt).toISOString() }]);
  });
}

/**
 * Helpers
 */
function __getDateTimeMinutesAfter(minutes) {
  return new Date(new Date().getTime() + minutes * 60000).toISOString();
}

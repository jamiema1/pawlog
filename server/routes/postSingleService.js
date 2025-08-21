import oracledb from "oracledb";
import { withOracleDB } from "./appService.js";

export async function getPostById(id) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `
      SELECT
        p.post_id AS "post_id",
        p.title AS "title",
        p.created_at AS "created_at",
        p.likes AS "likes",
        u.username AS "author",
        pc.content AS "content"
      FROM
        Posts p,
        PostsContent pc,
        Users u
      WHERE
        p.title = pc.title AND
        p.created_at = pc.created_at AND
        p.user_id = pc.user_id AND
        p.user_id = u.user_id AND
        p.post_id = :id
      `,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }).catch((err) => {
    console.error("Error in getPostById:", err);
    return null;
  });
}

export async function deletePostById(id) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `
      DELETE
      FROM
        Posts p
      WHERE
        p.post_id = :id
      `,
      { id },
      { autoCommit: true } 
    );
    return result.rowsAffected > 0
  }).catch((err) => {
    console.error("Error in deletePostById:", err);
    return false;
  });
}


export async function getPostCommentsById(id) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `
      SELECT 
        c.comment_id AS,
        c.created_at,
        u.username,
        cc.content
      FROM 
        Comments c,
        CommentsContent cc,
        Users u
      WHERE 
        c.created_at = cc.created_at AND
        c.user_id = cc.user_id AND
        c.post_id = cc.post_id AND
        c.user_id = u.user_id AND
        c.post_id = :id
      ORDER BY 
        c.created_at ASC
      `,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows;
  }).catch((err) => {
    console.error("Error in getPostCommentsById:", err);
    return null;
  });
}


export async function addComment({ postId, userId, content }) {
  return await withOracleDB(async (connection) => {
    const now = new Date();

    const result1 = await connection.execute(
      `
      INSERT INTO Comments (comment_id, created_at, user_id, post_id)
      VALUES ((SELECT NVL(MAX(comment_id), 0) + 1 FROM Comments), :created_at, :user_id, :post_id)
      `,
      {
        created_at: now,
        user_id: userId,
        post_id: postId,
      }
    );

    const result2 = await connection.execute(
      `
      INSERT INTO CommentsContent (content, created_at, user_id, post_id)
      VALUES (:content, :created_at, :user_id, :post_id)
      `,
      {
        content,
        created_at: now,
        user_id: userId,
        post_id: postId,
      }
    );

    await connection.commit();
    return true;
  }).catch((err) => {
    console.error('Error in addComment:', err);
    return false
  });
}


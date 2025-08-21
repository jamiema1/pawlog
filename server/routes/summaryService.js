import oracledb from "oracledb";
import { withOracleDB } from "./appService.js";
import OracleDB from "oracledb";

export async function getMostLikedUsers() {
  const innerSQL = `
    SELECT
      AVG(p2.likes)
    FROM
      Posts p2
  `
  
  const outerSQL = `
    SELECT
      p1.user_id as "user_id",
      u.username as "username",
      ROUND(AVG(p1.likes), 1) as "avg_likes"
    FROM
      Posts p1,
      Users u
    WHERE
      p1.user_id = u.user_id
    GROUP BY
      p1.user_id,
      u.username
    HAVING
      AVG(p1.likes) >= (${innerSQL})
    ORDER BY
      AVG(p1.likes) DESC
  `

  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      outerSQL,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

export async function getUsersCommentedOnAll(username) {
  // Finds all comments made by u on post p
  const innerInnerSQL = `
    SELECT
      *
    FROM
      Comments c
    WHERE
      p.post_id = c.post_id AND
      c.user_id = u.user_id
  `
  
  // Finds all post p that have not had a comment made by u
  const innerSQL = `
    SELECT
      *
    FROM
      Posts p,
      Users u2
    WHERE
      p.user_id = u2.user_id AND
      u2.username = :username AND
      NOT EXISTS (${innerInnerSQL})
  `
  
  // Finds all users that have not made a comment
  const outerSQL = `
    SELECT
      u.username as "username"
    FROM
      Users u
    WHERE
      NOT EXISTS (${innerSQL})
  `

  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      outerSQL,
      { username },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

export async function getPostsByPetForUser(username) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT
        pets.pet_id as "pet_id",
        pets.name as "name",
        COUNT(*) as "count"
      FROM
        posts,
        petPostsIncludes,
        pets,
        users
      WHERE
        posts.post_id = petPostsIncludes.post_id AND
        pets.pet_id = petPostsIncludes.pet_id AND
        posts.user_id = users.user_id AND
        users.username = :username
      GROUP BY
        pets.pet_id,
        pets.name
      ORDER BY
        COUNT(*) DESC`,
      { username },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}
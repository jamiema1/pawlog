import * as dotenv from 'dotenv'
import { withOracleDB } from './appService.js';
import OracleDB from 'oracledb';

dotenv.config()

export async function getTags() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT
        tags.tag_name as "tag_name",
        COUNT(*) as "count"
      FROM
        tags,
        taggedwith,
        posts
      WHERE
        tags.tag_id = taggedwith.tag_id AND
        taggedwith.post_id = posts.post_id
      GROUP BY
        tags.tag_name
      HAVING
        COUNT(*) >= 3
      ORDER BY
        COUNT(*) DESC,
        tags.tag_name DESC`,
      [],
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}
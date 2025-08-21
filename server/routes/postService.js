import oracledb from "oracledb";
import { withOracleDB } from "./appService.js";

export async function getPostsSummary(username, created_at, minlikes) {
	let query = `
		SELECT
			p.post_id as "post_id",
			p.title as "title",
			p.created_at as "created_at",
			p.likes as "likes",
			p.thumbnail AS "thumbnail",
			u.user_id as "user_id",
			u.username as "author"
		FROM
			Posts p,
			Users u
		WHERE
			p.user_id = u.user_id`

	const dataBinds = {}

	if (username !== '') {
		query += ` AND u.username = :username`
		dataBinds.username = username
	}
	if (created_at !== '') {
		query += ` AND TRUNC(p.created_at) = TO_DATE(:created_at, 'Month DD, YYYY')`
		dataBinds.created_at = created_at
	}
	if (minlikes !== '') {
		query += ` AND p.likes > :minlikes`
		dataBinds.minlikes = minlikes
	}

	return await withOracleDB(async (connection) => {
		const result = await connection.execute(
			query,
			dataBinds,
			{ outFormat: oracledb.OUT_FORMAT_OBJECT }
		);
		return result.rows;
	}).catch(() => {
		return [];
	});
}
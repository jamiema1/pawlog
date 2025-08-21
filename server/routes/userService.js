import { withOracleDB } from "./appService.js";

export async function getUsers() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`SELECT * FROM USERS`);
    return result.rows;
  }).catch((err) => {
    console.error("Error in getUsers:", err);
    return [];
  });
}

export async function checkUsernameTaken(username) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT
        username
      FROM
        Users
      WHERE
        username = :username`,
      { username }
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

export async function addUser(id, username, password, firstname, lastname) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO Users VALUES (:id, :username, :password, :firstname, :lastname, SYSDATE, 0)`,
      { id, username, password, firstname, lastname },
      { autoCommit: true }
    );
    return result.rows;
  }).catch(() => {
    return -1;
  });
}

export async function loginUser(username, password) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT password FROM Users WHERE username=:username`,
      { username }
    );
    return result.rows[0][0] == password;
  }).catch(() => {
    return -1;
  });
}


export async function getMaxUserID() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT MAX(user_id) FROM Users`
    );
    return result.rows[0][0];
  }).catch(() => {
    return -1;
  });
}

export async function getPostingUsers() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT DISTINCT
        u.username
      FROM
        Users u,
        Posts p
      WHERE
        u.user_id = p.user_id
      ORDER BY
        u.username
    `);
    return result.rows;
  }).catch((err) => {
    console.error("Error in getPostingUsers:", err);
    return [];
  });
}
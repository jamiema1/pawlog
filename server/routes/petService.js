import * as dotenv from 'dotenv'
import { withOracleDB } from './appService.js';
import OracleDB from 'oracledb';

dotenv.config()

export async function getPetsByUser(username) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT
        pets.pet_id as "pet_id",
        pets.name as "name",
        pets.birthday as "birthday",
        pets.species as "species"
      FROM
        pets,
        hasOwner,
        users
      WHERE
        users.user_id = hasOwner.user_id AND
        hasOwner.pet_id = pets.pet_id AND
        users.username = :username`,
      { username },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

export async function getPetsByUserAndSpecies(username, species) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT
        pets.pet_id as "pet_id",
        pets.name as "name",
        pets.birthday as "birthday",
        pets.species as "species"
      FROM
        pets,
        hasOwner,
        users
      WHERE
        users.user_id = hasOwner.user_id AND
        hasOwner.pet_id = pets.pet_id AND
        users.username = :username AND
        pets.species = :species`,
      { username, species },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

export async function updatePetsByPetID(pet_id, name, birthday, species) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      UPDATE
        pets
      SET
        pets.name = :name,
        pets.birthday = :birthday,
        pets.species = :species
      WHERE
        pets.pet_id = :pet_id`,
      { pet_id, name, birthday, species },
      { autoCommit: true } 
    );
    return result.rowsAffected > 0 ? true : false;
  }).catch(() => {
    return false;
  });
}

export async function getSpeciesByUser(username) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT UNIQUE
        pets.species
      FROM
        pets,
        hasOwner,
        users
      WHERE
        users.user_id = hasOwner.user_id AND
        hasOwner.pet_id = pets.pet_id AND
        users.username = :username`,
      { username }
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}
import express from 'express';
import { getPetsByUser, getPetsByUserAndSpecies, getSpeciesByUser, updatePetsByPetID } from './petService.js';

const petRouter = express.Router();

petRouter.get('/:username/species', async (req, res) => {
  const username = req.params.username;
  const tableContent = await getSpeciesByUser(username);
  res.json({data: tableContent.flat()});
});

petRouter.get('/:username', async (req, res) => {
  const username = req.params.username;
  const tableContent = await getPetsByUser(username);
  res.json({data: tableContent});
});

petRouter.get('/:username/:species', async (req, res) => {
  const username = req.params.username;
  const species = req.params.species
  const tableContent = await getPetsByUserAndSpecies(username, species);
  res.json({data: tableContent});
});

petRouter.put('/:pet_id', async (req, res) => {
  const pet_id = req.params.pet_id;
  const name = req.body.name
  const birthday = new Date(req.body.birthday)
  const species = req.body.species
  const success = await updatePetsByPetID(pet_id, name, birthday, species);

  if (success) {
    return res.sendStatus(204);
  } else {
    return res.status(500).json({ message: 'Failed to update pet' });
  } 
});

export default petRouter;
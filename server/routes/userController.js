import express from 'express';
import { getPostingUsers, getUsers, checkUsernameTaken, getMaxUserID, addUser, loginUser } from './userService.js';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    const tableContent = await getUsers();
    res.json({data: tableContent});
});

userRouter.get('/addUser', async (req, res) => {
    if (!req.query['username'] || req.query['username'].length === 0) {
        res.json({usernameerror: 'Username must be given.'});
        return;
    }
    if (!req.query['password'] || req.query['password'].length === 0) {
        res.json({passworderror: 'Password must be given.'});
        return;
    }
    if (!req.query['firstname'] || req.query['firstname'].length === 0) {
        res.json({firstnameerror: 'First name must be given.'});
        return;
    }
    if (!req.query['lastname'] || req.query['lastname'].length === 0) {
        res.json({lastnameerror: 'Last name must be given.'});
        return;
    }
    const userExistenceResult = await checkUsernameTaken(
        req.query['username']
    );
    if (Object.keys(userExistenceResult).length !== 0) {
        res.json({usernameerror: 'Username is taken.'});
        return;
    }
    const maxIDResult = await getMaxUserID();
    if (maxIDResult == -1) {
        res.json({error: 'An unknown error occured.'});
        return;
    }
    const newUserID = maxIDResult + 1;
    const userAddResult = await addUser(
        newUserID, 
        req.query['username'], req.query['password'],
        req.query['firstname'], req.query['lastname']
    );
    if (userAddResult == -1) {
        res.json({error: 'An unknown error occured.'});
        return;
    }
    res.json("Success.");
});

userRouter.get('/loginUser', async (req, res) => {
    if (!req.query['username'] || req.query['username'].length === 0) {
        res.json({usernameerror: 'Username must be given.'});
        return;
    }
    if (!req.query['password'] || req.query['password'].length === 0) {
        res.json({passworderror: 'Password must be given.'});
        return;
    }
    const userExistenceResult = await checkUsernameTaken(
        req.query['username']
    );
    if (Object.keys(userExistenceResult).length === 0) {
        res.json({usernameerror: 'No user with that username exists.'});
        return;
    }

    const loginResult = await loginUser(
        req.query['username'], req.query['password']
    );

    if (loginResult == -1) {
        res.json({error: 'An unknown error occured.'});
        return;
    }

    if (loginResult === false) {
        res.json({passworderror: 'Password does not match username.'});
        return;
    }

    res.json("Success.");
});

userRouter.get('/postingUsers', async (req, res) => {
    const tableContent = await getPostingUsers();
    res.json({data: tableContent.flat()});
});

export default userRouter;
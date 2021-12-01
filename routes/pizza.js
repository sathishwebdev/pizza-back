import express from 'express';
import {
    allPizza,
    getById,
} from '../helper.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router
.route('/')
.get( allPizza)

router
.route('/:id')
.get(auth, getById );

export const foodRouter = router
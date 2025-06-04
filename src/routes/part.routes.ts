import { Router } from 'express';
import { createPart, addInventory } from '../controllers/part.controller';

const router = Router();

router.post('/', createPart);
router.post('/:partId', addInventory);

export default router;

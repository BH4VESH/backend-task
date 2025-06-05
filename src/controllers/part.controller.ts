import { Request, Response, NextFunction } from 'express';
import * as PartService from '../services/part.service';

export async function createPart(req: Request, res: Response, next: NextFunction) {
  try {
    const part = await PartService.createPart(req.body);
    res.status(201).json(part);
  } catch (err) {
    next(err);
  }
}

export async function addInventory(req: Request, res: Response, next: NextFunction) {
  try {
    const partId = req.params.partId;
    const result = await PartService.addInventory(partId, req.body.quantity);
    res.status(result.status === 'SUCCESS' ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
}



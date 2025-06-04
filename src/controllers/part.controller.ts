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

// import { Part, PartType } from '../models/part.model';

// export async function createPart(data: any) {
//   if (data.type === PartType.ASSEMBLED && data.parts) {
//     const existingPartIds = await Part.find({ _id: { $in: data.parts.map((p: any) => p.id) } });
//     if (existingPartIds.length !== data.parts.length) throw new Error('Invalid part references');
//     // optional: add circular dependency check here
//   }
//   const part = new Part({ ...data });
//   return part.save();
// }

// export async function addInventory(partId: string, quantity: number) {
//   try {
//     const part = await Part.findById(partId);
//     if (!part) throw new Error('Part not found');

//     if (part.type === PartType.RAW) {
//       part.quantity += quantity;
//       await part.save();
//     } else {
//       // Validate if all required sub-parts are available
//       for (let i = 0; i < quantity; i++) {
//         for (const c of part.parts || []) {
//           const subPart = await Part.findById(c.id);
//           if (!subPart || subPart.quantity < c.quantity) {
//             throw new Error(`Insufficient quantity - ${c.id}`);
//           }
//         }
//       }

//       // Deduct and assemble
//       for (let i = 0; i < quantity; i++) {
//         for (const c of part.parts || []) {
//           const subPart = await Part.findById(c.id);
//           if (subPart) {
//             subPart.quantity -= c.quantity;
//             await subPart.save();
//           }
//         }
//         part.quantity++;
//       }
//       await part.save();
//     }

//     return { status: 'SUCCESS' };
//   } catch (e: any) {
//     return { status: 'FAILED', message: e.message };
//   }
// }

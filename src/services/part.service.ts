// import { Part, PartType } from '../models/part.model';
// import mongoose from 'mongoose';

// export async function createPart(data: any) {
//   if (data.type === PartType.ASSEMBLED && data.parts) {
//     const existingPartIds = await Part.find({ _id: { $in: data.parts.map((p: any) => p.id) } });
//     if (existingPartIds.length !== data.parts.length) throw new Error('Invalid part references');
//     // check circular dependency logic here
//   }
//   const part = new Part({ ...data });
//   return part.save();
// }

// export async function addInventory(partId: string, quantity: number) {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const part = await Part.findById(partId).session(session);
//     if (!part) throw new Error('Part not found');
//     if (part.type === PartType.RAW) {
//       part.quantity += quantity;
//       await part.save({ session });
//     } else {
//       for (let i = 0; i < quantity; i++) {
//         for (const c of part.parts || []) {
//           const subPart = await Part.findById(c.id).session(session);
//           if (!subPart || subPart.quantity < c.quantity) {
//             throw new Error(`Insufficient quantity - ${c.id}`);
//           }
//           subPart.quantity -= c.quantity;
//           await subPart.save({ session });
//         }
//         part.quantity++;
//       }
//       await part.save({ session });
//     }
//     await session.commitTransaction();
//     return { status: 'SUCCESS' };
//   } catch (e: any) {
//     await session.abortTransaction();
//     return { status: 'FAILED', message: e.message };
//   } finally {
//     session.endSession();
//   }
// }



import { Part, PartType } from '../models/part.model';

export async function createPart(data: any) {
  if (data.type === PartType.ASSEMBLED && data.parts) {
    const existingPartIds = await Part.find({ _id: { $in: data.parts.map((p: any) => p.id) } });
    if (existingPartIds.length !== data.parts.length) throw new Error('Invalid part references');
    // optional: add circular dependency check here
  }
  const part = new Part({ ...data });
  return part.save();
}

export async function addInventory(partId: string, quantity: number) {
  try {
    const part = await Part.findById(partId);
    if (!part) throw new Error('Part not found');

    if (part.type === PartType.RAW) {
      part.quantity += quantity;
      await part.save();
    } else {
      // Validate if all required sub-parts are available
      for (let i = 0; i < quantity; i++) {
        for (const c of part.parts || []) {
          const subPart = await Part.findById(c.id);
          if (!subPart || subPart.quantity < c.quantity) {
            throw new Error(`Insufficient quantity - ${c.id}`);
          }
        }
      }

      // Deduct and assemble
      for (let i = 0; i < quantity; i++) {
        for (const c of part.parts || []) {
          const subPart = await Part.findById(c.id);
          if (subPart) {
            subPart.quantity -= c.quantity;
            await subPart.save();
          }
        }
        part.quantity++;
      }
      await part.save();
    }

    return { status: 'SUCCESS' };
  } catch (e: any) {
    return { status: 'FAILED', message: e.message };
  }
}

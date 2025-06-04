"use strict";
// import { Part, PartType } from '../models/part.model';
// import mongoose from 'mongoose';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPart = createPart;
exports.addInventory = addInventory;
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
const part_model_1 = require("../models/part.model");
function createPart(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data.type === part_model_1.PartType.ASSEMBLED && data.parts) {
            const existingPartIds = yield part_model_1.Part.find({ _id: { $in: data.parts.map((p) => p.id) } });
            if (existingPartIds.length !== data.parts.length)
                throw new Error('Invalid part references');
            // optional: add circular dependency check here
        }
        const part = new part_model_1.Part(Object.assign({}, data));
        return part.save();
    });
}
function addInventory(partId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const part = yield part_model_1.Part.findById(partId);
            if (!part)
                throw new Error('Part not found');
            if (part.type === part_model_1.PartType.RAW) {
                part.quantity += quantity;
                yield part.save();
            }
            else {
                // Validate if all required sub-parts are available
                for (let i = 0; i < quantity; i++) {
                    for (const c of part.parts || []) {
                        const subPart = yield part_model_1.Part.findById(c.id);
                        if (!subPart || subPart.quantity < c.quantity) {
                            throw new Error(`Insufficient quantity - ${c.id}`);
                        }
                    }
                }
                // Deduct and assemble
                for (let i = 0; i < quantity; i++) {
                    for (const c of part.parts || []) {
                        const subPart = yield part_model_1.Part.findById(c.id);
                        if (subPart) {
                            subPart.quantity -= c.quantity;
                            yield subPart.save();
                        }
                    }
                    part.quantity++;
                }
                yield part.save();
            }
            return { status: 'SUCCESS' };
        }
        catch (e) {
            return { status: 'FAILED', message: e.message };
        }
    });
}

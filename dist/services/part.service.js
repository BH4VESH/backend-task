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

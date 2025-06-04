"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const part_controller_1 = require("../controllers/part.controller");
const router = (0, express_1.Router)();
router.post('/', part_controller_1.createPart);
router.post('/:id', part_controller_1.addInventory);
exports.default = router;

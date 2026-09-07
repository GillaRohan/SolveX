"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const standardsController_js_1 = require("../controllers/standardsController.js");
const router = (0, express_1.Router)();
router.get('/', standardsController_js_1.getStandards);
router.post('/search', standardsController_js_1.searchStandards);
router.get('/:id', standardsController_js_1.getStandardById);
exports.default = router;

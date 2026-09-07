"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const laboratoriesController_js_1 = require("../controllers/laboratoriesController.js");
const router = (0, express_1.Router)();
router.get('/', laboratoriesController_js_1.getLaboratories);
router.post('/recommend', laboratoriesController_js_1.recommendLaboratories);
exports.default = router;

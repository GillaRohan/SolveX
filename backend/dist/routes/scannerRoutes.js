"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scannerController_js_1 = require("../controllers/scannerController.js");
const router = (0, express_1.Router)();
router.post('/verify-manual', scannerController_js_1.verifyManual);
router.post('/scan-image', scannerController_js_1.scanImage);
exports.default = router;

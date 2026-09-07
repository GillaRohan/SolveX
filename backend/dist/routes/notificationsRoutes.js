"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationsController_js_1 = require("../controllers/notificationsController.js");
const router = (0, express_1.Router)();
router.get('/', notificationsController_js_1.getNotifications);
router.post('/', notificationsController_js_1.createNotification);
exports.default = router;

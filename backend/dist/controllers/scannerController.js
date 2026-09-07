"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanImage = exports.verifyManual = void 0;
const verificationService_js_1 = require("../services/verificationService.js");
const verifyManual = async (req, res) => {
    try {
        const { licenceNumber } = req.body;
        if (!licenceNumber) {
            res.status(400).json({ success: false, message: 'Licence number, HUID, or registration number is required' });
            return;
        }
        const verification = await verificationService_js_1.VerificationService.verifyLicence(licenceNumber);
        res.json({ success: true, verification });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Verification failed' });
    }
};
exports.verifyManual = verifyManual;
const scanImage = async (req, res) => {
    try {
        const { imageBase64, detectedCode, targetProduct } = req.body;
        // Run computer vision mark detection simulation / AI image analysis
        const verification = await verificationService_js_1.VerificationService.analyzeProductImage({
            imageBase64,
            detectedCode,
            targetProduct
        });
        res.json({ success: true, verification });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Scanner image analysis failed' });
    }
};
exports.scanImage = scanImage;

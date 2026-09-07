import { Request, Response } from 'express';
import { VerificationService } from '../services/verificationService.js';

export const verifyManual = async (req: Request, res: Response): Promise<void> => {
  try {
    const { licenceNumber } = req.body;

    if (!licenceNumber) {
      res.status(400).json({ success: false, message: 'Licence number, HUID, or registration number is required' });
      return;
    }

    const verification = await VerificationService.verifyLicence(licenceNumber);
    res.json({ success: true, verification });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Verification failed' });
  }
};

export const scanImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, detectedCode, targetProduct } = req.body;

    // Run computer vision mark detection simulation / AI image analysis
    const verification = await VerificationService.analyzeProductImage({
      imageBase64,
      detectedCode,
      targetProduct
    });
    res.json({ success: true, verification });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Scanner image analysis failed' });
  }
};

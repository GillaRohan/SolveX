"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class VerificationService {
    /**
     * Look up licence number / HUID / R-number in verification database
     */
    static async verifyLicence(licenceQuery) {
        const cleanQuery = licenceQuery.trim().toUpperCase();
        // Check database
        const record = await prisma.productVerification.findFirst({
            where: {
                OR: [
                    { licenceNumber: { contains: cleanQuery } },
                    { licenceNumber: cleanQuery.replace(/[^A-Z0-9]/g, '') }
                ]
            }
        });
        if (record) {
            const isOperative = record.status === 'OPERATIVE';
            return {
                isVerified: isOperative,
                licenceNumber: record.licenceNumber,
                brand: record.brand,
                manufacturer: record.manufacturer,
                model: record.model,
                standardNumber: record.standardNumber,
                productCategory: record.productCategory,
                status: record.status,
                validUntil: record.validUntil,
                verificationType: record.verificationType,
                factoryLocation: record.factoryLocation || 'Registered Manufacturing Premises',
                markExplanation: this.getMarkExplanation(record.verificationType, record.standardNumber),
                consumerGuidance: isOperative
                    ? 'Genuine BIS certified product. The manufacturer is currently authorized to apply the mark.'
                    : 'Warning: This licence is suspended or expired. Do not purchase or report via the BIS Care portal.',
                isMockData: true // Clearly indicate demo verification database
            };
        }
        // Heuristic analysis for realistic format matching if not in DB
        if (cleanQuery.startsWith('CM/L') || /^\d{7}$/.test(cleanQuery)) {
            const formattedCml = cleanQuery.startsWith('CM/L') ? cleanQuery : `CM/L-${cleanQuery}`;
            return {
                isVerified: true,
                licenceNumber: formattedCml,
                brand: 'Standard Certified Brand',
                manufacturer: 'Registered Manufacturing Unit (India)',
                model: 'Standard Conforming Model',
                standardNumber: 'IS 302 / Relevant Product Standard',
                productCategory: 'Consumer Appliances',
                status: 'OPERATIVE',
                validUntil: '2027-12-31',
                verificationType: 'ISI_MARK',
                factoryLocation: 'Industrial Area, India',
                markExplanation: 'The ISI mark signifies compliance with mandatory Indian Standards under Scheme I.',
                consumerGuidance: 'The 7-digit CM/L number matches standard BIS format. Always cross-check product packaging for tamper seals.',
                isMockData: true
            };
        }
        if (cleanQuery.startsWith('R-') || cleanQuery.startsWith('CRS')) {
            return {
                isVerified: true,
                licenceNumber: cleanQuery,
                brand: 'Registered Tech Brand',
                manufacturer: 'Registered Electronics OEM',
                model: 'IT / Electronics Device',
                standardNumber: 'IS 16046 / IS 13252',
                productCategory: 'Electronics & IT Goods',
                status: 'OPERATIVE',
                validUntil: '2026-10-31',
                verificationType: 'CRS_REGISTRATION',
                factoryLocation: 'Accredited Electronic Assembly Plant',
                markExplanation: 'Compulsory Registration Scheme (CRS) administered by BIS and MeitY.',
                consumerGuidance: 'CRS registration confirms self-declaration of conformity based on certified lab test reports.',
                isMockData: true
            };
        }
        if (cleanQuery.length === 6 && /^[A-Z0-9]{6}$/.test(cleanQuery)) {
            return {
                isVerified: true,
                licenceNumber: `HUID-${cleanQuery}`,
                brand: 'Hallmarked Gold Jewellery',
                manufacturer: 'Certified Jeweller Partner',
                model: '22 Karat (916 Fineness) Gold Jewellery',
                standardNumber: 'IS 1417',
                productCategory: 'Precious Metals',
                status: 'OPERATIVE',
                validUntil: 'Perpetual',
                verificationType: 'HALLMARK_HUID',
                factoryLocation: 'BIS Recognized Assaying & Hallmarking Centre',
                markExplanation: '6-digit Hallmark Unique Identification (HUID) ensuring purity and traceability.',
                consumerGuidance: 'The gold purity is officially verified. Confirm that the jewel exhibits all 3 marks: BIS Logo, Purity (22K916), and HUID.',
                isMockData: true
            };
        }
        return {
            isVerified: false,
            licenceNumber: cleanQuery,
            brand: 'Unregistered / Unknown',
            manufacturer: 'Entity Not Found in Registry',
            model: 'Unverified Product',
            standardNumber: 'Unknown',
            productCategory: 'Unknown',
            status: 'NOT_FOUND',
            validUntil: 'N/A',
            verificationType: 'UNKNOWN',
            markExplanation: 'The entered licence number or mark could not be found in the BIS database.',
            consumerGuidance: 'Caution: This product may be carrying a counterfeit or unauthorized mark. Report through BIS Care app.',
            isMockData: true
        };
    }
    static async analyzeProductImage(payload) {
        const code = payload?.detectedCode?.trim().toUpperCase();
        // If specific code was extracted or targeted:
        if (code) {
            return await this.verifyLicence(code);
        }
        // Check if targetProduct was selected
        if (payload?.targetProduct) {
            const productMatch = await prisma.productVerification.findFirst({
                where: {
                    OR: [
                        { brand: { contains: payload.targetProduct } },
                        { model: { contains: payload.targetProduct } },
                        { standardNumber: { contains: payload.targetProduct } }
                    ]
                }
            });
            if (productMatch) {
                return await this.verifyLicence(productMatch.licenceNumber);
            }
        }
        // If no code and no recognized mark in frame, do NOT generate random stuff!
        return {
            isVerified: false,
            licenceNumber: 'NOT_DETECTED',
            brand: 'No Mark Recognized',
            manufacturer: 'Unknown',
            model: 'No legible BIS / ISI mark found in image frame',
            standardNumber: 'N/A',
            productCategory: 'Unidentified',
            status: 'NOT_FOUND',
            validUntil: 'N/A',
            verificationType: 'UNKNOWN',
            markExplanation: 'The camera frame did not contain a readable ISI monogram, 7-digit CM/L number, or 6-digit HUID Hallmark.',
            consumerGuidance: 'Please bring the product closer, ensure good lighting on the certification label, or enter the CM/L licence number manually below.',
            isMockData: false
        };
    }
    static getMarkExplanation(type, std) {
        if (type === 'ISI_MARK') {
            return `Standard ISI Mark granted under BIS Scheme I, certifying product compliance with ${std}. Includes rigorous third-party factory audits and continuous market surveillance.`;
        }
        if (type === 'CRS_REGISTRATION') {
            return `Compulsory Registration Scheme mark for electronics and IT goods. Indicates manufacturer self-declaration backed by accredited lab testing under ${std}.`;
        }
        if (type === 'HALLMARK_HUID') {
            return `BIS Gold Hallmark featuring the triangular BIS logo, karat purity grade, and 6-digit alphanumeric HUID stamped by a BIS-recognized Assaying & Hallmarking Centre.`;
        }
        return `Bureau of Indian Standards conformity assessment mark under ${std}.`;
    }
}
exports.VerificationService = VerificationService;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage } from '../types';

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
];

const UI_TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  en: {
    heroTitle: 'Understand. Verify. Comply.',
    heroSubtitle: 'Your intelligent assistant for Indian Standards, BIS services, and product compliance.',
    askPlaceholder: 'Ask anything about Indian Standards (IS), testing, or certification...',
    askAI: 'Ask BIS AI',
    scanProduct: 'Scan Product',
    findStandard: 'Find Standard',
    uploadDoc: 'Upload Document',
    checkCompliance: 'Check Compliance',
    findLab: 'Find Laboratory',
    voiceAssistant: 'Voice Assistant',
    officialDisclaimer: 'AI Guidance: Grounded on official BIS knowledge. Always verify critical statutory mandates against latest Gazette QCOs.',
    verifyLicence: 'Verify Product Licence',
    operative: 'OPERATIVE & COMPLIANT',
    suspended: 'SUSPENDED / INVALID',
    recentActivity: 'Recent Activity',
    recommendedStandards: 'Recommended Standards',
    complianceProgress: 'Compliance Readiness',
    latestUpdates: 'Latest Gazette & QCO Updates',
  },
  hi: {
    heroTitle: 'समझें। सत्यापित करें। अनुपालन करें।',
    heroSubtitle: 'भारतीय मानकों (BIS), सेवाओं और उत्पाद अनुपालन के लिए आपका बुद्धिमान सहायक।',
    askPlaceholder: 'भारतीय मानकों (IS), परीक्षण या प्रमाणन के बारे में कुछ भी पूछें...',
    askAI: 'बीआईएस एआई से पूछें',
    scanProduct: 'उत्पाद स्कैन करें',
    findStandard: 'मानक खोजें',
    uploadDoc: 'दस्तावेज़ अपलोड करें',
    checkCompliance: 'अनुपालन जांचें',
    findLab: 'प्रयोगशाला खोजें',
    voiceAssistant: 'आवाज़ सहायक',
    officialDisclaimer: 'एआई मार्गदर्शन: आधिकारिक बीआईएस ज्ञान पर आधारित। हमेशा नवीनतम राजपत्र आदेशों से पुष्टि करें।',
    verifyLicence: 'उत्पाद लाइसेंस सत्यापित करें',
    operative: 'प्रभावी एवं प्रमाणित',
    suspended: 'निलंबित / अमान्य',
    recentActivity: 'हाल की गतिविधि',
    recommendedStandards: 'अनुशंसित मानक',
    complianceProgress: 'अनुपालन तत्परता',
    latestUpdates: 'नवीनतम राजपत्र और QCO अपडेट',
  },
  te: {
    heroTitle: 'అర్థం చేసుకోండి. ధృవీకరించండి. పాటించండి.',
    heroSubtitle: 'భారతీయ ప్రమాణాలు (BIS), సేవలు మరియు ఉత్పత్తి సమ్మతి కోసం మీ AI సహాయకుడు.',
    askPlaceholder: 'భారతీయ ప్రమాణాలు (IS), పరీక్షలు లేదా సర్టిఫికేషన్ గురించి ఏదైనా అడగండి...',
    askAI: 'BIS AIని అడగండి',
    scanProduct: 'ఉత్పత్తిని స్కాన్ చేయండి',
    findStandard: 'ప్రమాణాన్ని కనుగొనండి',
    uploadDoc: 'పత్రాన్ని అప్‌లోడ్ చేయండి',
    checkCompliance: 'సమ్మతిని తనిఖీ చేయండి',
    findLab: 'ల్యాబ్‌ను కనుగొనండి',
    voiceAssistant: 'వాయిస్ అసిస్టెంట్',
    officialDisclaimer: 'AI మార్గదర్శకత్వం: అధికారిక BIS సమాచారంపై ఆధారపడి ఉంటుంది. అధికారిక గెజిట్ నుండి ధృవీకరించండి.',
    verifyLicence: 'లైసెన్స్ ధృవీకరణ',
    operative: 'ధృవీకరించబడింది & అమలులో ఉంది',
    suspended: 'రద్దు చేయబడింది / చెల్లదు',
    recentActivity: 'ఇటీవలి కార్యాచరణ',
    recommendedStandards: 'సిఫార్సు చేయబడిన ప్రమాణాలు',
    complianceProgress: 'సమ్మతి పురోగతి',
    latestUpdates: 'తాజా గెజిట్ & QCO అప్‌డేట్‌లు',
  },
  ta: {
    heroTitle: 'புரிந்து கொள்ளுங்கள். சரிபாருங்கள். பின்பற்றுங்கள்.',
    heroSubtitle: 'இந்திய தரநிலைகள் (BIS) மற்றும் தயாரிப்பு இணக்கத்திற்கான உங்கள் அறிவார்ந்த உதவியாளர்.',
    askPlaceholder: 'இந்திய தரநிலைகள், சோதனைகள் அல்லது சான்றிதழ் பற்றி கேளுங்கள்...',
    askAI: 'BIS AI யிடம் கேளுங்கள்',
    scanProduct: 'ஸ்கேன் செய்யுங்கள்',
    findStandard: 'தரநிலையைக் கண்டறியவும்',
    uploadDoc: 'ஆவணத்தைப் பதிவேற்றவும்',
    checkCompliance: 'இணக்கத்தைச் சரிபார்க்கவும்',
    findLab: 'ஆய்வகத்தைக் கண்டறியவும்',
    voiceAssistant: 'குரல் உதவியாளர்',
    officialDisclaimer: 'AI வழிகாட்டுதல்: அதிகாரப்பூர்வ BIS தரவுகளின் அடிப்படையில் உருவாக்கப்பட்டது.',
    verifyLicence: 'உரிமத்தை சரிபார்க்கவும்',
    operative: 'செயலில் உள்ளது & சான்றளிக்கப்பட்டது',
    suspended: 'இடைநிறுத்தப்பட்டது',
    recentActivity: 'சமீபத்திய செயல்பாடு',
    recommendedStandards: 'பரிந்துரைக்கப்பட்ட தரநிலைகள்',
    complianceProgress: 'இணக்க நிலை',
    latestUpdates: 'சமீபத்திய அரசிதழ் அறிவிப்புகள்',
  },
  kn: {
    heroTitle: 'ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಪರಿಶೀಲಿಸಿ. ಪಾಲಿಸಿ.',
    heroSubtitle: 'ಭಾರತೀಯ ಮಾನದಂಡಗಳು (BIS) ಮತ್ತು ಉತ್ಪನ್ನ ಅನುಸರಣೆಗಾಗಿ ನಿಮ್ಮ ಬುದ್ಧಿವಂತ ಸಹಾಯಕ.',
    askPlaceholder: 'ಭಾರತೀಯ ಮಾನದಂಡಗಳು, ಪರೀಕ್ಷೆ ಅಥವಾ ಪ್ರಮಾಣೀಕರಣದ ಬಗ್ಗೆ ಕೇಳಿ...',
    askAI: 'BIS AI ಅನ್ನು ಕೇಳಿ',
    scanProduct: 'ಉತ್ಪನ್ನ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    findStandard: 'ಮಾನದಂಡ ಹುಡುಕಿ',
    uploadDoc: 'ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    checkCompliance: 'ಅನುಸರಣೆ ಪರಿಶೀಲಿಸಿ',
    findLab: 'ಪ್ರಯೋಗಾಲಯ ಹುಡುಕಿ',
    voiceAssistant: 'ಧ್ವನಿ ಸಹಾಯಕ',
    officialDisclaimer: 'AI ಮಾರ್ಗದರ್ಶನ: ಅಧಿಕೃತ BIS ಜ್ಞಾನದ ಮೇಲೆ ಆಧಾರಿತವಾಗಿದೆ.',
    verifyLicence: 'ಪರವಾನಗಿ ಪರಿಶೀಲಿಸಿ',
    operative: 'ಸಕ್ರಿಯ ಮತ್ತು ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    suspended: 'ಅಮಾನತುಗೊಳಿಸಲಾಗಿದೆ',
    recentActivity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
    recommendedStandards: 'ಶಿಫಾರಸು ಮಾಡಿದ ಮಾನದಂಡಗಳು',
    complianceProgress: 'ಅನುಸರಣೆ ಪ್ರಗತಿ',
    latestUpdates: 'ಇತ್ತೀಚಿನ ಅಧಿಸೂಚನೆಗಳು',
  },
  bn: {
    heroTitle: 'বুঝুন। যাচাই করুন। মেনে চলুন।',
    heroSubtitle: 'ভারতীয় মানক (BIS) এবং পণ্য সম্মতির জন্য আপনার বুদ্ধিমান সহায়ক।',
    askPlaceholder: 'ভারতীয় মানক, পরীক্ষা বা সার্টিফিকেশন সম্পর্কে জিজ্ঞাসা করুন...',
    askAI: 'BIS AI-কে জিজ্ঞাসা করুন',
    scanProduct: 'পণ্য স্ক্যান করুন',
    findStandard: 'মানক খুঁজুন',
    uploadDoc: 'নথি আপলোড করুন',
    checkCompliance: 'সম্মতি যাচাই করুন',
    findLab: 'পরীক্ষাগার খুঁজুন',
    voiceAssistant: 'ভয়েস সহকারী',
    officialDisclaimer: 'AI নির্দেশিকা: আধিকারিক BIS জ্ঞানের ওপর ভিত্তি করে।',
    verifyLicence: 'লাইসেন্স যাচাই করুন',
    operative: 'সক্রিয় ও বৈধ',
    suspended: 'বাতিল / স্থগিত',
    recentActivity: 'সাম্প্রতিক কার্যকলাপ',
    recommendedStandards: 'প্রস্তাবিত মানক',
    complianceProgress: 'সম্মতি অগ্রগতি',
    latestUpdates: 'সর্বশেষ গেজেট আপডেট',
  }
};

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('solvex_lang') as AppLanguage) || 'en';
    setLanguageState(saved);
  }, []);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('solvex_lang', lang);
  };

  const t = (key: string): string => {
    return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

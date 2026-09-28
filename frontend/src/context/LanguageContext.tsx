import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage } from '../types';

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  region: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', region: 'National' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', region: 'राष्ट्रीय' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', region: 'ఆంధ్రప్రదేశ్ / తెలంగాణ' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', region: 'தமிழ்நாடு' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', region: 'ಕರ್ನಾಟಕ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', region: 'കേരളം' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', region: 'महाराष्ट्र' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', region: 'পশ্চিমবঙ্গ' },
];

export const UI_TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  en: {
    // Brand & Header
    appName: 'BIS Compliance Assistant',
    portalSubtitle: 'National Standards Intelligence Portal',
    portalTagline: 'Understand. Verify. Comply.',
    heroTitle: 'Understand. Verify. Comply.',
    heroSubtitle: 'Enterprise intelligence platform for Indian Standards (IS), BIS certification schemes, and statutory compliance.',
    officialDisclaimer: 'AI Guidance grounded on official Bureau of Indian Standards (BIS) knowledge and Gazette QCO mandates.',

    // Navigation & Sidebar
    overview: 'Overview',
    dashboard: 'Overview',
    aiAssistant: 'AI Assistant',
    productStandards: 'Product Standards',
    standardsCatalog: 'Product Standards',
    naturalTerms: 'Natural Terms',
    bisInfo: 'BIS Information',
    standardsTraining: 'Standards & Training',
    impact: 'Standards & Training',
    voiceAssistant: 'Voice Assistant',
    documents: 'Documents Hub',
    testingLabs: 'Testing Laboratories',
    settings: 'Settings',
    adminCommand: 'Admin Command',
    language: 'Language',
    selectLanguage: 'Select Language',
    multilingual: 'Language / Multilingual',
    logout: 'Sign Out',
    signIn: 'Sign In',
    register: 'Register',
    userRole: 'Role',

    // Login Page
    loginTitle: 'Sign In to BIS Portal',
    loginSubtitle: 'Enter your credentials to access national compliance intelligence',
    usernameOrEmail: 'Username or Email',
    usernamePlaceholder: 'Enter your username or email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    loginButton: 'Sign In to Portal',
    signingIn: 'Authenticating...',
    loginSuccess: 'Login successful! Redirecting to Overview...',
    invalidCredentials: 'Invalid username or password. Please try again.',
    usernameRequired: 'Username or email is required.',
    passwordRequired: 'Password is required (minimum 4 characters).',
    demoLoginsTitle: 'Quick Demo Access',
    demoManufacturer: 'MSME Manufacturer',
    demoAdmin: 'BIS Officer / Auditor',
    demoConsumer: 'Consumer / Citizen',
    forgotModalTitle: 'Reset Your Password',
    forgotModalDesc: 'Enter your registered email address to receive secure OTP instructions.',
    sendResetLink: 'Send Reset Instructions',
    cancel: 'Cancel',

    // Search & Actions
    searchPlaceholder: 'Search Indian Standards (e.g., IS 694, IS 302), product categories, or compliance rules...',
    searchButton: 'Search',
    quickSearch: 'Quick Search',
    askAI: 'Ask AI Assistant',
    exploreStandards: 'Explore Standards',
    viewAll: 'View All',
    clear: 'Clear',
    filter: 'Filter',
    status: 'Status',
    action: 'Action',
    details: 'Details',

    // Dashboard Cards & Stats
    statsTotalStandards: 'Indian Standards (IS)',
    statsVerifiedLabs: 'Recognized Testing Labs',
    statsMandatoryQCOs: 'Mandatory QCOs Active',
    statsMSMEConcession: 'MSME Fee Concession',
    quickAccessTitle: 'Core BIS Services & Tools',
    quickAccessSubtitle: 'Direct access to national compliance systems and intelligence engines',
    
    cardAIHelp: 'AI Compliance Chat',
    cardAIDesc: 'Conversational assistant for standards applicability, test schedules, and clause interpretation.',
    
    cardStandardsHelp: 'Product Standards Directory',
    cardStandardsDesc: 'Browse 21,000+ published Indian Standards across all technical departments.',
    
    cardNaturalHelp: 'Natural Language Search',
    cardNaturalDesc: 'Convert everyday commercial product names into official BIS standard codes.',
    
    cardBISInfoHelp: 'BIS Scheme Guidelines',
    cardBISInfoDesc: 'Complete guidance on ISI Mark Scheme I, CRS Scheme II, Hallmarking, and FMCS.',
    
    cardTrainingHelp: 'Standards & Training Hub',
    cardTrainingDesc: 'Educational resources, MSME concessions, and stakeholder capacity building programs.',
    
    cardLabsHelp: 'Laboratory Finder',
    cardLabsDesc: 'Search 280+ NABL accredited and BIS recognized product testing laboratories.',

    cardFeeEstimator: 'Fee & Cost Estimator',
    cardFeeEstimatorDesc: 'Calculate application, inspection, and annual marking fees with MSME rebates.',

    cardMarkInspector: 'Mark & Licence Verifier',
    cardMarkInspectorDesc: 'Verify 7-digit CML numbers, R-numbers, and HUID authenticity.',

    // Voice Assistant
    voiceTitle: 'BIS Multilingual Voice Assistant',
    voiceListening: 'Listening to your voice...',
    voiceClickToSpeak: 'Click the microphone button to start speaking in any Indian language',
    voiceSamplePrompt1: 'What is the standard for domestic electric cables?',
    voiceSamplePrompt2: 'How can an MSME apply for ISI mark certification?',
    voiceSamplePrompt3: 'Where are BIS recognized testing labs in Hyderabad?',
    close: 'Close',

    // Natural Terms
    naturalTermsTitle: 'Natural Product Terms to Indian Standards',
    naturalTermsSubtitle: 'Map informal consumer and trade product terms to mandatory BIS IS specifications',
    naturalSearchPlaceholder: 'Type a common product name (e.g. Helmet, LED Bulb, RO Water Purifier, Steel Rod)...',
    mappedStandard: 'Mapped Indian Standard',
    applicableScheme: 'Certification Scheme',

    // Standards Catalog
    catalogTitle: 'Product Standards Catalog',
    catalogSubtitle: 'Official repository of Indian Standards (IS) published by the Bureau of Indian Standards',
    catalogSearchPlaceholder: 'Filter by standard code (IS 694), title, or product group...',
    standardCode: 'Standard Code',
    standardTitle: 'Standard Title',
    department: 'Technical Department',
    mandatoryQCO: 'Mandatory QCO',
    yes: 'Yes',
    no: 'No',

    // BIS Info Hub
    bisInfoTitle: 'BIS Schemes & Knowledge Hub',
    bisInfoSubtitle: 'Comprehensive breakdown of Indian certification frameworks and quality control orders',
    scheme1Title: 'Scheme I — ISI Mark Certification',
    scheme1Desc: 'Product conformity certification for domestic & international manufacturers.',
    scheme2Title: 'Scheme II — Compulsory Registration (CRS)',
    scheme2Desc: 'Self-declaration of conformity for electronics, IT, and solar goods.',
    schemeHallmarkTitle: 'Hallmarking Scheme',
    schemeHallmarkDesc: 'Mandatory purity certification for Gold and Silver jewelry with HUID.',

    // Footer & Generic
    allRightsReserved: 'All rights reserved. National Standards Intelligence Initiative.',
    poweredBy: 'Grounded in Bureau of Indian Standards Official Guidelines',
    activeUser: 'Logged In As',
    switchRole: 'Switch Persona'
  },

  hi: {
    // Brand & Header
    appName: 'बीआईएस अनुपालन सहायक',
    portalSubtitle: 'राष्ट्रीय मानक आसूचना पोर्टल',
    portalTagline: 'समझें। सत्यापित करें। अनुपालन करें।',
    heroTitle: 'समझें। सत्यापित करें। अनुपालन करें।',
    heroSubtitle: 'भारतीय मानकों (IS), बीआईएस प्रमाणन योजनाओं और वैधानिक अनुपालन के लिए एंटरप्राइज इंटेलिजेंस प्लेटफॉर्म।',
    officialDisclaimer: 'भारतीय मानक ब्यूरो (BIS) के आधिकारिक ज्ञान और राजपत्र QCO आदेशों पर आधारित एआई मार्गदर्शन।',

    // Navigation & Sidebar
    overview: 'अवलोकन',
    dashboard: 'अवलोकन',
    aiAssistant: 'एआई सहायक',
    productStandards: 'उत्पाद मानक',
    standardsCatalog: 'उत्पाद मानक',
    naturalTerms: 'प्राकृतिक शब्दावली',
    bisInfo: 'बीआईएस जानकारी',
    standardsTraining: 'मानक एवं प्रशिक्षण',
    impact: 'मानक एवं प्रशिक्षण',
    voiceAssistant: 'ध्वनि सहायक',
    documents: 'दस्तावेज़ केंद्र',
    testingLabs: 'परीक्षण प्रयोगशालाएं',
    settings: 'सेटिंग्स',
    adminCommand: 'प्रशासन नियंत्रण',
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    multilingual: 'भाषा / बहुभाषी',
    logout: 'साइन आउट',
    signIn: 'साइन इन',
    register: 'पंजीकरण करें',
    userRole: 'भूमिका',

    // Login Page
    loginTitle: 'बीआईएस पोर्टल में साइन इन करें',
    loginSubtitle: 'राष्ट्रीय अनुपालन आसूचना तक पहुंचने के लिए अपने क्रेडेंशियल दर्ज करें',
    usernameOrEmail: 'उपयोगकर्ता नाम या ईमेल',
    usernamePlaceholder: 'अपना उपयोगकर्ता नाम या ईमेल दर्ज करें',
    password: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    rememberMe: 'मुझे याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    loginButton: 'पोर्टल में साइन इन करें',
    signingIn: 'प्रमाणीकरण हो रहा है...',
    loginSuccess: 'लॉगिन सफल! अवलोकन पर पुनर्निर्देशित किया जा रहा है...',
    invalidCredentials: 'अमान्य उपयोगकर्ता नाम या पासवर्ड। कृपया पुनः प्रयास करें।',
    usernameRequired: 'उपयोगकर्ता नाम या ईमेल आवश्यक है।',
    passwordRequired: 'पासवर्ड आवश्यक है (न्यूनतम 4 अक्षर)।',
    demoLoginsTitle: 'त्वरित डेमो पहुंच',
    demoManufacturer: 'एमएसएमई निर्माता',
    demoAdmin: 'बीआईएस अधिकारी / लेखा परीक्षक',
    demoConsumer: 'उपभोक्ता / नागरिक',
    forgotModalTitle: 'अपना पासवर्ड रीसेट करें',
    forgotModalDesc: 'सुरक्षित ओटीपी निर्देश प्राप्त करने के लिए अपना पंजीकृत ईमेल दर्ज करें।',
    sendResetLink: 'रीसेट निर्देश भेजें',
    cancel: 'रद्द करें',

    // Search & Actions
    searchPlaceholder: 'भारतीय मानक (उदा. IS 694, IS 302), उत्पाद श्रेणियां या नियम खोजें...',
    searchButton: 'खोजें',
    quickSearch: 'त्वरित खोज',
    askAI: 'एआई सहायक से पूछें',
    exploreStandards: 'मानक देखें',
    viewAll: 'सभी देखें',
    clear: 'साफ़ करें',
    filter: 'फ़िल्टर',
    status: 'स्थिति',
    action: 'कार्रवाई',
    details: 'विवरण',

    // Dashboard Cards & Stats
    statsTotalStandards: 'भारतीय मानक (IS)',
    statsVerifiedLabs: 'मान्यता प्राप्त प्रयोगशालाएं',
    statsMandatoryQCOs: 'सक्रिय अनिवार्य QCO',
    statsMSMEConcession: 'एमएसएमई शुल्क छूट',
    quickAccessTitle: 'मुख्य बीआईएस सेवाएं एवं उपकरण',
    quickAccessSubtitle: 'राष्ट्रीय अनुपालन प्रणाली और विश्लेषण इंजन तक सीधी पहुंच',

    cardAIHelp: 'एआई अनुपालन चैट',
    cardAIDesc: 'मानकों की प्रयोज्यता, परीक्षण कार्यक्रम और खंड व्याख्या के लिए सहायक।',

    cardStandardsHelp: 'उत्पाद मानक निर्देशिका',
    cardStandardsDesc: 'सभी तकनीकी विभागों में 21,000+ प्रकाशित भारतीय मानक ब्राउज़ करें।',

    cardNaturalHelp: 'प्राकृतिक भाषा खोज',
    cardNaturalDesc: 'दैनिक व्यावसायिक उत्पाद नामों को आधिकारिक बीआईएस मानक कोड में बदलें।',

    cardBISInfoHelp: 'बीआईएस योजना दिशानिर्देश',
    cardBISInfoDesc: 'आईएसआई मार्क स्कीम I, सीआरएस स्कीम II, हॉलमार्किंग और एफएमसीएस पर पूर्ण मार्गदर्शन।',

    cardTrainingHelp: 'मानक एवं प्रशिक्षण हब',
    cardTrainingDesc: 'शैक्षिक संसाधन, एमएसएमई रियायतें और क्षमता निर्माण कार्यक्रम।',

    cardLabsHelp: 'प्रयोगशाला खोजक',
    cardLabsDesc: '280+ एनएबीएल मान्यता प्राप्त और बीआईएस अनुमोदित परीक्षण प्रयोगशालाएं खोजें।',

    cardFeeEstimator: 'शुल्क एवं लागत गणक',
    cardFeeEstimatorDesc: 'एमएसएमई छूट के साथ आवेदन, निरीक्षण और अंकन शुल्क की गणना करें।',

    cardMarkInspector: 'मार्क एवं लाइसेंस सत्यापनकर्ता',
    cardMarkInspectorDesc: '7-अंकीय सीएमएल नंबर, आर-नंबर और एचयूआईडी प्रामाणिकता की जांच करें।',

    // Voice Assistant
    voiceTitle: 'बीआईएस बहुभाषी ध्वनि सहायक',
    voiceListening: 'आपकी आवाज़ सुनी जा रही है...',
    voiceClickToSpeak: 'किसी भी भारतीय भाषा में बोलने के लिए माइक्रोफ़ोन बटन पर क्लिक करें',
    voiceSamplePrompt1: 'घरेलू बिजली के तारों के लिए कौन सा मानक है?',
    voiceSamplePrompt2: 'एमएसएमई आईएसआई मार्क प्रमाणन के लिए कैसे आवेदन कर सकता है?',
    voiceSamplePrompt3: 'हैदराबाद में बीआईएस मान्यता प्राप्त परीक्षण प्रयोगशालाएं कहां हैं?',
    close: 'बंद करें',

    // Natural Terms
    naturalTermsTitle: 'प्राकृतिक उत्पाद शब्दों से भारतीय मानक',
    naturalTermsSubtitle: 'सामान्य उत्पाद नामों को अनिवार्य बीआईएस आईएस विनिर्देशों से मैप करें',
    naturalSearchPlaceholder: 'उत्पाद का नाम लिखें (उदा. हेलमेट, एलईडी बल्ब, आरओ वाटर प्यूरीफायर, स्टील रॉड)...',
    mappedStandard: 'मैप किया गया भारतीय मानक',
    applicableScheme: 'प्रमाणन योजना',

    // Standards Catalog
    catalogTitle: 'उत्पाद मानक सूची',
    catalogSubtitle: 'भारतीय मानक ब्यूरो द्वारा प्रकाशित भारतीय मानकों (IS) का आधिकारिक भंडार',
    catalogSearchPlaceholder: 'मानक कोड (IS 694), शीर्षक या श्रेणी द्वारा फ़िल्टर करें...',
    standardCode: 'मानक कोड',
    standardTitle: 'मानक शीर्षक',
    department: 'तकनीकी विभाग',
    mandatoryQCO: 'अनिवार्य QCO',
    yes: 'हाँ',
    no: 'नहीं',

    // BIS Info Hub
    bisInfoTitle: 'बीआईएस योजनाएं एवं ज्ञान केंद्र',
    bisInfoSubtitle: 'भारतीय प्रमाणन रूपरेखा और गुणवत्ता नियंत्रण आदेशों का संपूर्ण विवरण',
    scheme1Title: 'योजना I — आईएसआई मार्क प्रमाणन',
    scheme1Desc: 'घरेलू और अंतर्राष्ट्रीय निर्माताओं के लिए उत्पाद अनुरूपता प्रमाणन।',
    scheme2Title: 'योजना II — अनिवार्य पंजीकरण योजना (CRS)',
    scheme2Desc: 'इलेक्ट्रॉनिक्स, आईटी और सौर उत्पादों के लिए स्व-घोषणा।',
    schemeHallmarkTitle: 'हॉलमार्किंग योजना',
    schemeHallmarkDesc: 'एचयूआईडी के साथ सोने और चांदी के आभूषणों के लिए अनिवार्य शुद्धता प्रमाणन।',

    // Footer & Generic
    allRightsReserved: 'सर्वाधिकार सुरक्षित। राष्ट्रीय मानक आसूचना पहल।',
    poweredBy: 'भारतीय मानक ब्यूरो के आधिकारिक दिशानिर्देशों पर आधारित',
    activeUser: 'लॉग इन उपयोगकर्ता',
    switchRole: 'भूमिका बदलें'
  },

  te: {
    // Brand & Header
    appName: 'BIS సమ్మతి సహాయకుడు',
    portalSubtitle: 'జాతీయ ప్రమాణాల ఇంటెలిజెన్స్ పోర్టల్',
    portalTagline: 'అర్థం చేసుకోండి. ధృవీకరించండి. పాటించండి.',
    heroTitle: 'అర్థం చేసుకోండి. ధృవీకరించండి. పాటించండి.',
    heroSubtitle: 'భారతీయ ప్రమాణాలు (IS), BIS ధృవీకరణ పథకాలు మరియు చట్టబద్ధమైన సమ్మతి కోసం ఎంటర్‌ప్రైజ్ ఇంటెలిజెన్స్ వేదిక.',
    officialDisclaimer: 'బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ (BIS) అధికారిక మార్గదర్శకాలు మరియు గెజిట్ QCO ఆర్డర్‌లపై ఆధారపడిన AI సహాయం.',

    // Navigation & Sidebar
    overview: 'అవలోకనం',
    dashboard: 'అవలోకనం',
    aiAssistant: 'AI సహాయకుడు',
    productStandards: 'ఉత్పత్తి ప్రమాణాలు',
    standardsCatalog: 'ఉత్పత్తి ప్రమాణాలు',
    naturalTerms: 'సహజ నిబంధనలు',
    bisInfo: 'BIS సమాచారం',
    standardsTraining: 'ప్రమాణాలు & శిక్షణ',
    impact: 'ప్రమాణాలు & శిక్షణ',
    voiceAssistant: 'వాయిస్ అసిస్టెంట్',
    documents: 'పత్రాల కేంద్రం',
    testingLabs: 'పరీక్షా ప్రయోగశాలలు',
    settings: 'సెట్టింగ్‌లు',
    adminCommand: 'అడ్మిన్ కమాండ్',
    language: 'భాష',
    selectLanguage: 'భాషను ఎంచుకోండి',
    multilingual: 'భాష / బహుభాషా ఎంపిక',
    logout: 'సైన్ అవుట్',
    signIn: 'సైన్ ఇన్',
    register: 'రిజిస్టర్',
    userRole: 'పాత్ర',

    // Login Page
    loginTitle: 'BIS పోర్టల్‌లోకి సైన్ ఇన్ చేయండి',
    loginSubtitle: 'జాతీయ సమ్మతి సమాచారాన్ని పొందడానికి మీ వివరాలను నమోదు చేయండి',
    usernameOrEmail: 'యూజర్‌నేమ్ లేదా ఇమెయిల్',
    usernamePlaceholder: 'మీ యూజర్‌నేమ్ లేదా ఇమెయిల్ నమోదు చేయండి',
    password: 'పాస్‌వర్డ్',
    passwordPlaceholder: 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
    rememberMe: 'నన్ను గుర్తుంచుకో',
    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    loginButton: 'పోర్టల్‌లోకి సైన్ ఇన్ అవ్వండి',
    signingIn: 'ధృవీకరిస్తోంది...',
    loginSuccess: 'లాగిన్ విజయవంతమైంది! అవలోకనానికి మారుతోంది...',
    invalidCredentials: 'చెల్లని యూజర్‌నేమ్ లేదా పాస్‌వర్డ్. దయచేసి మళ్లీ ప్రయత్నించండి.',
    usernameRequired: 'యూజర్‌నేమ్ లేదా ఇమెయిల్ అవసరం.',
    passwordRequired: 'పాస్‌వర్డ్ అవసరం (కనీసం 4 అక్షరాలు).',
    demoLoginsTitle: 'త్వరిత డెమో లాగిన్',
    demoManufacturer: 'MSME తయారీదారు',
    demoAdmin: 'BIS అధికారి / ఆడిటర్',
    demoConsumer: 'వినియోగదారుడు / పౌరుడు',
    forgotModalTitle: 'పాస్‌వర్డ్ రీసెట్ చేయండి',
    forgotModalDesc: 'సురక్షిత OTP సూచనలను పొందడానికి మీ నమోదిత ఇమెయిల్‌ను నమోదు చేయండి.',
    sendResetLink: 'రీసెట్ సూచనలను పంపండి',
    cancel: 'రద్దు చేయండి',

    // Search & Actions
    searchPlaceholder: 'భారతీయ ప్రమాణాలు (ఉదా. IS 694), ఉత్పత్తి వర్గాలు లేదా నిబంధనలను శోధించండి...',
    searchButton: 'శోధించండి',
    quickSearch: 'త్వరిత శోధన',
    askAI: 'AI సహాయకుడిని అడగండి',
    exploreStandards: 'ప్రమాణాలను చూడండి',
    viewAll: 'అన్నీ చూడండి',
    clear: 'క్లియర్',
    filter: 'ఫిల్టర్',
    status: 'స్థితి',
    action: 'చర్య',
    details: 'వివరాలు',

    // Dashboard Cards & Stats
    statsTotalStandards: 'భారతీయ ప్రమాణాలు (IS)',
    statsVerifiedLabs: 'గుర్తింపు పొందిన ల్యాబ్‌లు',
    statsMandatoryQCOs: 'క్రియాశీల తప్పనిసరి QCOలు',
    statsMSMEConcession: 'MSME ఫీజు రాయితీ',
    quickAccessTitle: 'ప్రధాన BIS సేవలు & సాధనాలు',
    quickAccessSubtitle: 'జాతీయ సమ్మతి వ్యవస్థలు మరియు విశ్లేషణ సాధనాలకు ప్రత్యక్ష ప్రాప్యత',

    cardAIHelp: 'AI సమ్మతి చాట్',
    cardAIDesc: 'ప్రమాణాల వర్తింపు, పరీక్షా షెడ్యూల్‌లు మరియు క్లాజ్ వివరణ కోసం సంభాషణ సహాయకుడు.',

    cardStandardsHelp: 'ఉత్పత్తి ప్రమాణాల డైరెక్టరీ',
    cardStandardsDesc: 'అన్ని సాంకేతిక విభాగాలలో 21,000+ ప్రచురించిన భారతీయ ప్రమాణాలను బ్రౌజ్ చేయండి.',

    cardNaturalHelp: 'సహజ భాషా శోధన',
    cardNaturalDesc: 'రోజువారీ వాణిజ్య ఉత్పత్తి పేర్లను అధికారిక BIS ప్రమాణ కోడ్‌లుగా మార్చండి.',

    cardBISInfoHelp: 'BIS పథకాల మార్గదర్శకాలు',
    cardBISInfoDesc: 'ISI మార్క్ స్కీమ్ I, CRS స్కీమ్ II, హాల్‌మార్కింగ్ మరియు FMCS పై పూర్తి మార్గదర్శకత్వం.',

    cardTrainingHelp: 'ప్రమాణాలు & శిక్షణా కేంద్రం',
    cardTrainingDesc: 'విద్యా వనరులు, MSME రాయితీలు మరియు సామర్థ్య నిర్మాణ కార్యక్రమాలు.',

    cardLabsHelp: 'ల్యాబొరేటరీ ఫైండర్',
    cardLabsDesc: '280+ NABL గుర్తింపు పొందిన మరియు BIS ఆమోదించిన పరీక్షా ప్రయోగశాలలను శోధించండి.',

    cardFeeEstimator: 'ఫీజు & ఖర్చు కాలిక్యులేటర్',
    cardFeeEstimatorDesc: 'MSME రాయితీలతో దరఖాస్తు, తనిఖీ మరియు మార్కింగ్ ఫీజులను లెక్కించండి.',

    cardMarkInspector: 'మార్క్ & లైసెన్స్ ధృవీకరణ',
    cardMarkInspectorDesc: '7-అంకెల CML సంఖ్య, R-సంఖ్య మరియు HUID ప్రామాణికతను తనిఖీ చేయండి.',

    // Voice Assistant
    voiceTitle: 'BIS బహుభాషా వాయిస్ అసిస్టెంట్',
    voiceListening: 'మీ వాయిస్ వినబడుతోంది...',
    voiceClickToSpeak: 'ఏదైనా భారతీయ భాషలో మాట్లాడటానికి మైక్రోఫోన్ బటన్‌ను క్లిక్ చేయండి',
    voiceSamplePrompt1: 'గృహ విద్యుత్ కేబుళ్ల ప్రమాణం ఏమిటి?',
    voiceSamplePrompt2: 'MSME ISI మార్క్ సర్టిఫికేషన్ కోసం ఎలా దరఖాస్తు చేయాలి?',
    voiceSamplePrompt3: 'హైదరాబాద్‌లో BIS గుర్తింపు పొందిన టెస్టింగ్ ల్యాబ్‌లు ఎక్కడ ఉన్నాయి?',
    close: 'మూసివేయండి',

    // Natural Terms
    naturalTermsTitle: 'సహజ ఉత్పత్తి నిబంధనల నుండి భారతీయ ప్రమాణాలు',
    naturalTermsSubtitle: 'సాధారణ ఉత్పత్తి పేర్లను తప్పనిసరి BIS IS నిబంధనలకు మ్యాప్ చేయండి',
    naturalSearchPlaceholder: 'ఉత్పత్తి పేరు టైప్ చేయండి (ఉదా. హెల్మెట్, LED బల్బ్, RO వాటర్ ప్యూరిఫైయర్, స్టీల్ రాడ్)...',
    mappedStandard: 'మ్యాప్ చేయబడిన భారతీయ ప్రమాణం',
    applicableScheme: 'ధృవీకరణ పథకం',

    // Standards Catalog
    catalogTitle: 'ఉత్పత్తి ప్రమాణాల కేటలాగ్',
    catalogSubtitle: 'బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ ప్రచురించిన అధికారిక ప్రమాణాలు (IS)',
    catalogSearchPlaceholder: 'ప్రమాణ కోడ్ (IS 694), శీర్షిక లేదా వర్గం ద్వారా ఫిల్టర్ చేయండి...',
    standardCode: 'ప్రమాణ కోడ్',
    standardTitle: 'ప్రమాణ శీర్షిక',
    department: 'సాంకేతిక విభాగం',
    mandatoryQCO: 'తప్పనిసరి QCO',
    yes: 'అవును',
    no: 'కాదు',

    // BIS Info Hub
    bisInfoTitle: 'BIS పథకాలు & సమాచార కేంద్రం',
    bisInfoSubtitle: 'భారతీయ సర్టిఫికేషన్ ఫ్రేమ్‌వర్క్ మరియు నాణ్యత నియంత్రణ ఉత్తర్వుల పూర్తి సమాచారం',
    scheme1Title: 'స్కీమ్ I — ISI మార్క్ సర్టిఫికేషన్',
    scheme1Desc: 'దేశీయ మరియు అంతర్జాతీయ తయారీదారుల కోసం ఉత్పత్తి అనుగుణ్యత ధృవీకరణ.',
    scheme2Title: 'స్కీమ్ II — తప్పనిసరి నమోదు పథకం (CRS)',
    scheme2Desc: 'ఎలక్ట్రానిక్స్, IT మరియు సోలార్ వస్తువుల కోసం స్వీయ-ప్రకటన.',
    schemeHallmarkTitle: 'హాల్‌మార్కింగ్ పథకం',
    schemeHallmarkDesc: 'HUIDతో బంగారం మరియు వెండి ఆభరణాల కోసం తప్పనిసరి స్వచ్ఛత ధృవీకరణ.',

    // Footer & Generic
    allRightsReserved: 'సర్వహక్కులు ప్రత్యేకించబడ్డాయి. జాతీయ ప్రమాణాల ఇంటెలిజెన్స్ కార్యక్రమం.',
    poweredBy: 'బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ అధికారిక మార్గదర్శకాల ఆధారంగా రూపొందించబడింది',
    activeUser: 'లాగిన్ అయిన ఖాతా',
    switchRole: 'పాత్రను మార్చండి'
  },

  ta: {
    // Brand & Header
    appName: 'BIS இணக்க உதவியாளர்',
    portalSubtitle: 'தேசிய தரநிலைகள் புலனாய்வு போர்டல்',
    portalTagline: 'புரிந்து கொள்ளுங்கள். சரிபாருங்கள். பின்பற்றுங்கள்.',
    heroTitle: 'புரிந்து கொள்ளுங்கள். சரிபாருங்கள். பின்பற்றுங்கள்.',
    heroSubtitle: 'இந்திய தரநிலைகள் (IS), BIS சான்றிதழ் திட்டங்கள் மற்றும் சட்டப்பூர்வ இணக்கத்திற்கான நிறுவன தளம்.',
    officialDisclaimer: 'இந்திய தரநிலைகள் பணியகம் (BIS) மற்றும் அரசிதழ் QCO ஆணைகளின் அடிப்படையில் அமைந்த AI வழிகாட்டுதல்.',

    // Navigation & Sidebar
    overview: 'கண்ணோட்டம்',
    dashboard: 'கண்ணோட்டம்',
    aiAssistant: 'AI உதவியாளர்',
    productStandards: 'தயாரிப்பு தரநிலைகள்',
    standardsCatalog: 'தயாரிப்பு தரநிலைகள்',
    naturalTerms: 'இயற்கை விதிமுறைகள்',
    bisInfo: 'BIS தகவல்',
    standardsTraining: 'தரநிலைகள் & பயிற்சி',
    impact: 'தரநிலைகள் & பயிற்சி',
    voiceAssistant: 'குரல் உதவியாளர்',
    documents: 'ஆவண மையம்',
    testingLabs: 'சோதனை ஆய்வகங்கள்',
    settings: 'அமைப்புகள்',
    adminCommand: 'நிர்வாகக் கட்டளை',
    language: 'மொழி',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    multilingual: 'மொழி / பன்மொழி தேர்வு',
    logout: 'வெளியேறு',
    signIn: 'உள்நுழைக',
    register: 'பதிவு செய்க',
    userRole: 'பங்கு',

    // Login Page
    loginTitle: 'BIS போர்ட்டலில் உள்நுழைக',
    loginSubtitle: 'தேசிய இணக்க நுண்ணறிவை அணுக உங்கள் சான்றுகளை உள்ளிடவும்',
    usernameOrEmail: 'பயனர்பெயர் அல்லது மின்னஞ்சல்',
    usernamePlaceholder: 'உங்கள் பயனர்பெயர் அல்லது மின்னஞ்சலை உள்ளிடவும்',
    password: 'கடவுச்சொல்',
    passwordPlaceholder: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்',
    rememberMe: 'என்னை நினைவில் கொள்',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    loginButton: 'போர்ட்டலில் உள்நுழைக',
    signingIn: 'சரிபார்க்கிறது...',
    loginSuccess: 'உள்நுழைவு வெற்றிகரமானது! கண்ணோட்டத்திற்கு செல்கிறது...',
    invalidCredentials: 'தவறான பயனர்பெயர் அல்லது கடவுச்சொல். மீண்டும் முயற்சிக்கவும்.',
    usernameRequired: 'பயனர்பெயர் அல்லது மின்னஞ்சல் தேவை.',
    passwordRequired: 'கடவுச்சொல் தேவை (குறைந்தபட்சம் 4 எழுத்துக்கள்).',
    demoLoginsTitle: 'டெமோ விரைவு உள்நுழைவு',
    demoManufacturer: 'MSME உற்பத்தியாளர்',
    demoAdmin: 'BIS அதிகாரி / தணிக்கையாளர்',
    demoConsumer: 'நுகர்வோர் / குடிமகன்',
    forgotModalTitle: 'கடவுச்சொல்லை மீட்டமைக்கவும்',
    forgotModalDesc: 'பாதுகாப்பான OTP வழிமுறைகளைப் பெற உங்கள் மின்னஞ்சலை உள்ளிடவும்.',
    sendResetLink: 'வழிமுறைகளை அனுப்பு',
    cancel: 'ரத்து செய்',

    // Search & Actions
    searchPlaceholder: 'இந்திய தரநிலைகள் (எ.கா. IS 694), தயாரிப்பு வகைகள் அல்லது விதிகளைத் தேடுங்கள்...',
    searchButton: 'தேடு',
    quickSearch: 'விரைவுத் தேடல்',
    askAI: 'AI உதவியாளரிடம் கேளுங்கள்',
    exploreStandards: 'தரநிலைகளை ஆராயுங்கள்',
    viewAll: 'அனைத்தையும் காண்க',
    clear: 'அழி',
    filter: 'வடிகட்டி',
    status: 'நிலை',
    action: 'செயல்',
    details: 'விவரங்கள்',

    // Dashboard Cards & Stats
    statsTotalStandards: 'இந்திய தரநிலைகள் (IS)',
    statsVerifiedLabs: 'அங்கீகரிக்கப்பட்ட ஆய்வகங்கள்',
    statsMandatoryQCOs: 'செயலில் உள்ள கட்டாய QCO',
    statsMSMEConcession: 'MSME கட்டணச் சலுகை',
    quickAccessTitle: 'முக்கிய BIS சேவைகள் மற்றும் கருவிகள்',
    quickAccessSubtitle: 'தேசிய இணக்க அமைப்புகள் மற்றும் நுண்ணறிவுக்கான நேரடி அணுகல்',

    cardAIHelp: 'AI இணக்க அரட்டை',
    cardAIDesc: 'தரநிலைகள் பொருத்தம், சோதனை அட்டவணைகள் மற்றும் விளக்கங்களுக்கான உரையாடல் உதவியாளர்.',

    cardStandardsHelp: 'தயாரிப்பு தரநிலைகள் பட்டியல்',
    cardStandardsDesc: 'அனைத்து தொழில்நுட்ப துறைகளிலும் 21,000+ இந்திய தரநிலைகளை உலாவுக.',

    cardNaturalHelp: 'இயற்கை மொழித் தேடல்',
    cardNaturalDesc: 'அன்றாட வணிக தயாரிப்புப் பெயர்களை அதிகாரப்பூர்வ BIS தரநிலைக் குறியீடுகளாக மாற்றவும்.',

    cardBISInfoHelp: 'BIS திட்ட வழிகாட்டுதல்கள்',
    cardBISInfoDesc: 'ISI மார்க் திட்டம் I, CRS திட்டம் II, ஹால்மார்க்கிங் மற்றும் FMCS பற்றிய முழு வழிகாட்டுதல்.',

    cardTrainingHelp: 'தரநிலைகள் & பயிற்சி மையம்',
    cardTrainingDesc: 'கல்வி வளங்கள், MSME சலுகைகள் மற்றும் திறன் மேம்பாட்டுத் திட்டங்கள்.',

    cardLabsHelp: 'ஆய்வக தேடல்',
    cardLabsDesc: '280+ NABL அங்கீகாரம் மற்றும் BIS அனுமதி பெற்ற சோதனை ஆய்வகங்களைத் தேடுங்கள்.',

    cardFeeEstimator: 'கட்டணம் & செலவு கணக்கீட்டாளர்',
    cardFeeEstimatorDesc: 'MSME தள்ளுபடியுடன் விண்ணப்பம், ஆய்வு மற்றும் ஆண்டுக் கட்டணங்களைக் கணக்கிடுங்கள்.',

    cardMarkInspector: 'முத்திரை & உரிம சரிபார்ப்பு',
    cardMarkInspectorDesc: '7-இலக்க CML எண், R-எண் மற்றும் HUID உண்மைத்தன்மையை சரிபார்க்கவும்.',

    // Voice Assistant
    voiceTitle: 'BIS பன்மொழி குரல் உதவியாளர்',
    voiceListening: 'உங்கள் குரலைக் கேட்கிறது...',
    voiceClickToSpeak: 'எந்தவொரு இந்திய மொழியிலும் பேச மைக்ரோஃபோன் பொத்தானைக் கிளிக் செய்யவும்',
    voiceSamplePrompt1: 'வீட்டு மின்சார கம்பிகளுக்கான தரநிலை என்ன?',
    voiceSamplePrompt2: 'MSME எவ்வாறு ISI முத்திரைச் சான்றிதழுக்கு விண்ணப்பிக்கலாம்?',
    voiceSamplePrompt3: 'ஹைதராபாத்தில் BIS அங்கீகாரம் பெற்ற சோதனை ஆய்வகங்கள் எங்கே உள்ளன?',
    close: 'மூடு',

    // Natural Terms
    naturalTermsTitle: 'இயற்கை தயாரிப்பு விதிமுறைகளிலிருந்து இந்திய தரநிலைகள்',
    naturalTermsSubtitle: 'பொதுவான தயாரிப்பு பெயர்களை கட்டாய BIS IS விவரக்குறிப்புகளுடன் பொருத்தவும்',
    naturalSearchPlaceholder: 'தயாரிப்பு பெயரைத் தட்டச்சு செய்க (எ.கா. ஹெல்மெட், எல்இடி பல்ப், ஆர்ஓ குடிநீர் சுத்திகரிப்பான்)...',
    mappedStandard: 'பொருந்திய இந்திய தரநிலை',
    applicableScheme: 'சான்றிதழ் திட்டம்',

    // Standards Catalog
    catalogTitle: 'தயாரிப்பு தரநிலைகள் பட்டியல்',
    catalogSubtitle: 'இந்திய தரநிலைகள் பணியகம் (BIS) வெளியிட்டுள்ள அதிகாரப்பூர்வ தரநிலைகள்',
    catalogSearchPlaceholder: 'தரநிலைக் குறியீடு (IS 694), தலைப்பு அல்லது வகை மூலம் வடிகட்டவும்...',
    standardCode: 'தரநிலைக் குறியீடு',
    standardTitle: 'தரநிலைத் தலைப்பு',
    department: 'தொழில்நுட்பத் துறை',
    mandatoryQCO: 'கட்டாய QCO',
    yes: 'ஆம்',
    no: 'இல்லை',

    // BIS Info Hub
    bisInfoTitle: 'BIS திட்டங்கள் மற்றும் அறிவு மையம்',
    bisInfoSubtitle: 'இந்திய சான்றிதழ் கட்டமைப்பு மற்றும் தரக் கட்டுப்பாட்டு ஆணைகளின் முழுமையான விவரம்',
    scheme1Title: 'திட்டம் I — ISI முத்திரை சான்றிதழ்',
    scheme1Desc: 'உள்நாட்டு மற்றும் சர்வதேச உற்பத்தியாளர்களுக்கான தயாரிப்பு இணக்க சான்றிதழ்.',
    scheme2Title: 'திட்டம் II — கட்டாயப் பதிவுத் திட்டம் (CRS)',
    scheme2Desc: 'எலக்ட்ரானிக்ஸ், தகவல் தொழில்நுட்பம் மற்றும் சூரிய ஆற்றல் பொருட்களுக்கான சுய அறிவிப்பு.',
    schemeHallmarkTitle: 'ஹால்மார்க்கிங் திட்டம்',
    schemeHallmarkDesc: 'HUID உடன் தங்கம் மற்றும் வெள்ளி நகைகளுக்கான கட்டாய தூய்மை சான்றிதழ்.',

    // Footer & Generic
    allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. தேசிய தரநிலைகள் முன்முயற்சி.',
    poweredBy: 'இந்திய தரநிலைகள் பணியகத்தின் அதிகாரப்பூர்வ வழிகாட்டுதல்களை அடிப்படையாகக் கொண்டது',
    activeUser: 'உள்நுழைந்த பயனர்',
    switchRole: 'பயனர் முறை மாற்றம்'
  },

  kn: {
    // Brand & Header
    appName: 'BIS ಅನುಸರಣೆ ಸಹಾಯಕ',
    portalSubtitle: 'ರಾಷ್ಟ್ರೀಯ ಮಾನದಂಡಗಳ ಇಂಟೆಲಿಜೆನ್ಸ್ ಪೋರ್ಟಲ್',
    portalTagline: 'ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಪರಿಶೀಲಿಸಿ. ಪಾಲಿಸಿ.',
    heroTitle: 'ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಪರಿಶೀಲಿಸಿ. ಪಾಲಿಸಿ.',
    heroSubtitle: 'ಭಾರತೀಯ ಮಾನದಂಡಗಳು (IS), BIS ಪ್ರಮಾಣೀಕರಣ ಯೋಜನೆಗಳು ಮತ್ತು ಶಾಸನಬದ್ಧ ಅನುಸರಣೆಗಾಗಿ ಎಂಟರ್‌ಪ್ರೈಸ್ ವೇದಿಕೆ.',
    officialDisclaimer: 'ಬ್ಯೂರೋ ಆಫ್ ಇಂಡಿಯನ್ ಸ್ಟ್ಯಾಂಡರ್ಡ್ಸ್ (BIS) ಅಧಿಕೃತ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ಗೆಜೆಟ್ QCO ಆದೇಶಗಳ ಆಧಾರಿತ AI ಮಾರ್ಗದರ್ಶನ.',

    // Navigation & Sidebar
    overview: 'ಅವಲೋಕನ',
    dashboard: 'ಅವಲೋಕನ',
    aiAssistant: 'AI ಸಹಾಯಕ',
    productStandards: 'ಉತ್ಪನ್ನ ಮಾನದಂಡಗಳು',
    standardsCatalog: 'ಉತ್ಪನ್ನ ಮಾನದಂಡಗಳು',
    naturalTerms: 'ನೈಸರ್ಗಿಕ ನಿಯಮಗಳು',
    bisInfo: 'BIS ಮಾಹಿತಿ',
    standardsTraining: 'ಮಾನದಂಡಗಳು & ತರಬೇತಿ',
    impact: 'ಮಾನದಂಡಗಳು & ತರಬೇತಿ',
    voiceAssistant: 'ಧ್ವನಿ ಸಹಾಯಕ',
    documents: 'ದಾಖಲೆಗಳ ಕೇಂದ್ರ',
    testingLabs: 'ಪರೀಕ್ಷಾ ಪ್ರಯೋಗಾಲಯಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    adminCommand: 'ನಿರ್ವಾಹಕ ನಿಯಂತ್ರಣ',
    language: 'ಭಾಷೆ',
    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    multilingual: 'ಭಾಷೆ / ಬಹುಭಾಷಾ ಆಯ್ಕೆ',
    logout: 'ಸೈನ್ ಔಟ್',
    signIn: 'ಸೈನ್ ಇನ್',
    register: 'ನೋಂದಾಯಿಸಿ',
    userRole: 'ಪಾತ್ರ',

    // Login Page
    loginTitle: 'BIS ಪೋರ್ಟಲ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
    loginSubtitle: 'ರಾಷ್ಟ್ರೀಯ ಅನುಸರಣೆ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
    usernameOrEmail: 'ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಇಮೇಲ್',
    usernamePlaceholder: 'ನಿಮ್ಮ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಇಮೇಲ್ ನಮೂದಿಸಿ',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    passwordPlaceholder: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
    rememberMe: 'ನನ್ನನ್ನು ನೆನಪಿಡಿ',
    forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?',
    loginButton: 'ಪೋರ್ಟಲ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
    signingIn: 'ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ...',
    loginSuccess: 'ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ! ಅವಲೋಕನಕ್ಕೆ ತೆರಳಲಾಗುತ್ತಿದೆ...',
    invalidCredentials: 'ಅಮಾನ್ಯ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    usernameRequired: 'ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಇಮೇಲ್ ಅಗತ್ಯವಿದೆ.',
    passwordRequired: 'ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿದೆ (ಕನಿಷ್ಠ 4 ಅಕ್ಷರಗಳು).',
    demoLoginsTitle: 'ತ್ವರಿತ ಡೆಮೊ ಲಾಗಿನ್',
    demoManufacturer: 'MSME ತಯಾರಕ',
    demoAdmin: 'BIS ಅಧಿಕಾರಿ / ಲೆಕ್ಕಪರಿಶೋಧಕ',
    demoConsumer: 'ಗ್ರಾಹಕ / ನಾಗರಿಕ',
    forgotModalTitle: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ',
    forgotModalDesc: 'ಸುರಕ್ಷಿತ OTP ಸೂಚನೆಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ.',
    sendResetLink: 'ಸೂಚನೆಗಳನ್ನು ಕಳುಹಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',

    // Search & Actions
    searchPlaceholder: 'ಭಾರತೀಯ ಮಾನದಂಡಗಳು (ಉದಾ. IS 694), ಉತ್ಪನ್ನ ವಿಭಾಗಗಳು ಅಥವಾ ನಿಯಮಗಳನ್ನು ಹುಡುಕಿ...',
    searchButton: 'ಹುಡುಕಿ',
    quickSearch: 'ತ್ವರಿತ ಹುಡುಕಾಟ',
    askAI: 'AI ಸಹಾಯಕರನ್ನು ಕೇಳಿ',
    exploreStandards: 'ಮಾನದಂಡಗಳನ್ನು ನೋಡಿ',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    clear: 'ತೆರವುಗೊಳಿಸಿ',
    filter: 'ಫಿಲ್ಟರ್',
    status: 'ಸ್ಥಿತಿ',
    action: 'ಕ್ರಮ',
    details: 'ವಿವರಗಳು',

    // Dashboard Cards & Stats
    statsTotalStandards: 'ಭಾರತೀಯ ಮಾನದಂಡಗಳು (IS)',
    statsVerifiedLabs: 'ಮಾನ್ಯತೆ ಪಡೆದ ಪ್ರಯೋಗಾಲಯಗಳು',
    statsMandatoryQCOs: 'ಸಕ್ರಿಯ ಕಡ್ಡಾಯ QCOಗಳು',
    statsMSMEConcession: 'MSME ಶುಲ್ಕ ರಿಯಾಯಿತಿ',
    quickAccessTitle: 'ಪ್ರಮುಖ BIS ಸೇವೆಗಳು & ಉಪಕರಣಗಳು',
    quickAccessSubtitle: 'ರಾಷ್ಟ್ರೀಯ ಅನುಸರಣೆ ವ್ಯವಸ್ಥೆಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಣಾ ಎಂಜಿನ್‌ಗಳಿಗೆ ನೇರ ಪ್ರವೇಶ',

    cardAIHelp: 'AI ಅನುಸರಣೆ ಚಾಟ್',
    cardAIDesc: 'ಮಾನದಂಡಗಳ ಅನ್ವಯಿಸುವಿಕೆ, ಪರೀಕ್ಷಾ ವೇಳಾಪಟ್ಟಿಗಳು ಮತ್ತು ಷರತ್ತುಗಳ ವಿವರಣೆಗಾಗಿ ಸಹಾಯಕ.',

    cardStandardsHelp: 'ಉತ್ಪನ್ನ ಮಾನದಂಡಗಳ ಡೈರೆಕ್ಟರಿ',
    cardStandardsDesc: 'ಎಲ್ಲಾ ತಾಂತ್ರಿಕ ವಿಭಾಗಗಳಲ್ಲಿ 21,000+ ಪ್ರಕಟಿತ ಭಾರತೀಯ ಮಾನದಂಡಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ.',

    cardNaturalHelp: 'ನೈಸರ್ಗಿಕ ಭಾಷಾ ಹುಡುಕಾಟ',
    cardNaturalDesc: 'ದೈನಂದಿನ ವಾಣಿಜ್ಯ ಉತ್ಪನ್ನ ಹೆಸರುಗಳನ್ನು ಅಧಿಕೃತ BIS ಮಾನದಂಡ ಕೋಡ್‌ಗಳಾಗಿ ಪರಿವರ್ತಿಸಿ.',

    cardBISInfoHelp: 'BIS ಯೋಜನೆಗಳ ಮಾರ್ಗಸೂಚಿಗಳು',
    cardBISInfoDesc: 'ISI ಮಾರ್ಕ್ ಸ್ಕೀಮ್ I, CRS ಸ್ಕೀಮ್ II, ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಮತ್ತು FMCS ಕುರಿತು ಸಂಪೂರ್ಣ ಮಾಹಿತಿ.',

    cardTrainingHelp: 'ಮಾನದಂಡಗಳು & ತರಬೇತಿ ಕೇಂದ್ರ',
    cardTrainingDesc: 'ಶೈಕ್ಷಣಿಕ ಸಂಪನ್ಮೂಲಗಳು, MSME ರಿಯಾಯಿತಿಗಳು ಮತ್ತು ಸಾಮರ್ಥ್ಯ ವೃದ್ಧಿ ಕಾರ್ಯಕ್ರಮಗಳು.',

    cardLabsHelp: 'ಪ್ರಯೋಗಾಲಯ ಶೋಧಕ',
    cardLabsDesc: '280+ NABL ಮಾನ್ಯತೆ ಮತ್ತು BIS ಅನುಮೋದಿತ ಪರೀಕ್ಷಾ ಪ್ರಯೋಗಾಲಯಗಳನ್ನು ಹುಡುಕಿ.',

    cardFeeEstimator: 'ಶುಲ್ಕ & ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    cardFeeEstimatorDesc: 'MSME ರಿಯಾಯಿತಿಗಳೊಂದಿಗೆ ಅರ್ಜಿ, ತಪಾಸಣೆ ಮತ್ತು ವಾರ್ಷಿಕ ಮಾರ್ಕಿಂಗ್ ಶುಲ್ಕವನ್ನು ಲೆಕ್ಕಹಾಕಿ.',

    cardMarkInspector: 'ಮಾರ್ಕ್ & ಪರವಾನಗಿ ಪರಿಶೀಲಕ',
    cardMarkInspectorDesc: '7-ಅಂಕಿಯ CML ಸಂಖ್ಯೆ, R-ಸಂಖ್ಯೆ ಮತ್ತು HUID ದೃಢೀಕರಣವನ್ನು ಪರಿಶೀಲಿಸಿ.',

    // Voice Assistant
    voiceTitle: 'BIS ಬಹುಭಾಷಾ ಧ್ವನಿ ಸಹಾಯಕ',
    voiceListening: 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
    voiceClickToSpeak: 'ಯಾವುದೇ ಭಾರತೀಯ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಲು ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ',
    voiceSamplePrompt1: 'ಗೃಹ ವಿದ್ಯುತ್ ಕೇಬಲ್‌ಗಳ ಮಾನದಂಡ ಯಾವುದು?',
    voiceSamplePrompt2: 'MSME ISI ಮಾರ್ಕ್ ಪ್ರಮಾಣೀಕರಣಕ್ಕಾಗಿ ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು?',
    voiceSamplePrompt3: 'ಬೆಂಗಳೂರಿನಲ್ಲಿ BIS ಮಾನ್ಯತೆ ಪಡೆದ ಪರೀಕ್ಷಾ ಪ್ರಯೋಗಾಲಯಗಳು ಎಲ್ಲಿವೆ?',
    close: 'ಮುಚ್ಚಿ',

    // Natural Terms
    naturalTermsTitle: 'ನೈಸರ್ಗಿಕ ಉತ್ಪನ್ನ ನಿಯಮಗಳಿಂದ ಭಾರತೀಯ ಮಾನದಂಡಗಳು',
    naturalTermsSubtitle: 'ಸಾಮಾನ್ಯ ಉತ್ಪನ್ನ ಹೆಸರುಗಳನ್ನು ಕಡ್ಡಾಯ BIS IS ನಿಯಮಗಳಿಗೆ ಹೊಂದಿಸಿ',
    naturalSearchPlaceholder: 'ಉತ್ಪನ್ನದ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ (ಉದಾ. ಹೆಲ್ಮೆಟ್, ಎಲ್ಇಡಿ ಬಲ್ಬ್, ವಾಟರ್ ಪ್ಯೂರಿಫೈಯರ್)...',
    mappedStandard: 'ಹೊಂದಿಸಲಾದ ಭಾರತೀಯ ಮಾನದಂಡ',
    applicableScheme: 'ಪ್ರಮಾಣೀಕರಣ ಯೋಜನೆ',

    // Standards Catalog
    catalogTitle: 'ಉತ್ಪನ್ನ ಮಾನದಂಡಗಳ ಕ್ಯಾಟಲಾಗ್',
    catalogSubtitle: 'ಬ್ಯೂರೋ ಆಫ್ ಇಂಡಿಯನ್ ಸ್ಟ್ಯಾಂಡರ್ಡ್ಸ್ ಪ್ರಕಟಿಸಿದ ಅಧಿಕೃತ ಭಾರತೀಯ ಮಾನದಂಡಗಳು (IS)',
    catalogSearchPlaceholder: 'ಮಾನದಂಡ ಕೋಡ್ (IS 694), ಶೀರ್ಷಿಕೆ ಅಥವಾ ವರ್ಗದ ಮೂಲಕ ಫಿಲ್ಟರ್ ಮಾಡಿ...',
    standardCode: 'ಮಾನದಂಡ ಕೋಡ್',
    standardTitle: 'ಮಾನದಂಡದ ಶೀರ್ಷಿಕೆ',
    department: 'ತಾಂತ್ರಿಕ ವಿಭಾಗ',
    mandatoryQCO: 'ಕಡ್ಡಾಯ QCO',
    yes: 'ಹೌದು',
    no: 'ಇಲ್ಲ',

    // BIS Info Hub
    bisInfoTitle: 'BIS ಯೋಜನೆಗಳು & ಮಾಹಿತಿ ಕೇಂದ್ರ',
    bisInfoSubtitle: 'ಭಾರತೀಯ ಪ್ರಮಾಣೀಕರಣ ಚೌಕಟ್ಟು ಮತ್ತು ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶಗಳ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ',
    scheme1Title: 'ಸ್ಕೀಮ್ I — ISI ಮಾರ್ಕ್ ಪ್ರಮಾಣೀಕರಣ',
    scheme1Desc: 'ದೇಶೀಯ ಮತ್ತು ಅಂತರರಾಷ್ಟ್ರೀಯ ತಯಾರಕರಿಗೆ ಉತ್ಪನ್ನ ಅನುಸರಣೆ ಪ್ರಮಾಣೀಕರಣ.',
    scheme2Title: 'ಸ್ಕೀಮ್ II — ಕಡ್ಡಾಯ ನೋಂದಣಿ ಯೋಜನೆ (CRS)',
    scheme2Desc: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್, ಐಟಿ ಮತ್ತು ಸೌರ ಉತ್ಪನ್ನಗಳಿಗೆ ಸ್ವಯಂ ಘೋಷಣೆ.',
    schemeHallmarkTitle: 'ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಯೋಜನೆ',
    schemeHallmarkDesc: 'HUID ನೊಂದಿಗೆ ಚಿನ್ನ ಮತ್ತು ಬೆಳ್ಳಿ ಆಭರಣಗಳಿಗೆ ಕಡ್ಡಾಯ ಶುದ್ಧತೆ ಪ್ರಮಾಣೀಕರಣ.',

    // Footer & Generic
    allRightsReserved: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ರಾಷ್ಟ್ರೀಯ ಮಾನದಂಡಗಳ ಉಪಕ್ರಮ.',
    poweredBy: 'ಬ್ಯೂರೋ ಆಫ್ ಇಂಡಿಯನ್ ಸ್ಟ್ಯಾಂಡರ್ಡ್ಸ್ ಅಧಿಕೃತ ಮಾರ್ಗಸೂಚಿಗಳ ಆಧಾರಿತ',
    activeUser: 'ಲಾಗಿನ್ ಆದ ಬಳಕೆದಾರ',
    switchRole: 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ'
  },

  ml: {
    // Brand & Header
    appName: 'BIS കംപ്ലയൻസ് അസിസ്റ്റന്റ്',
    portalSubtitle: 'ദേശീയ മാനദണ്ഡ ഇന്റലിജൻസ് പോർട്ടൽ',
    portalTagline: 'മനസ്സിലാക്കുക. പരിശോധിക്കുക. പാലിക്കുക.',
    heroTitle: 'മനസ്സിലാക്കുക. പരിശോധിക്കുക. പാലിക്കുക.',
    heroSubtitle: 'ഇന്ത്യൻ മാനദണ്ഡങ്ങൾ (IS), BIS സർട്ടിഫിക്കേഷൻ സ്കീമുകൾ, നിയമപരമായ അനുസരണം എന്നിവയ്ക്കുള്ള ഇന്റലിജൻസ് പ്ലാറ്റ്‌ഫോം.',
    officialDisclaimer: 'ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് (BIS) ഔദ്യോഗിക വിവരങ്ങളുടെ അടിസ്ഥാനത്തിലുള്ള AI മാർഗ്ഗനിർദ്ദേശം.',

    // Navigation & Sidebar
    overview: 'അവലോകനം',
    dashboard: 'അവലോകനം',
    aiAssistant: 'AI അസിസ്റ്റന്റ്',
    productStandards: 'ഉൽപ്പന്ന മാനദണ്ഡങ്ങൾ',
    standardsCatalog: 'ഉൽപ്പന്ന മാനദണ്ഡങ്ങൾ',
    naturalTerms: 'സ്വാഭാവിക പദങ്ങൾ',
    bisInfo: 'BIS വിവരങ്ങൾ',
    standardsTraining: 'മാനദണ്ഡങ്ങളും പരിശീലനവും',
    impact: 'മാനദണ്ഡങ്ങളും പരിശീലനവും',
    voiceAssistant: 'വോയ്‌സ് അസിസ്റ്റന്റ്',
    documents: 'രേഖകളുടെ കേന്ദ്രം',
    testingLabs: 'ടെസ്റ്റിംഗ് ലാബുകൾ',
    settings: 'ക്രമീകരണങ്ങൾ',
    adminCommand: 'അഡ്മിൻ കമാൻഡ്',
    language: 'ഭാഷ',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    multilingual: 'ഭാഷ / ബഹുഭാഷാ തിരഞ്ഞെടുപ്പ്',
    logout: 'സൈൻ ഔട്ട്',
    signIn: 'സൈൻ ഇൻ',
    register: 'രജിസ്റ്റർ ചെയ്യുക',
    userRole: 'റോൾ',

    // Login Page
    loginTitle: 'BIS പോർട്ടലിലേക്ക് സൈൻ ഇൻ ചെയ്യുക',
    loginSubtitle: 'ദേശീയ അനുസരണ വിവരങ്ങൾ ആക്സസ് ചെയ്യാൻ നിങ്ങളുടെ ലോഗിൻ വിവരങ്ങൾ നൽകുക',
    usernameOrEmail: 'യൂസർനെയിം അല്ലെങ്കിൽ ഇമെയിൽ',
    usernamePlaceholder: 'നിങ്ങളുടെ യൂസർനെയിം അല്ലെങ്കിൽ ഇമെയിൽ നൽകുക',
    password: 'പാസ്‌വേഡ്',
    passwordPlaceholder: 'നിങ്ങളുടെ പാസ്‌വേഡ് നൽകുക',
    rememberMe: 'എന്നെ ഓർക്കുക',
    forgotPassword: 'പാസ്‌വേഡ് മറന്നോ?',
    loginButton: 'പോർട്ടലിലേക്ക് സൈൻ ഇൻ ചെയ്യുക',
    signingIn: 'പരിശോധിക്കുന്നു...',
    loginSuccess: 'ലോഗിൻ വിജയകരം! അവലോകനത്തിലേക്ക് പോകുന്നു...',
    invalidCredentials: 'തെറ്റായ യൂസർനെയിം അല്ലെങ്കിൽ പാസ്‌വേഡ്. വീണ്ടും ശ്രമിക്കുക.',
    usernameRequired: 'യൂസർനെയിം അല്ലെങ്കിൽ ഇമെയിൽ ആവശ്യമാണ്.',
    passwordRequired: 'പാസ്‌വേഡ് ആവശ്യമാണ് (കുറഞ്ഞത് 4 അക്ഷരങ്ങൾ).',
    demoLoginsTitle: 'ഡെമോ ലോഗിൻ',
    demoManufacturer: 'MSME നിർമ്മാതാവ്',
    demoAdmin: 'BIS ഉദ്യോഗസ്ഥൻ / ഓഡിറ്റർ',
    demoConsumer: 'ഉപഭോക്താവ് / പൗരൻ',
    forgotModalTitle: 'പാസ്‌വേഡ് റീസെറ്റ് ചെയ്യുക',
    forgotModalDesc: 'OTP നിർദ്ദേശങ്ങൾ ലഭിക്കുന്നതിന് നിങ്ങളുടെ ഇമെയിൽ നൽകുക.',
    sendResetLink: 'നിർദ്ദേശങ്ങൾ അയയ്ക്കുക',
    cancel: 'റദ്ദാക്കുക',

    // Search & Actions
    searchPlaceholder: 'ഇന്ത്യൻ മാനദണ്ഡങ്ങൾ (ഉദാ. IS 694), ഉൽപ്പന്ന വിഭാഗങ്ങൾ അല്ലെങ്കിൽ നിയമങ്ങൾ തിരയുക...',
    searchButton: 'തിരയുക',
    quickSearch: 'ദ്രുത തിരച്ചിൽ',
    askAI: 'AI അസിസ്റ്റന്റിനോട് ചോദിക്കുക',
    exploreStandards: 'മാനദണ്ഡങ്ങൾ കാണുക',
    viewAll: 'എല്ലാം കാണുക',
    clear: 'മായ്ക്കുക',
    filter: 'ഫിൽട്ടർ',
    status: 'നില',
    action: 'പ്രവർത്തനം',
    details: 'വിശദാംശങ്ങൾ',

    // Dashboard Cards & Stats
    statsTotalStandards: 'ഇന്ത്യൻ മാനദണ്ഡങ്ങൾ (IS)',
    statsVerifiedLabs: 'അംഗീകൃത ലാബുകൾ',
    statsMandatoryQCOs: 'നിർബന്ധിത QCO-കൾ',
    statsMSMEConcession: 'MSME ഫീസ് ഇളവ്',
    quickAccessTitle: 'പ്രധാന BIS സേവനങ്ങളും ഉപകരണങ്ങളും',
    quickAccessSubtitle: 'ദേശീയ അനുസരണ സംവിധാനങ്ങളിലേക്കും അനലിറ്റിക്സിലേക്കുമുള്ള നേരിട്ടുള്ള പ്രവേശനം',

    cardAIHelp: 'AI കംപ്ലയൻസ് ചാറ്റ്',
    cardAIDesc: 'മാനദണ്ഡങ്ങളുടെ ബാധകത, ടെസ്റ്റ് ഷെഡ്യൂളുകൾ, വിശദീകരണങ്ങൾ എന്നിവയ്ക്കുള്ള സഹായി.',

    cardStandardsHelp: 'ഉൽപ്പന്ന മാനദണ്ഡ ഡയറക്ടറി',
    cardStandardsDesc: 'എല്ലാ സാങ്കേതിക വിഭാഗങ്ങളിലുമായി 21,000+ ഇന്ത്യൻ മാനദണ്ഡങ്ങൾ ബ്രൗസ് ചെയ്യുക.',

    cardNaturalHelp: 'സ്വാഭാവിക ഭാഷാ തിരച്ചിൽ',
    cardNaturalDesc: 'സാധാരണ വാണിജ്യ ഉൽപ്പന്ന നാമങ്ങളെ ഔദ്യോഗിക BIS മാനദണ്ഡ കോഡുകളാക്കി മാറ്റുക.',

    cardBISInfoHelp: 'BIS സ്കീം മാർഗ്ഗനിർദ്ദേശങ്ങൾ',
    cardBISInfoDesc: 'ISI മാർക്ക് സ്കീം I, CRS സ്കീം II, ഹാൾമാർക്കിംഗ്, FMCS എന്നിവയെക്കുറിച്ചുള്ള പൂർണ്ണ വിവരങ്ങൾ.',

    cardTrainingHelp: 'മാനദണ്ഡങ്ങളും പരിശീലന ഹബ്ബും',
    cardTrainingDesc: 'വിദ്യാഭ്യാസ വിഭവങ്ങൾ, MSME ആനുകൂല്യങ്ങൾ, ശേഷി വർദ്ധിപ്പിക്കൽ പ്രോഗ്രാമുകൾ.',

    cardLabsHelp: 'ലാബ് ഫൈൻഡർ',
    cardLabsDesc: '280+ NABL അംഗീകാരവും BIS അനുമതിയുമുള്ള ടെസ്റ്റിംഗ് ലാബുകൾ കണ്ടെത്തുക.',

    cardFeeEstimator: 'ഫീസ് & ചെലവ് കാൽക്കുലേറ്റർ',
    cardFeeEstimatorDesc: 'MSME ഇളവുകളോടെ അപേക്ഷ, പരിശോധന, വാർഷിക മാർക്കിംഗ് ഫീസ് കണക്കാക്കുക.',

    cardMarkInspector: 'മാർക്ക് & ലൈസൻസ് പരിശോധന',
    cardMarkInspectorDesc: '7-അക്ക CML നമ്പർ, R-നമ്പർ, HUID സാധുത പരിശോധിക്കുക.',

    // Voice Assistant
    voiceTitle: 'BIS ബഹുഭാഷാ വോയ്‌സ് അസിസ്റ്റന്റ്',
    voiceListening: 'നിങ്ങളുടെ ശബ്ദം കേൾക്കുന്നു...',
    voiceClickToSpeak: 'ഏതെങ്കിലും ഇന്ത്യൻ ഭാഷയിൽ സംസാരിക്കാൻ മൈക്രോഫോൺ ബട്ടൺ ക്ലിക്ക് ചെയ്യുക',
    voiceSamplePrompt1: 'വീട്ടുപകരണ കേബിളുകളുടെ മാനദണ്ഡം എന്താണ്?',
    voiceSamplePrompt2: 'MSME-ക്ക് ISI മാർക്കിനായി എങ്ങനെ അപേക്ഷിക്കാം?',
    voiceSamplePrompt3: 'കൊച്ചിയിൽ BIS അംഗീകൃത ടെസ്റ്റിംഗ് ലാബുകൾ എവിടെയാണ്?',
    close: 'അടയ്ക്കുക',

    // Natural Terms
    naturalTermsTitle: 'സ്വാഭാവിക ഉൽപ്പന്ന പദങ്ങളിൽ നിന്ന് ഇന്ത്യൻ മാനദണ്ഡങ്ങൾ',
    naturalTermsSubtitle: 'സാധാരണ ഉൽപ്പന്ന നാമങ്ങളെ നിർബന്ധിത BIS IS നിബന്ധനകളുമായി പൊരുത്തപ്പെടുത്തുക',
    naturalSearchPlaceholder: 'ഉൽപ്പന്നത്തിന്റെ പേര് നൽകുക (ഉദാ. ഹെൽമെറ്റ്, എൽഇഡി ബൾബ്, വാട്ടർ പ്യൂരിഫയർ)...',
    mappedStandard: 'പൊരുത്തപ്പെടുന്ന ഇന്ത്യൻ മാനദണ്ഡം',
    applicableScheme: 'സർട്ടിഫിക്കേഷൻ സ്കീം',

    // Standards Catalog
    catalogTitle: 'ഉൽപ്പന്ന മാനദണ്ഡ കാറ്റലോഗ്',
    catalogSubtitle: 'ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് പ്രസിദ്ധീകരിച്ച ഔദ്യോഗിക മാനദണ്ഡങ്ങൾ',
    catalogSearchPlaceholder: 'കോഡ് (IS 694), തലക്കെട്ട് അല്ലെങ്കിൽ വിഭാഗം പ്രകാരം ഫിൽട്ടർ ചെയ്യുക...',
    standardCode: 'മാനദണ്ഡ കോഡ്',
    standardTitle: 'മാനദണ്ഡ തലക്കെട്ട്',
    department: 'സാങ്കേതിക വിഭാഗം',
    mandatoryQCO: 'നിർബന്ധിത QCO',
    yes: 'ഉണ്ട്',
    no: 'ഇല്ല',

    // BIS Info Hub
    bisInfoTitle: 'BIS സ്കീമുകളും വിവര കേന്ദ്രവും',
    bisInfoSubtitle: 'ഇന്ത്യൻ സർട്ടിഫിക്കേഷൻ ചട്ടക്കൂടിന്റെയും ഗുണനിലവാര നിയന്ത്രണ ഉത്തരവുകളുടെയും പൂർണ്ണ വിവരണം',
    scheme1Title: 'സ്കീം I — ISI മാർക്ക് സർട്ടിഫിക്കേഷൻ',
    scheme1Desc: 'ആഭ്യന്തര, അന്തർദേശീയ നിർമ്മാതാക്കൾക്കുള്ള ഉൽപ്പന്ന അനുരൂപീകരണ സർട്ടിഫിക്കേഷൻ.',
    scheme2Title: 'സ്കീം II — നിർബന്ധിത രജിസ്ട്രേഷൻ സ്കീം (CRS)',
    scheme2Desc: 'ഇലക്ട്രോണിക്സ്, ഐടി, സോളാർ ഉൽപ്പന്നങ്ങൾക്കായുള്ള സ്വയം പ്രഖ്യാപനം.',
    schemeHallmarkTitle: 'ഹാൾമാർക്കിംഗ് സ്കീം',
    schemeHallmarkDesc: 'HUID ഉള്ള സ്വർണ്ണ, വെള്ളി ആഭരണങ്ങൾക്കുള്ള നിർബന്ധിത ശുദ്ധതാ സർട്ടിഫിക്കേഷൻ.',

    // Footer & Generic
    allRightsReserved: 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം. ദേശീയ മാനദണ്ഡ ഇന്റലിജൻസ് സംരംഭം.',
    poweredBy: 'ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് ഔദ്യോഗിക മാർഗ്ഗനിർദ്ദേശങ്ങളുടെ അടിസ്ഥാനത്തിൽ പ്രവർത്തിക്കുന്നു',
    activeUser: 'ലോഗിൻ ചെയ്ത ഉപയോക്താവ്',
    switchRole: 'റോൾ മാറ്റുക'
  },

  mr: {
    // Brand & Header
    appName: 'BIS अनुपालन सहाय्यक',
    portalSubtitle: 'राष्ट्रीय मानके इंटेलिजेंस पोर्टल',
    portalTagline: 'समजून घ्या. पडताळा. पालन करा.',
    heroTitle: 'समजून घ्या. पडताळा. पालन करा.',
    heroSubtitle: 'भारतीय मानके (IS), BIS प्रमाणन योजना आणि वैधानिक अनुपालनासाठी एंटरप्राइझ प्लॅटफॉर्म.',
    officialDisclaimer: 'भारतीय मानक ब्युरो (BIS) च्या अधिकृत मार्गदर्शक तत्त्वांवर आधारित AI सहाय्य.',

    // Navigation & Sidebar
    overview: 'आढावा',
    dashboard: 'आढावा',
    aiAssistant: 'एआय सहाय्यक',
    productStandards: 'उत्पादन मानके',
    standardsCatalog: 'उत्पादन मानके',
    naturalTerms: 'नैसर्गिक संज्ञा',
    bisInfo: 'BIS माहिती',
    standardsTraining: 'मानके आणि प्रशिक्षण',
    impact: 'मानके आणि प्रशिक्षण',
    voiceAssistant: 'व्हॉइस असिस्टंट',
    documents: 'दस्तऐवज केंद्र',
    testingLabs: 'चाचणी प्रयोगशाळा',
    settings: 'सेटिंग्ज',
    adminCommand: 'प्रशासन आज्ञा',
    language: 'भाषा',
    selectLanguage: 'भाषा निवडा',
    multilingual: 'भाषा / बहुभाषिक पर्याय',
    logout: 'साइन आउट',
    signIn: 'साइन इन',
    register: 'नोंदणी करा',
    userRole: 'भूमिका',

    // Login Page
    loginTitle: 'BIS पोर्टलवर साइन इन करा',
    loginSubtitle: 'राष्ट्रीय अनुपालन माहिती मिळवण्यासाठी तुमची माहिती प्रविष्ट करा',
    usernameOrEmail: 'वापरकर्तानाव किंवा ईमेल',
    usernamePlaceholder: 'तुमचे वापरकर्तानाव किंवा ईमेल प्रविष्ट करा',
    password: 'पासवर्ड',
    passwordPlaceholder: 'तुमचा पासवर्ड प्रविष्ट करा',
    rememberMe: 'माझी आठवण ठेवा',
    forgotPassword: 'पासवर्ड विसरलात?',
    loginButton: 'पोर्टलवर साइन इन करा',
    signingIn: 'प्रमाणीकरण होत आहे...',
    loginSuccess: 'लॉगिन यशस्वी! आढावा पृष्ठावर पुनर्निर्देशित करत आहे...',
    invalidCredentials: 'अवैध वापरकर्तानाव किंवा पासवर्ड. कृपया पुन्हा प्रयत्न करा.',
    usernameRequired: 'वापरकर्तानाव किंवा ईमेल आवश्यक आहे.',
    passwordRequired: 'पासवर्ड आवश्यक आहे (किमान ४ अक्षरे).',
    demoLoginsTitle: 'द्रुत डेमो लॉगिन',
    demoManufacturer: 'MSME उत्पादक',
    demoAdmin: 'BIS अधिकारी / लेखापरीक्षक',
    demoConsumer: 'ग्राहक / नागरिक',
    forgotModalTitle: 'पासवर्ड रीसेट करा',
    forgotModalDesc: 'सुरक्षित OTP सूचना प्राप्त करण्यासाठी तुमचा नोंदणीकृत ईमेल प्रविष्ट करा.',
    sendResetLink: 'सूचना पाठवा',
    cancel: 'रद्द करा',

    // Search & Actions
    searchPlaceholder: 'भारतीय मानके (उदा. IS 694), उत्पादन श्रेणी किंवा नियम शोधा...',
    searchButton: 'शोधा',
    quickSearch: 'द्रुत शोध',
    askAI: 'AI सहाय्यकाला विचारा',
    exploreStandards: 'मानके पहा',
    viewAll: 'सर्व पहा',
    clear: 'साफ करा',
    filter: 'फिल्टर',
    status: 'स्थिती',
    action: 'कृती',
    details: 'तपशील',

    // Dashboard Cards & Stats
    statsTotalStandards: 'भारतीय मानके (IS)',
    statsVerifiedLabs: 'मान्यताप्राप्त प्रयोगशाळा',
    statsMandatoryQCOs: 'सक्रिय अनिवार्य QCO',
    statsMSMEConcession: 'MSME शुल्क सवलत',
    quickAccessTitle: 'मुख्य BIS सेवा आणि साधने',
    quickAccessSubtitle: 'राष्ट्रीय अनुपालन प्रणाली आणि विश्लेषण साधनांचा थेट वापर',

    cardAIHelp: 'AI अनुपालन चॅट',
    cardAIDesc: 'मानके लागू होणे, चाचणी वेळापत्रक आणि कलमांच्या स्पष्टीकरणासाठी सहाय्यक.',

    cardStandardsHelp: 'उत्पादन मानके निर्देशिका',
    cardStandardsDesc: 'सर्व तांत्रिक विभागांमध्ये २१,०००+ प्रकाशित भारतीय मानके ब्राउझ करा.',

    cardNaturalHelp: 'नैसर्गिक भाषा शोध',
    cardNaturalDesc: 'दैनंदिन व्यावसायिक उत्पादन नावे अधिकृत BIS मानक कोडमध्ये रूपांतरित करा.',

    cardBISInfoHelp: 'BIS योजना मार्गदर्शक तत्त्वे',
    cardBISInfoDesc: 'ISI मार्क योजना I, CRS योजना II, हॉलमार्किंग आणि FMCS वर संपूर्ण माहिती.',

    cardTrainingHelp: 'मानके आणि प्रशिक्षण केंद्र',
    cardTrainingDesc: 'शैक्षणिक संसाधने, MSME सवलती आणि क्षमता निर्माण कार्यक्रम.',

    cardLabsHelp: 'प्रयोगशाळा शोधक',
    cardLabsDesc: '२८०+ NABL मान्यताप्राप्त आणि BIS मंजूर चाचणी प्रयोगशाळा शोधा.',

    cardFeeEstimator: 'शुल्क आणि खर्च गणक',
    cardFeeEstimatorDesc: 'MSME सवलतींसह अर्ज, तपासणी आणि मार्किंग शुल्काची गणना करा.',

    cardMarkInspector: 'मार्क आणि परवाना पडताळणी',
    cardMarkInspectorDesc: '७-अंकी CML क्रमांक, R-क्रमांक आणि HUID वैधतेची खात्री करा.',

    // Voice Assistant
    voiceTitle: 'BIS बहुभाषिक व्हॉइस असिस्टंट',
    voiceListening: 'तुमचा आवाज ऐकत आहे...',
    voiceClickToSpeak: 'कोणत्याही भारतीय भाषेत बोलण्यासाठी मायक्रोफोन बटणावर क्लिक करा',
    voiceSamplePrompt1: 'घरगुती विद्युत तारांसाठी कोणते मानक आहे?',
    voiceSamplePrompt2: 'MSME ने ISI मार्क प्रमाणपत्रासाठी अर्ज कसा करावा?',
    voiceSamplePrompt3: 'पुण्यात BIS मान्यताप्राप्त चाचणी प्रयोगशाळा कुठे आहेत?',
    close: 'बंद करा',

    // Natural Terms
    naturalTermsTitle: 'नैसर्गिक उत्पादन संज्ञांमधून भारतीय मानके',
    naturalTermsSubtitle: 'सामान्य उत्पादनांची नावे अनिवार्य BIS IS वैशिष्ट्यांशी जोडा',
    naturalSearchPlaceholder: 'उत्पादनाचे नाव टाइप करा (उदा. हेल्मेट, एलईडी बल्ब, वॉटर प्युरिफायर)...',
    mappedStandard: 'मॅप केलेले भारतीय मानक',
    applicableScheme: 'प्रमाणन योजना',

    // Standards Catalog
    catalogTitle: 'उत्पादन मानके सूची',
    catalogSubtitle: 'भारतीय मानक ब्युरोद्वारे प्रकाशित अधिकृत भारतीय मानके (IS)',
    catalogSearchPlaceholder: 'मानक कोड (IS 694), शीर्षक किंवा श्रेणीनुसार फिल्टर करा...',
    standardCode: 'मानक कोड',
    standardTitle: 'मानक शीर्षक',
    department: 'तांत्रिक विभाग',
    mandatoryQCO: 'अनिवार्य QCO',
    yes: 'होय',
    no: 'नाही',

    // BIS Info Hub
    bisInfoTitle: 'BIS योजना आणि ज्ञान केंद्र',
    bisInfoSubtitle: 'भारतीय प्रमाणन चौकट आणि गुणवत्ता नियंत्रण आदेशांची संपूर्ण माहिती',
    scheme1Title: 'योजना I — ISI मार्क प्रमाणन',
    scheme1Desc: 'देशांतर्गत आणि आंतरराष्ट्रीय उत्पादकांसाठी उत्पादन अनुरूपता प्रमाणन.',
    scheme2Title: 'योजना II — अनिवार्य नोंदणी योजना (CRS)',
    scheme2Desc: 'इलेक्ट्रॉनिक्स, आयटी आणि सौर उत्पादनांसाठी स्वयं-घोषणा.',
    schemeHallmarkTitle: 'हॉलमार्किंग योजना',
    schemeHallmarkDesc: 'HUID सह सोने आणि चांदीच्या दागिन्यांसाठी अनिवार्य शुद्धता प्रमाणन.',

    // Footer & Generic
    allRightsReserved: 'सर्व हक्क राखीव. राष्ट्रीय मानके उपक्रम.',
    poweredBy: 'भारतीय मानक ब्युरोच्या अधिकृत मार्गदर्शक तत्त्वांवर आधारित',
    activeUser: 'लॉग इन वापरकर्ता',
    switchRole: 'भूमिका बदला'
  },

  bn: {
    // Brand & Header
    appName: 'BIS সম্মতি সহকারী',
    portalSubtitle: 'জাতীয় মানক গোয়েন্দা পোর্টাল',
    portalTagline: 'বুঝুন। যাচাই করুন। মেনে চলুন।',
    heroTitle: 'বুঝুন। যাচাই করুন। মেনে চলুন।',
    heroSubtitle: 'ভারতীয় মানক (IS), BIS সার্টিফিকেশন স্কিম এবং আইনি সম্মতির জন্য এন্টারপ্রাইজ ইন্টেলিজেন্স প্ল্যাটফর্ম।',
    officialDisclaimer: 'ব্যুরো অফ ইন্ডিয়ান স্ট্যান্ডার্ডস (BIS) এবং গেজেট QCO নির্দেশের ওপর ভিত্তি করে AI সহায়তা।',

    // Navigation & Sidebar
    overview: 'সারসংক্ষেপ',
    dashboard: 'সারসংক্ষেপ',
    aiAssistant: 'এআই সহকারী',
    productStandards: 'পণ্য মানক',
    standardsCatalog: 'পণ্য মানক',
    naturalTerms: 'সহজ পরিভাষা',
    bisInfo: 'BIS তথ্য',
    standardsTraining: 'মানক ও প্রশিক্ষণ',
    impact: 'মানক ও প্রশিক্ষণ',
    voiceAssistant: 'ভয়েস সহকারী',
    documents: 'নথি কেন্দ্র',
    testingLabs: 'পরীক্ষাগার সমূহ',
    settings: 'সেটিংস',
    adminCommand: 'অ্যাডমিন কমান্ড',
    language: 'ভাষা',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    multilingual: 'ভাষা / বহুভাষিক বিকল্প',
    logout: 'সাইন আউট',
    signIn: 'সাইন ইন',
    register: 'নিবন্ধন করুন',
    userRole: 'ভূমিকা',

    // Login Page
    loginTitle: 'BIS পোর্টালে সাইন ইন করুন',
    loginSubtitle: 'জাতীয় সম্মতি সংক্রান্ত তথ্য পেতে আপনার বিবরণ লিখুন',
    usernameOrEmail: 'ব্যবহারকারীর নাম বা ইমেল',
    usernamePlaceholder: 'ব্যবহারকারীর নাম বা ইমেল লিখুন',
    password: 'পাসওয়ার্ড',
    passwordPlaceholder: 'পাসওয়ার্ড লিখুন',
    rememberMe: 'আমাকে মনে রাখুন',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    loginButton: 'পোর্টালে সাইন ইন করুন',
    signingIn: 'যাচাই করা হচ্ছে...',
    loginSuccess: 'লগইন সফল! সারসংক্ষেপে স্থানান্তরিত হচ্ছে...',
    invalidCredentials: 'ভুল ব্যবহারকারীর নাম বা পাসওয়ার্ড। আবার চেষ্টা করুন।',
    usernameRequired: 'ব্যবহারকারীর নাম বা ইমেল আবশ্যক।',
    passwordRequired: 'পাসওয়ার্ড আবশ্যক (কমপক্ষে ৪টি অক্ষর)।',
    demoLoginsTitle: 'দ্রুত ডেমো লগইন',
    demoManufacturer: 'MSME প্রস্তুতকারক',
    demoAdmin: 'BIS আধিকারিক / নিরীক্ষক',
    demoConsumer: 'ভোক্তা / নাগরিক',
    forgotModalTitle: 'পাসওয়ার্ড রিসেট করুন',
    forgotModalDesc: 'নিরাপদ OTP নির্দেশাবলী পেতে আপনার নিবন্ধিত ইমেল লিখুন।',
    sendResetLink: 'নির্দেশাবলী পাঠান',
    cancel: 'বাতিল করুন',

    // Search & Actions
    searchPlaceholder: 'ভারতীয় মানক (যেমন IS 694), পণ্যের বিভাগ বা নিয়ম অনুসন্ধান করুন...',
    searchButton: 'অনুসন্ধান',
    quickSearch: 'দ্রুত অনুসন্ধান',
    askAI: 'এআই সহকারীকে জিজ্ঞাসা করুন',
    exploreStandards: 'মানক দেখুন',
    viewAll: 'সব দেখুন',
    clear: 'মুছুন',
    filter: 'ফিল্টার',
    status: 'অবস্থা',
    action: 'পদক্ষেপ',
    details: 'বিবরণ',

    // Dashboard Cards & Stats
    statsTotalStandards: 'ভারতীয় মানক (IS)',
    statsVerifiedLabs: 'স্বীকৃত পরীক্ষাগার',
    statsMandatoryQCOs: 'সক্রিয় বাধ্যতামূলক QCO',
    statsMSMEConcession: 'MSME ফি ছাড়',
    quickAccessTitle: 'প্রধান BIS পরিষেবা এবং সরঞ্জাম',
    quickAccessSubtitle: 'জাতীয় সম্মতি ব্যবস্থা এবং বিশ্লেষণ ইঞ্জিনের সরাসরি অ্যাক্সেস',

    cardAIHelp: 'AI সম্মতি চ্যাট',
    cardAIDesc: 'মানকের প্রযোজ্যতা, পরীক্ষার সময়সূচী এবং ধারা ব্যাখ্যার জন্য সহকারী।',

    cardStandardsHelp: 'পণ্য মানক ডিরেক্টরি',
    cardStandardsDesc: 'সমস্ত প্রযুক্তিগত বিভাগে ২১,০০০+ প্রকাশিত ভারতীয় মানক ব্রাউজ করুন।',

    cardNaturalHelp: 'সহজ ভাষার অনুসন্ধান',
    cardNaturalDesc: 'দৈনন্দিন বাণিজ্যিক পণ্যের নামকে অফিসিয়াল BIS মানক কোডে রূপান্তর করুন।',

    cardBISInfoHelp: 'BIS স্কিম নির্দেশিকা',
    cardBISInfoDesc: 'ISI মার্ক স্কিম I, CRS স্কিম II, হলমার্কিং এবং FMCS সম্পর্কে সম্পূর্ণ নির্দেশিকা।',

    cardTrainingHelp: 'মানক ও প্রশিক্ষণ হাব',
    cardTrainingDesc: 'শিক্ষামূলক সংস্থান, MSME ছাড় এবং সক্ষমতা বৃদ্ধি কর্মসূচি।',

    cardLabsHelp: 'পরীক্ষাগার সন্ধানকারী',
    cardLabsDesc: '২৮০+ NABL স্বীকৃত এবং BIS অনুমোদিত পরীক্ষার ল্যাব অনুসন্ধান করুন।',

    cardFeeEstimator: 'ফি এবং ব্যয় ক্যালকুলেটর',
    cardFeeEstimatorDesc: 'MSME ছাড় সহ আবেদন, পরিদর্শন এবং বার্ষিক ফি গণনা করুন।',

    cardMarkInspector: 'মার্ক এবং লাইসেন্স যাচাইকারী',
    cardMarkInspectorDesc: '৭-সংখ্যার CML নম্বর, R-নম্বর এবং HUID সত্যতা যাচাই করুন।',

    // Voice Assistant
    voiceTitle: 'BIS বহুভাষিক ভয়েস সহকারী',
    voiceListening: 'আপনার ভয়েস শোনা হচ্ছে...',
    voiceClickToSpeak: 'যেকোনো ভারতীয় ভাষায় কথা বলতে মাইক্রোফোন বোতামে ক্লিক করুন',
    voiceSamplePrompt1: 'গার্হস্থ্য বৈদ্যুতিক তারের মানক কী?',
    voiceSamplePrompt2: 'MSME কীভাবে ISI মার্ক সার্টিফিকেশনের জন্য আবেদন করতে পারে?',
    voiceSamplePrompt3: 'কলকাতায় BIS স্বীকৃত পরীক্ষার ল্যাব কোথায় অবস্থিত?',
    close: 'বন্ধ করুন',

    // Natural Terms
    naturalTermsTitle: 'সহজ পণ্যের শব্দ থেকে ভারতীয় মানক',
    naturalTermsSubtitle: 'সাধারণ পণ্যের নাম বাধ্যতামূলক BIS IS বৈশিষ্ট্যের সাথে মেলাতে সাহায্য করে',
    naturalSearchPlaceholder: 'পণ্যের নাম লিখুন (যেমন হেলমেট, এলইডি বাল্ব, ওয়াটার পিউরিফায়ার)...',
    mappedStandard: 'ম্যাপ করা ভারতীয় মানক',
    applicableScheme: 'সার্টিফিকেশন স্কিম',

    // Standards Catalog
    catalogTitle: 'পণ্য মানক ক্যাটালগ',
    catalogSubtitle: 'ব্যুরো অফ ইন্ডিয়ান স্ট্যান্ডার্ডস প্রকাশিত অফিসিয়াল মানক (IS)',
    catalogSearchPlaceholder: 'কোড (IS 694), শিরোনাম বা বিভাগ অনুসারে ফিল্টার করুন...',
    standardCode: 'মানক কোড',
    standardTitle: 'মানক শিরোনাম',
    department: 'প্রযুক্তিগত বিভাগ',
    mandatoryQCO: 'বাধ্যতামূলক QCO',
    yes: 'হ্যাঁ',
    no: 'না',

    // BIS Info Hub
    bisInfoTitle: 'BIS স্কিম এবং তথ্য কেন্দ্র',
    bisInfoSubtitle: 'ভারতীয় সার্টিফিকেশন ফ্রেমওয়ার্ক এবং মান নিয়ন্ত্রণ আদেশের সম্পূর্ণ তথ্য',
    scheme1Title: 'স্কিম I — ISI মার্ক সার্টিফিকেশন',
    scheme1Desc: 'দেশীয় এবং আন্তর্জাতিক প্রস্তুতকারকদের জন্য পণ্যের সম্মতি সার্টিফিকেশন।',
    scheme2Title: 'স্কিম II — বাধ্যতামূলক নিবন্ধন স্কিম (CRS)',
    scheme2Desc: 'ইলেকট্রনিক্স, আইটি এবং সৌর পণ্যের জন্য স্ব-ঘোষণা।',
    schemeHallmarkTitle: 'হলমার্কিং স্কিম',
    schemeHallmarkDesc: 'HUID সহ সোনা ও রূপার গহনার জন্য বাধ্যতামূলক বিশুদ্ধতা সার্টিফিকেশন।',

    // Footer & Generic
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত। জাতীয় মানক উদ্যোগ।',
    poweredBy: 'ব্যুরো অফ ইন্ডিয়ান স্ট্যান্ডার্ডসের অফিসিয়াল নির্দেশিকা অনুসারে পরিচালিত',
    activeUser: 'লগ ইন করা ব্যবহারকারী',
    switchRole: 'ভূমিকা পরিবর্তন'
  }
};

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
  languages: LanguageOption[];
  currentLanguage: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('solvex_lang') as AppLanguage) || 'en';
    if (['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('solvex_lang', lang);
  };

  const t = (key: string): string => {
    return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.en[key] || key;
  };

  const currentLanguage = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

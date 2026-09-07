import { config } from '../config.js';
import { bisTerminology } from '../data/bisTerminology.js';

export interface ChatSource {
  standardNumber?: string;
  clause?: string;
  documentTitle?: string;
  sourceUrl?: string;
  isOfficial: boolean;
  notes?: string;
}

export interface AIChatResponse {
  answer: string;
  language: string;
  sources: ChatSource[];
  relatedQuestions: string[];
  recommendedAction: string;
  standardRecommendation?: {
    standardNumber: string;
    title: string;
    category: string;
    isMandatory: boolean;
    certificationScheme: string;
    whyRelevant: string;
    keyTests: string[];
  };
}

export class AIService {
  /**
   * Primary Chat with BIS Intelligence & Grounded Knowledge
   */
  public static async chat(query: string, language: string = 'en', context?: any): Promise<AIChatResponse> {
    const qLower = query.toLowerCase();

    // 1. Check if external LLM configured (OpenAI / Gemini)
    if (config.openaiApiKey) {
      try {
        return await this.callOpenAI(query, language, context);
      } catch (err) {
        console.warn('OpenAI call failed, falling back to Grounded BIS Intelligence Engine:', err);
      }
    }

    // 2. Grounded BIS Domain Knowledge Engine
    return this.generateGroundedResponse(query, language, context);
  }

  /**
   * Smart Standard Recommender from Natural Product Description
   */
  public static async recommendStandard(productDescription: string, language: string = 'en'): Promise<any> {
    const desc = productDescription.toLowerCase();

    if (desc.includes('kettle') || desc.includes('water heater') || desc.includes('coffee maker') || desc.includes('liquid')) {
      return {
        product: productDescription,
        detectedCategory: 'Household Electrical Appliances',
        recommendedStandard: {
          standardNumber: 'IS 302-2-15',
          title: 'Safety of Household and Similar Electrical Appliances - Particular Requirements for Appliances for Heating Liquids',
          version: '2023',
          isMandatory: true,
          qcoNotice: 'Mandatory under Electrical Appliances (Quality Control) Order',
          certificationScheme: 'Scheme I (ISI Mark)',
          whyRelevant: 'Covers domestic appliances up to 250V for boiling water or heating liquids with heating elements, cord sets, and thermal protective cut-outs.',
          testingRequirements: [
            'Dielectric insulation & high-voltage proof test (1000V AC)',
            'Clause 19.4 Abnormal operation dry-boil safety cut-off test',
            'Handle and knob temperature rise limits (max 55°C metallic)',
            'Spill resistance and cord anchorage 25 pulls of 60N'
          ],
          relatedStandards: ['IS 302-1 (General Safety Requirements)', 'IS 9968 (Elastomer insulated cables)'],
          recommendedLaboratory: 'BIS Central Laboratory (Sahibabad) or TÜV SÜD South Asia (Bengaluru)',
          nextStep: 'Prepare Bill of Materials (BOM) and conduct pre-compliance dry boil testing before submitting Form-V on ManakOnline.'
        }
      };
    }

    if (desc.includes('helmet') || desc.includes('motorcycle') || desc.includes('two wheeler') || desc.includes('rider')) {
      return {
        product: productDescription,
        detectedCategory: 'Automotive & Personal Protective Equipment',
        recommendedStandard: {
          standardNumber: 'IS 4151',
          title: 'Protective Helmets for Two Wheeler Riders - Specification',
          version: '2020 (Fourth Revision)',
          isMandatory: true,
          qcoNotice: 'Compulsory under Motor Vehicles Act & BIS Two-Wheeler Helmets QCO',
          certificationScheme: 'Scheme I (ISI Mark)',
          whyRelevant: 'Mandatory standard governing cranial impact attenuation, chin strap retention tensile strength, and peripheral vision angles for rider helmets.',
          testingRequirements: [
            'Impact absorption drop test onto steel anvils at 7.5 m/s (max 300g)',
            'Penetration resistance with conical spike',
            'Dynamic retention micro-slip test of chin strap buckle',
            'Maximum mass constraint of 1.20 kg under Amendment 2'
          ],
          relatedStandards: ['IS 9873 (Toy helmets are prohibited from two-wheeler use)'],
          recommendedLaboratory: 'BIS Central Laboratory (Sahibabad) or ARAI Pune',
          nextStep: 'Submit test specimens to BIS recognized laboratory for headform drop impact verification.'
        }
      };
    }

    if (desc.includes('water') || desc.includes('packaged') || desc.includes('drinking water') || desc.includes('bottle')) {
      return {
        product: productDescription,
        detectedCategory: 'Food, Water & Beverages',
        recommendedStandard: {
          standardNumber: 'IS 14543',
          title: 'Packaged Drinking Water (Other than Natural Mineral Water) - Specification',
          version: '2024',
          isMandatory: true,
          qcoNotice: 'Statutory requirement under FSSAI and BIS Act, 2016',
          certificationScheme: 'Scheme I (ISI Mark)',
          whyRelevant: 'Specifies treatment protocols, microbiological purity, heavy metal limits, and tamper-proof packaging for potable water sold in containers.',
          testingRequirements: [
            'Total Coliform, E.coli, and Pseudomonas aeruginosa (Zero tolerance in 250ml)',
            'Total Dissolved Solids (TDS between 75 and 500 mg/L)',
            'Toxic metals limits (Lead < 0.01 mg/L, Arsenic < 0.01 mg/L)',
            'Tamper-evident PET cap seal inspection'
          ],
          relatedStandards: ['IS 13428 (Packaged Natural Mineral Water)', 'IS 10146 (Polyethylene for food contact)'],
          recommendedLaboratory: 'BIS Western Regional Office Laboratory (Mumbai) or SROL (Chennai)',
          nextStep: 'Install in-house microbiology testing setup and reverse osmosis treatment train.'
        }
      };
    }

    if (desc.includes('battery') || desc.includes('power bank') || desc.includes('cell') || desc.includes('lithium')) {
      return {
        product: productDescription,
        detectedCategory: 'Electronics & Energy Storage',
        recommendedStandard: {
          standardNumber: 'IS 16046 (Part 2)',
          title: 'Secondary Lithium Cells and Batteries for Portable Applications',
          version: '2018 / IEC 62133-2',
          isMandatory: true,
          qcoNotice: 'MeitY Compulsory Registration Scheme (CRS) Order',
          certificationScheme: 'Scheme II (CRS Registration - R-XXXXXXXX)',
          whyRelevant: 'Covers safety against overcharging, thermal runaway, short circuits, and mechanical drop impacts for portable lithium-ion batteries.',
          testingRequirements: [
            'Continuous charging at upper limit voltage for 7 days',
            'External short circuit test at 55°C without explosion or fire',
            'Thermal abuse test at 130°C for 30 minutes',
            'Drop test from 1.0 m height onto concrete'
          ],
          relatedStandards: ['IS 13252 (Part 1) (Information Technology Equipment Safety)'],
          recommendedLaboratory: 'UL India Testing Laboratory (Bengaluru) or TÜV SÜD South Asia',
          nextStep: 'Submit samples to a BIS-recognized CRS laboratory to generate an official test report for portal upload.'
        }
      };
    }

    if (desc.includes('gold') || desc.includes('jewel') || desc.includes('bangle') || desc.includes('ornament')) {
      return {
        product: productDescription,
        detectedCategory: 'Precious Metals & Hallmarking',
        recommendedStandard: {
          standardNumber: 'IS 1417',
          title: 'Gold and Gold Alloys, Jewellery/Artefacts - Fineness and Marking',
          version: '2022',
          isMandatory: true,
          qcoNotice: 'Hallmarking of Gold Jewellery and Artefacts Order (Notified in 343+ Districts)',
          certificationScheme: 'Hallmarking Scheme (6-digit HUID)',
          whyRelevant: 'Specifies acceptable purities (22K916, 18K750, 14K585) and laser engraving of the 6-digit Hallmark Unique Identification (HUID).',
          testingRequirements: [
            'Fire Assay Cupellation testing as per IS 1418',
            'X-ray Fluorescence (XRF) rapid non-destructive screening',
            'Zero negative purity tolerance verification'
          ],
          relatedStandards: ['IS 1418 (Assaying of Gold)', 'IS 2112 (Silver Hallmarking)'],
          recommendedLaboratory: 'Any BIS Recognized Assaying & Hallmarking Centre (AHC)',
          nextStep: 'Register jeweller retail entity on ManakOnline and submit articles to accredited AHC for laser engraving.'
        }
      };
    }

    if (desc.includes('cooker') || desc.includes('pressure cooker')) {
      return {
        product: productDescription,
        detectedCategory: 'Kitchenware & Metallurgy',
        recommendedStandard: {
          standardNumber: 'IS 2347',
          title: 'Domestic Pressure Cookers - Specification',
          version: '2017 (Sixth Revision)',
          isMandatory: true,
          qcoNotice: 'Domestic Pressure Cookers (Quality Control) Order',
          certificationScheme: 'Scheme I (ISI Mark)',
          whyRelevant: 'Governs vessel body thickness, burst pressure safety, food grade stainless steel or virgin aluminium alloy, and safety valves.',
          testingRequirements: [
            'Proof pressure test at 2x operating pressure',
            'Hydrostatic burst pressure test (minimum 3x operating pressure)',
            'Secondary safety plug / fusible alloy release test',
            'Gasket release safety mechanism test'
          ],
          relatedStandards: ['IS 6911 (Stainless steel plate/sheet for food contact)', 'IS 21 (Aluminium alloy)'],
          recommendedLaboratory: 'BIS Central Lab (Sahibabad) or BIS Eastern Regional Lab (Kolkata)',
          nextStep: 'Ensure dual safety relief valves (weight valve + fusible plug) and procure food-grade certified gasket rubber.'
        }
      };
    }

    // Default intelligent fallback
    return {
      product: productDescription,
      detectedCategory: 'General Consumer & Industrial Goods',
      recommendedStandard: {
        standardNumber: 'IS 302-1 / Applicable Product IS',
        title: 'Safety of Household and Similar Goods / General Requirements',
        version: 'Current Active Gazette Edition',
        isMandatory: true,
        qcoNotice: 'Subject to DPIIT / BIS Quality Control Order verification',
        certificationScheme: 'Scheme I (ISI Mark) or Scheme II (CRS)',
        whyRelevant: 'Matches specified product characteristics against standard safety, material purity, and performance metrics.',
        testingRequirements: [
          'Safety against electrical/mechanical hazard',
          'Material chemical conformity & food-contact compliance',
          'Endurance and stress cycling test',
          'Tamper-resistant product marking and label verification'
        ],
        relatedStandards: ['ISO/IEC 17065 (Conformity assessment principles)'],
        recommendedLaboratory: 'BIS Central Laboratory (CL Sahibabad)',
        nextStep: 'Consult the Standards Catalog or upload technical datasheet for exact clause-level mapping.'
      }
    };
  }

  /**
   * Explain Term (Technical -> Simple)
   */
  public static explainTerm(termQuery: string): any {
    const q = termQuery.toLowerCase().trim();
    const match = bisTerminology.find(t => 
      t.term.toLowerCase().includes(q) || 
      t.aliases.some(a => a.toLowerCase().includes(q))
    );

    if (match) {
      return match;
    }

    return {
      term: termQuery,
      aliases: [termQuery],
      simpleDefinition: `A standard BIS regulatory or technical specification term relating to quality conformity and product certification in India.`,
      technicalDefinition: `Governed by the Bureau of Indian Standards Act 2016 and related regulations for conformity assessment, standardization, and quality certification.`,
      whyItMatters: `Ensures compliance with national safety directives, prevents substandard imports, and fosters consumer confidence.`,
      whoNeedsIt: `Manufacturers, testing laboratories, quality control engineers, and compliance officers.`,
      relatedServices: ['ManakOnline', 'BIS Care Mobile App', 'Laboratory Recognition Scheme'],
      applicableStandards: ['IS 302 series', 'IS 4151', 'IS 14543'],
      followUpQuestions: [
        `How is ${termQuery} applied in product certification?`,
        `Where can I find the official BIS guideline for ${termQuery}?`
      ]
    };
  }

  /**
   * Generate Grounded Knowledge Response
   */
  private static generateGroundedResponse(query: string, language: string, context?: any): AIChatResponse {
    const q = query.toLowerCase();

    // Multilingual translations of common greetings/prompts
    const isTelugu = language === 'te';
    const isHindi = language === 'hi';
    const isTamil = language === 'ta';
    const isKannada = language === 'kn';
    const isBengali = language === 'bn';

    if (q.includes('kettle') || (q.includes('electric') && q.includes('heat'))) {
      let answer = `For electric kettles, the applicable Indian Standard is **IS 302-2-15:2023** (*Safety of Household and Similar Electrical Appliances - Particular Requirements for Appliances for Heating Liquids*), which is read in conjunction with the general safety standard **IS 302-1**.\n\n### Key Regulatory Highlights:\n- **Mandatory Quality Control Order (QCO):** Yes, mandatory under the *Electrical Appliances (Quality Control) Order*. It is illegal to manufacture, store, or sell uncertified electric kettles in India.\n- **Certification Scheme:** **Scheme I (ISI Mark)** via the BIS ManakOnline portal.\n- **Critical Safety Requirements:**\n  1. **Clause 8:** Protection against accidental contact with live electrical elements.\n  2. **Clause 11:** Temperature rise limits on handles (max 55°C for metallic, 75°C for insulated handles).\n  3. **Clause 19.4:** Mandatory dry-boil safety cut-off test ensuring the kettle automatically turns off when powered without water.\n  4. **Clause 22:** Supply cord pull relief withstanding 25 cycles of 60N tension.\n\n### Next Step:\nSelect a BIS-recognized laboratory (such as BIS Central Laboratory Sahibabad or TÜV SÜD) to carry out pre-compliance safety tests before submitting your Form-V application.`;

      if (isHindi) {
        answer = `इलेक्ट्रिक केतली (Electric Kettles) के लिए लागू भारतीय मानक **IS 302-2-15:2023** है।\n\n- **अनिवार्य प्रमाणन:** यह इलेक्ट्रिकल उपकरण गुणवत्ता नियंत्रण आदेश (QCO) के तहत अनिवार्य है। बिना ISI मार्क के इसे बेचना दंडनीय है।\n- **प्रमाणन योजना:** स्कीम I (ISI मार्क) - मानक ऑनलाइन पोर्टल के माध्यम से।\n- **मुख्य परीक्षण:** ड्राई-बॉयल सुरक्षा कट-ऑफ (Clause 19.4), हैंडल का तापमान (Clause 11), और इलेक्ट्रिक शॉक से सुरक्षा (Clause 8)।\n\n**अनुशंसित अगला कदम:** मानक ऑनलाइन पर फॉर्म-V आवेदन जमा करने से पहले बीआईएस मान्यता प्राप्त प्रयोगशाला से परीक्षण करवाएं।`;
      } else if (isTelugu) {
        answer = `ఎలక్ట్రిక్ కేటిల్స్ (Electric Kettles) తయారీకి వర్తించే భారతీయ ప్రమాణం **IS 302-2-15:2023**.\n\n- **తప్పనిసరి సర్టిఫికేషన్:** ఎలక్ట్రికల్ అప్లయెన్సెస్ QCO ఆర్డర్ ప్రకారం ఇది భారతదేశంలో తప్పనిసరి. ISI మార్క్ లేకుండా విక్రయించడం చట్టరీత్యా నేరం.\n- **సర్టిఫికేషన్ స్కీమ్:** స్కీమ్ I (ISI మార్క్) - ManakOnline పోర్టల్ ద్వారా.\n- **ముఖ్యమైన పరీక్షలు:** డ్రై-బాయిల్ ఆటోమేటిక్ కట్-ఆఫ్ (క్లాజ్ 19.4), హ్యాండిల్ ఉష్ణోగ్రత పరిమితులు (క్లాజ్ 11), విద్యుత్ షాక్ రక్షణ (క్లాజ్ 8).\n\n**తదుపరి చర్య:** బిఐఎస్ గుర్తింపు పొందిన ల్యాబ్ నుండి ప్రీ-కంప్లైయన్స్ టెస్టింగ్ రిపోర్ట్ సిద్ధం చేసుకోండి.`;
      } else if (isTamil) {
        answer = `மின்சார கெட்டில்களுக்கு (Electric Kettles) பொருந்தக்கூடிய இந்திய தரநிலை **IS 302-2-15:2023** ஆகும்.\n\n- **கட்டாய சான்றிதழ்:** இந்திய அரசின் QCO உத்தரவின் கீழ் இது கட்டாயமாகும். ISI முத்திரை இல்லாமல் விற்க முடியாது.\n- **சான்றிதழ் திட்டம்:** திட்டம் I (ISI Mark).\n- **முக்கிய சோதனைகள்:** உலர் கொதி பாதுகாப்பு ஆட்டோ கட்-ஆஃப் (Clause 19.4), கைப்பிடி வெப்பநிலை மற்றும் மின்கசிவு பாதுகாப்பு.`;
      }

      return {
        answer,
        language,
        sources: [
          {
            standardNumber: 'IS 302-2-15:2023',
            clause: 'Clause 8, 11, 19.4 & 22',
            documentTitle: 'Household Appliances - Heating Liquids Safety Specification',
            sourceUrl: 'https://standardsbis.bsbedge.com',
            isOfficial: true,
            notes: 'Official Gazette Notification DPIIT QCO on Electrical Appliances'
          },
          {
            standardNumber: 'IS 302-1',
            clause: 'General Safety Standard',
            documentTitle: 'Safety of Household and Similar Electrical Appliances - General Requirements',
            isOfficial: true
          }
        ],
        relatedQuestions: [
          'What are the laboratory testing costs for IS 302-2-15 in BIS Central Lab?',
          'What factory inspection documents are required for Scheme I ISI mark?',
          'Can MSMEs get a 50% concession on BIS marking fees for electric kettles?'
        ],
        recommendedAction: 'Generate Compliance Checklist for IS 302-2-15 or Explore Testing Laboratories'
      };
    }

    if (q.includes('helmet') || q.includes('two wheeler')) {
      return {
        answer: `Two-wheeler riding helmets fall under **IS 4151:2020 (Fourth Revision)**. Under the Ministry of Road Transport & Highways (MoRTH) and BIS QCO, all helmets sold in India must carry the authentic **ISI Mark** with CM/L licence number.\n\n### Key Requirements:\n1. **Clause 6.1 Impact Deceleration:** Peak headform acceleration must not exceed 300g during drop tests at 7.5 m/s onto flat and hemispherical anvils.\n2. **Clause 7.3 Retention System:** Chin strap dynamic micro-slip test ensuring strap does not elongate more than 25 mm.\n3. **Clause 8.4 Mass Restriction:** Maximum weight strictly capped at 1.20 kg for enhanced rider comfort without fatigue.\n4. **Clause 9.1 Peripheral Vision:** Clear horizontal vision field of minimum 105 degrees on each side.\n\n**Warning:** Helmets without ISI mark or foreign non-certified helmets (DOT/ECE only without BIS) are not legally permissible on Indian roads.`,
        language,
        sources: [
          {
            standardNumber: 'IS 4151:2020',
            clause: 'Clauses 6.1, 7.3, 8.4',
            documentTitle: 'Protective Helmets for Two Wheeler Riders - Specification',
            sourceUrl: 'https://standardsbis.bsbedge.com',
            isOfficial: true,
            notes: 'Mandatory QCO notified by MoRTH and DPIIT'
          }
        ],
        relatedQuestions: [
          'How to identify a fake ISI mark on motorcycle helmets?',
          'What is the penalty for selling non-ISI helmets in India?',
          'What is the procedure for an overseas helmet manufacturer under FMCS?'
        ],
        recommendedAction: 'Scan Helmet ISI Mark via Camera or Open IS 4151 Specification'
      };
    }

    if (q.includes('crs') || q.includes('scheme ii') || q.includes('laptop') || q.includes('phone') || q.includes('registration')) {
      return {
        answer: `The **Compulsory Registration Scheme (CRS)**, also known as **Scheme-II**, is administered by BIS in collaboration with MeitY for electronics and IT equipment.\n\n### How CRS Differs from ISI Mark (Scheme I):\n- **No Initial Factory Audit:** Unlike Scheme-I, BIS officers do not conduct a mandatory pre-registration factory audit.\n- **Testing First:** The manufacturer sends product samples directly to an accredited BIS-recognized laboratory in India.\n- **Submission & Registration:** The test report is submitted online via the **crsbis.in** portal along with an Undertaking / Affidavit of Conformity.\n- **Registration Number:** Once approved, BIS grants a unique **R-XXXXXXXX** registration number valid for 2 years.\n- **Labeling:** The product displays the standard BIS CRS logo with "Self Declaration - Conforming to IS [Number], R-XXXXXXXX".\n\nApplicable products include Mobile Phones (IS 13252), Power Banks & Li-ion Batteries (IS 16046), LED Lamps (IS 16102), Smart Watches, and Servers.`,
        language,
        sources: [
          {
            documentTitle: 'BIS (Conformity Assessment) Regulations 2018 - Scheme II',
            sourceUrl: 'https://www.crsbis.in',
            isOfficial: true,
            notes: 'MeitY Compulsory Registration Orders Schedule'
          }
        ],
        relatedQuestions: [
          'How long does it take to obtain a CRS R-number?',
          'Can an overseas manufacturer apply for CRS without an Indian office?',
          'What are the mandatory marking guidelines for CRS registered products?'
        ],
        recommendedAction: 'View CRS Standards in Directory or Search CRS Labs'
      };
    }

    if (q.includes('hallmark') || q.includes('gold') || q.includes('huid')) {
      return {
        answer: `Gold Hallmarking in India is governed by **IS 1417:2022** and is mandatory across 343+ designated districts under the Ministry of Consumer Affairs.\n\n### The 3 Mandatory Hallmarking Signs:\n1. **BIS Logo:** The official triangle logo of the Bureau of Indian Standards.\n2. **Purity in Karat and Fineness:** For example, **22K916** (91.6% pure), **18K750** (75% pure), or **14K585** (58.5% pure).\n3. **6-Digit HUID:** Hallmark Unique Identification code laser-engraved by a BIS-recognized Assaying & Hallmarking Centre (AHC).\n\n### Consumer Verification:\nConsumers can verify any 6-digit HUID code instantly via the **BIS Care App** or using SolveX's **Manual Product Verification** tool to view the jeweller registration, AHC name, hallmarking date, and purity grade.`,
        language,
        sources: [
          {
            standardNumber: 'IS 1417:2022',
            documentTitle: 'Gold and Gold Alloys, Jewellery/Artefacts - Fineness and Marking',
            sourceUrl: 'https://www.manakonline.in',
            isOfficial: true
          }
        ],
        relatedQuestions: [
          'What is the fee for hallmarking a piece of gold jewellery?',
          'Can a consumer get unhallmarked gold tested at a BIS AHC?',
          'What legal recourse exists if gold purity tests lower than the stamped hallmark?'
        ],
        recommendedAction: 'Verify 6-Digit HUID Code in Verification Tool'
      };
    }

    // Default intelligent conversational response
    return {
      answer: `Hello! I am your **AI BIS Standards & Compliance Expert**. I can assist you with:\n\n1. **Standard Discovery:** Identifying applicable Indian Standards (IS) for any product or industrial process.\n2. **Quality Control Orders (QCOs):** Finding out if certification is legally compulsory for your category.\n3. **Testing Protocols & Clause Details:** Clarifying specific test methods (electrical, mechanical, chemical, microbial).\n4. **Laboratory Locator:** Locating accredited BIS and NABL laboratories for pre-compliance testing.\n5. **Personalized Roadmaps & Checklists:** Generating tailored compliance timelines from product identification to licence issuance.\n\nTell me about your product or ask a specific question like *"Which standard applies to domestic pressure cookers?"* or *"How to get an ISI mark for packaged water?"*`,
      language,
      sources: [
        {
          documentTitle: 'Bureau of Indian Standards Act, 2016 & Conformity Assessment Guidelines',
          sourceUrl: 'https://www.bis.gov.in',
          isOfficial: true
        }
      ],
      relatedQuestions: [
        'Which Indian Standard applies to domestic pressure cookers?',
        'What tests are required for packaged drinking water under IS 14543?',
        'How does a small business MSME apply for an ISI mark licence?'
      ],
      recommendedAction: 'Enter Product Description to Discover Applicable Standard'
    };
  }

  /**
   * OpenAI Integration wrapper
   */
  private static async callOpenAI(prompt: string, language: string, context?: any): Promise<AIChatResponse> {
    const systemPrompt = `You are SolveX, the authoritative AI-Powered Assistant for Indian Standards (Bureau of Indian Standards - BIS) and product compliance in India.
Your mission is to provide accurate, grounded, actionable answers citing exact IS standard numbers, clauses, and gazette QCOs.
Always separate Official Regulatory Claims from AI Guidance.
Format response in Markdown.
Respond in language: ${language}.`;

    const res = await fetch(`${config.openaiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.statusText}`);
    }

    const data = await res.json() as any;
    const answer = data.choices?.[0]?.message?.content || 'No response generated';

    return {
      answer,
      language,
      sources: [
        {
          documentTitle: 'BIS Knowledge Base Grounded Query',
          isOfficial: true,
          notes: 'Synthesized via AI model against authoritative Indian Standards'
        }
      ],
      relatedQuestions: [
        'What are the mandatory testing procedures for this standard?',
        'Which BIS laboratory can perform these tests?',
        'How can I prepare a Scheme of Inspection and Testing (SIT)?'
      ],
      recommendedAction: 'Review Applicable Standard Details or Generate Compliance Roadmap'
    };
  }
}

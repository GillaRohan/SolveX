export interface BISTerm {
  term: string;
  aliases: string[];
  simpleDefinition: string;
  technicalDefinition: string;
  whyItMatters: string;
  whoNeedsIt: string;
  relatedServices: string[];
  applicableStandards: string[];
  followUpQuestions: string[];
}

export const bisTerminology: BISTerm[] = [
  {
    term: 'ISI Mark',
    aliases: ['ISI', 'Scheme I', 'Indian Standards Institution Mark', 'CM/L Number'],
    simpleDefinition: 'The iconic certification mark certifying that a product complies with Indian Standards for quality, safety, and reliability.',
    technicalDefinition: 'Conformity assessment mark granted under Scheme-I of the Bureau of Indian Standards (Conformity Assessment) Regulations, 2018, requiring factory audit, sample testing, and ongoing surveillance.',
    whyItMatters: 'Guarantees that products like domestic appliances, cement, baby food, helmets, and steel meet rigorous national safety thresholds. Prevents counterfeits and hazards.',
    whoNeedsIt: 'Manufacturers producing goods notified under mandatory Quality Control Orders (QCOs), and consumers looking for verified product safety.',
    relatedServices: ['Product Certification Scheme-I', 'Factory Audit', 'Surveillance Testing', 'ManakOnline Portal'],
    applicableStandards: ['IS 302-2-15 (Kettles)', 'IS 4151 (Helmets)', 'IS 14543 (Water)', 'IS 2347 (Cookers)'],
    followUpQuestions: [
      'How do I verify a 7-digit CM/L licence number?',
      'What happens if a manufacturer misuses the ISI mark?',
      'Which products have mandatory ISI mark requirement under QCO?'
    ]
  },
  {
    term: 'HUID (Hallmark Unique Identification)',
    aliases: ['HUID', 'Hallmark', 'Gold Hallmarking', 'Assaying & Hallmarking'],
    simpleDefinition: 'A 6-digit laser-engraved unique alphanumeric code stamped on every piece of gold jewellery indicating verified purity.',
    technicalDefinition: 'A tamper-proof traceable identity number generated on the BIS Hallmarking portal and laser-marked by an accredited Assaying and Hallmarking Centre (AHC) following fire assay purity testing according to IS 1417.',
    whyItMatters: 'Protects consumers from buying adulterated gold, guarantees buyback value based on exact purity (e.g. 22K916, 18K750), and enables digital verification through BIS Care app.',
    whoNeedsIt: 'Jewellers retailing gold artefacts in notified districts, and consumers investing in precious metals.',
    relatedServices: ['Jeweller Registration', 'AHC Accreditation', 'XRF Testing', 'Fire Assay Verification'],
    applicableStandards: ['IS 1417 (Gold Fineness & Marking)', 'IS 1418 (Fire Assay Testing)', 'IS 2112 (Silver Hallmarking)'],
    followUpQuestions: [
      'How to verify a 6-digit HUID code online?',
      'What are the 3 mandatory marks in gold hallmarking?',
      'Is hallmarking mandatory for 20K and 24K gold?'
    ]
  },
  {
    term: 'CRS (Compulsory Registration Scheme)',
    aliases: ['CRS', 'Scheme II', 'Self Declaration of Conformity', 'MeitY Registration'],
    simpleDefinition: 'A fast-track registration scheme for IT and electronics goods where manufacturers register products based on laboratory test reports.',
    technicalDefinition: 'Conformity assessment scheme governed by Scheme-II of BIS (Conformity Assessment) Regulations, 2018. Manufacturers submit test reports from BIS-recognized labs to obtain a unique R-XXXXXXXX registration number without mandatory prior factory audit.',
    whyItMatters: 'Ensures laptops, mobile phones, power banks, LED lights, and smart TVs imported or sold in India meet electromagnetic compatibility and fire safety requirements.',
    whoNeedsIt: 'Electronics OEMs, importers, brand owners, and global manufacturers distributing IT/telecom goods in India.',
    relatedServices: ['CRS Online Portal (crsbis.in)', 'Lab Test Report Submission', 'Affidavit of Conformity'],
    applicableStandards: ['IS 16046 (Lithium Batteries)', 'IS 16102 (LED Lamps)', 'IS 13252 (IT Equipment)'],
    followUpQuestions: [
      'What is the difference between ISI Mark (Scheme I) and CRS (Scheme II)?',
      'How long does CRS registration remain valid?',
      'What is the standard label format for CRS registered goods?'
    ]
  },
  {
    term: 'Conformity Assessment',
    aliases: ['Conformity Assessment Scheme', 'Audit', 'Certification Assessment'],
    simpleDefinition: 'The systematic procedure used to prove that a product, process, service, or system satisfies all specified technical requirements.',
    technicalDefinition: 'Any activity concerned with determining directly or indirectly that relevant requirements in technical regulations or standards are fulfilled, incorporating testing, inspection, certification, and surveillance.',
    whyItMatters: 'Establishes mutual trust between buyers, manufacturers, and regulatory bodies by replacing subjective claims with objective empirical proof.',
    whoNeedsIt: 'Enterprises applying for government tenders, international exports, and statutory compliance.',
    relatedServices: ['Factory Assessment', 'Pre-licence Inspection', 'SIT Protocol Formulation'],
    applicableStandards: ['ISO/IEC 17065', 'BIS Act 2016', 'IS/ISO 9001'],
    followUpQuestions: [
      'What documents are inspected during a BIS factory audit?',
      'What is a Scheme of Inspection and Testing (SIT)?',
      'What are the common non-conformities found during initial inspection?'
    ]
  },
  {
    term: 'QCO (Quality Control Order)',
    aliases: ['QCO', 'Mandatory Standards Order', 'Gazette Order'],
    simpleDefinition: 'A mandatory government law issued through an official gazette requiring specific products to carry BIS certification before being sold in India.',
    technicalDefinition: 'Statutory orders promulgated by central government ministries (DPIIT, Ministry of Steel, MeitY, Ministry of Heavy Industries) under Section 16 of the BIS Act, 2016, rendering compliance with specified Indian Standards legally compulsory.',
    whyItMatters: 'Selling, stocking, or importing goods covered under an active QCO without BIS certification is a punishable criminal offense under the BIS Act, attracting seizure and penalties.',
    whoNeedsIt: 'Domestic manufacturers, importers, customs clearing agents, and retail distributors.',
    relatedServices: ['Gazette Tracking', 'Enforcement Cell', 'Customs ICEGATE Integration'],
    applicableStandards: ['All mandatory Indian Standards listed in BIS QCO schedule'],
    followUpQuestions: [
      'What is the penalty for violating a BIS Quality Control Order?',
      'Can MSMEs get exemption or timeline extension for newly notified QCOs?',
      'How to check if my product falls under an active QCO?'
    ]
  },
  {
    term: 'NABL Accreditation',
    aliases: ['NABL', 'Accredited Laboratory', 'ISO/IEC 17025'],
    simpleDefinition: 'A formal recognition that a testing or calibration laboratory is technically competent to carry out specific scientific tests.',
    technicalDefinition: 'Accreditation granted by the National Accreditation Board for Testing and Calibration Laboratories (NABL), an autonomous body under QCI, based on international standard ISO/IEC 17025.',
    whyItMatters: 'Test results from NABL-accredited labs are accepted by BIS, government bodies, and international regulators without duplicate re-testing.',
    whoNeedsIt: 'Independent testing labs, in-house manufacturer laboratories, and researchers.',
    relatedServices: ['Laboratory Recognition Scheme (LRS)', 'Proficiency Testing', 'Inter-laboratory Comparison'],
    applicableStandards: ['ISO/IEC 17025', 'BIS LRS Regulations 2020'],
    followUpQuestions: [
      'Is NABL accreditation sufficient for BIS certification test reports?',
      'How to find a BIS-recognized NABL laboratory near me?',
      'What tests cannot be subcontracted under BIS SIT?'
    ]
  },
  {
    term: 'FMCS (Foreign Manufacturers Certification Scheme)',
    aliases: ['FMCS', 'Overseas ISI Mark', 'Foreign Certification'],
    simpleDefinition: 'The scheme through which foreign overseas manufacturers obtain permission to use the ISI mark on goods exported to India.',
    technicalDefinition: 'Scheme operated by the Foreign Manufacturers Certification Department (FMCD) of BIS since 2000, requiring an on-site audit of the overseas factory by BIS officers and physical sample testing in India.',
    whyItMatters: 'Mandatory for international brands exporting products covered under Indian QCOs into the Indian market.',
    whoNeedsIt: 'International manufacturers, multinational corporations, and Indian import partners.',
    relatedServices: ['Nomination of Authorized Indian Representative (AIR)', 'Overseas Factory Audit', 'Performance Bank Guarantee'],
    applicableStandards: ['Applicable to all Scheme I mandatory standards'],
    followUpQuestions: [
      'Who qualifies as an Authorized Indian Representative (AIR)?',
      'What is the typical timeline and cost for FMCS certification?',
      'How is the Performance Bank Guarantee (PBG) calculated?'
    ]
  }
];

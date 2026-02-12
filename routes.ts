import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { Server } from 'http';
import { storage } from './storage';
import { testConnection } from './db';

// Track server start time for uptime calculation
const serverStartTime = Date.now();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

async function seedDatabase() {
  await storage.setPilotStats({
    totalSchools: 6,
    totalStudents: 5630,
    greenhouseArea: 34650,
    launchDate: '2026-01-01',
    regionalHubs: 3,
    avgGreenhouseSize: 5775,
  });

  await storage.setEndowmentStats({
    principal: 5000000000,
    annualDistribution: 225000000,
    greenhousesFunded: 1200,
    growthRate: '4.5-7%',
    targetYear: 2030,
  });

  await storage.setFinancialMetrics({
    totalInvestment: 5000000000,
    operatingCosts: 850000000,
    revenueStreams: 1200000000,
    roi: 0.41,
    breakEvenYear: 2028,
    netPresentValue: 3200000000,
  });

  await storage.setClimateMetrics({
    carbonSequestered: 12500,
    waterSaved: 45000000,
    solarGenerated: 2800000,
    biodiversityCount: 145,
    soilHealthScore: 8.7,
    wasteReduction: 78.5,
  });

  await storage.setLegalFramework({
    structure: 'Community Land Trust',
    governanceModel: 'Democratic Stakeholder Governance',
    landOwnership: 'Collective Trust',
    taxStatus: '501(c)(3) Tax-Exempt',
    complianceFramework: 'Federal and State Environmental Regulations',
    stakeholderRights: 'Voting rights for all community members',
  });

  await storage.setNationwideFoodSecurity({
    mealsServed: 45000000,
    nutritionScore: 92.5,
    localFoodPercent: 78,
    foodDesertsCovered: 450,
    emergencyReserve: 30000000,
    distributionNetwork: 'Regional hubs with local distribution centers',
  });

  await storage.setGlobalRegenerationSummary({
    totalCountries: 45,
    globalSchools: 125000,
    totalCarbonOffset: 2500000,
    waterConserved: 850000000,
    biodiversityProtected: 12500,
    employmentCreated: 3750000,
  });

  await storage.setTimelineEvents([
    {
      id: 1,
      year: 2024,
      quarter: 'Q4',
      milestone: 'Pilot Launch Planning',
      description: 'Initial planning and site selection for pilot schools',
      status: 'Completed',
      impact: 'Foundation established',
    },
    {
      id: 2,
      year: 2025,
      quarter: 'Q2',
      milestone: 'First School Operational',
      description: 'Jefferson High School greenhouse operational',
      status: 'Completed',
      impact: 'Proof of concept validated',
    },
    {
      id: 3,
      year: 2026,
      quarter: 'Q1',
      milestone: 'All 6 Pilot Schools Active',
      description: 'Full pilot program operational across 3 regional hubs',
      status: 'In Progress',
      impact: 'Baseline metrics established',
    },
    {
      id: 4,
      year: 2026,
      quarter: 'Q4',
      milestone: 'First Endowment Milestone',
      description: 'Initial $500M endowment secured',
      status: 'On Track',
      impact: 'Financial sustainability proven',
    },
    {
      id: 5,
      year: 2027,
      quarter: 'Q2',
      milestone: '50 Schools Operational',
      description: 'Expansion to 50 schools across 10 states',
      status: 'Planned',
      impact: 'Regional scalability demonstrated',
    },
    {
      id: 6,
      year: 2028,
      quarter: 'Q1',
      milestone: '200 Schools Milestone',
      description: 'Rapid expansion phase begins',
      status: 'Planned',
      impact: 'National footprint established',
    },
    {
      id: 7,
      year: 2029,
      quarter: 'Q3',
      milestone: '1,000 Schools Active',
      description: 'Major scaling milestone achieved',
      status: 'Planned',
      impact: 'System-wide impact visible',
    },
    {
      id: 8,
      year: 2030,
      quarter: 'Q2',
      milestone: '$5B Endowment Reached',
      description: 'Full endowment target achieved',
      status: 'Projected',
      impact: 'Long-term sustainability secured',
    },
    {
      id: 9,
      year: 2030,
      quarter: 'Q4',
      milestone: '10,000 Schools Nationwide',
      description: 'Full national rollout complete',
      status: 'Projected',
      impact: 'Transformational impact achieved',
    },
  ]);

  await storage.setImplementationTimelines([
    {
      id: 1,
      phase: 'Phase 1: Pilot',
      startDate: '2025-01-01',
      endDate: '2026-06-30',
      deliverables: ['6 pilot schools', 'Baseline data collection', 'Curriculum development'],
      milestones: ['First greenhouse operational', 'All pilots active'],
      dependencies: 'Initial funding secured',
    },
    {
      id: 2,
      phase: 'Phase 2: Regional Expansion',
      startDate: '2026-07-01',
      endDate: '2027-12-31',
      deliverables: ['50 schools operational', 'Regional hub network', 'Training programs'],
      milestones: ['10-state presence', 'First endowment distribution'],
      dependencies: 'Pilot success metrics met',
    },
    {
      id: 3,
      phase: 'Phase 3: Rapid Growth',
      startDate: '2028-01-01',
      endDate: '2028-12-31',
      deliverables: ['200 schools', 'Supply chain optimization', 'Job training programs'],
      milestones: ['National recognition', 'Break-even achieved'],
      dependencies: 'Regional validation complete',
    },
    {
      id: 4,
      phase: 'Phase 4: National Scale',
      startDate: '2029-01-01',
      endDate: '2029-12-31',
      deliverables: ['1,000 schools', 'Policy framework', 'International partnerships'],
      milestones: ['Major climate impact', 'Political support secured'],
      dependencies: 'Infrastructure scaled',
    },
    {
      id: 5,
      phase: 'Phase 5: Full Deployment',
      startDate: '2030-01-01',
      endDate: '2030-12-31',
      deliverables: ['10,000 schools', 'Global expansion plan', 'Legacy framework'],
      milestones: ['$5B endowment', 'Transformational impact'],
      dependencies: 'Systemic support established',
    },
  ]);

  await storage.setPoliticalRoadmaps([
    {
      id: 1,
      milestone: 'State-Level Policy Adoption',
      targetDate: '2026-Q4',
      strategy: 'Engage state legislators in pilot states',
      stakeholders: ['State governors', 'Education boards', 'Environmental agencies'],
      successMetrics: '3+ states pass supportive legislation',
      riskLevel: 'Medium',
    },
    {
      id: 2,
      milestone: 'Federal Funding Secured',
      targetDate: '2027-Q2',
      strategy: 'Bipartisan coalition building in Congress',
      stakeholders: ['Senate Agriculture Committee', 'House Education Committee', 'USDA'],
      successMetrics: '$500M federal appropriation',
      riskLevel: 'High',
    },
    {
      id: 3,
      milestone: 'EPA Partnership',
      targetDate: '2027-Q3',
      strategy: 'Align with federal climate goals',
      stakeholders: ['EPA Administrator', 'Climate advisors', 'DOE'],
      successMetrics: 'Official EPA endorsement',
      riskLevel: 'Low',
    },
    {
      id: 4,
      milestone: 'National Education Framework',
      targetDate: '2028-Q2',
      strategy: 'Integration with Department of Education',
      stakeholders: ['Education Secretary', 'National PTA', 'Teachers unions'],
      successMetrics: 'Federal curriculum standards adopted',
      riskLevel: 'Medium',
    },
    {
      id: 5,
      milestone: 'Climate Bill Integration',
      targetDate: '2029-Q1',
      strategy: 'Include in comprehensive climate legislation',
      stakeholders: ['Congressional climate caucus', 'Environmental NGOs', 'Business coalition'],
      successMetrics: 'Legislation passed and signed',
      riskLevel: 'High',
    },
    {
      id: 6,
      milestone: 'International Treaty Recognition',
      targetDate: '2030-Q1',
      strategy: 'Model for global regenerative education',
      stakeholders: ['UN Climate', 'Global education forums', 'Partner nations'],
      successMetrics: 'Adopted by 10+ countries',
      riskLevel: 'Medium',
    },
  ]);

  await storage.setSchools([
    {
      id: 1,
      name: 'Jefferson High School',
      district: 'Portland Public Schools',
      state: 'Oregon',
      students: 1200,
      greenhouseSize: 6500,
      clusterId: 1,
      status: 'Operational',
    },
    {
      id: 2,
      name: 'Roosevelt Middle School',
      district: 'Portland Public Schools',
      state: 'Oregon',
      students: 850,
      greenhouseSize: 5200,
      clusterId: 1,
      status: 'Operational',
    },
    {
      id: 3,
      name: 'Martin Luther King Jr. Elementary',
      district: 'Denver Public Schools',
      state: 'Colorado',
      students: 650,
      greenhouseSize: 4800,
      clusterId: 2,
      status: 'Operational',
    },
    {
      id: 4,
      name: 'Green Valley High School',
      district: 'Denver Public Schools',
      state: 'Colorado',
      students: 1350,
      greenhouseSize: 7200,
      clusterId: 2,
      status: 'In Progress',
    },
    {
      id: 5,
      name: 'Sunrise Academy',
      district: 'Asheville City Schools',
      state: 'North Carolina',
      students: 780,
      greenhouseSize: 5450,
      clusterId: 3,
      status: 'Operational',
    },
    {
      id: 6,
      name: 'Blue Ridge Community School',
      district: 'Asheville City Schools',
      state: 'North Carolina',
      students: 800,
      greenhouseSize: 5500,
      clusterId: 3,
      status: 'In Progress',
    },
  ]);

  await storage.setSchoolClusters([
    {
      id: 1,
      name: 'Pacific Northwest Hub',
      region: 'Oregon/Washington',
      schools: 2,
      students: 2050,
      coordinator: 'Dr. Sarah Chen',
      launchDate: '2025-06-01',
    },
    {
      id: 2,
      name: 'Rocky Mountain Hub',
      region: 'Colorado/Utah',
      schools: 2,
      students: 2000,
      coordinator: 'Michael Torres',
      launchDate: '2025-09-01',
    },
    {
      id: 3,
      name: 'Appalachian Hub',
      region: 'North Carolina/Tennessee',
      schools: 2,
      students: 1580,
      coordinator: 'Jennifer Martinez',
      launchDate: '2025-12-01',
    },
  ]);

  await storage.setK12Curriculums([
    {
      id: 1,
      gradeLevel: 'K-2',
      moduleName: 'Seeds and Soil',
      subject: 'Life Science',
      hoursRequired: 20,
      learningObjectives: ['Plant life cycles', 'Soil composition', 'Water conservation'],
      assessmentType: 'Project-based',
    },
    {
      id: 2,
      gradeLevel: '3-5',
      moduleName: 'Food Systems',
      subject: 'Social Studies',
      hoursRequired: 25,
      learningObjectives: ['Local food production', 'Supply chains', 'Community nutrition'],
      assessmentType: 'Research project',
    },
    {
      id: 3,
      gradeLevel: '6-8',
      moduleName: 'Climate and Agriculture',
      subject: 'Earth Science',
      hoursRequired: 30,
      learningObjectives: ['Carbon cycle', 'Climate impact', 'Regenerative practices'],
      assessmentType: 'Lab reports',
    },
    {
      id: 4,
      gradeLevel: '6-8',
      moduleName: 'Economics of Sustainability',
      subject: 'Economics',
      hoursRequired: 28,
      learningObjectives: ['Resource economics', 'Sustainability metrics', 'Cost-benefit analysis'],
      assessmentType: 'Case studies',
    },
    {
      id: 5,
      gradeLevel: '9-12',
      moduleName: 'Advanced Permaculture',
      subject: 'Environmental Science',
      hoursRequired: 40,
      learningObjectives: ['Ecosystem design', 'Biodiversity', 'Water management'],
      assessmentType: 'Capstone project',
    },
    {
      id: 6,
      gradeLevel: '9-12',
      moduleName: 'Green Technology',
      subject: 'Engineering',
      hoursRequired: 35,
      learningObjectives: ['Solar systems', 'Hydroponics', 'Energy efficiency'],
      assessmentType: 'Technical portfolio',
    },
  ]);

  await storage.setSlides([
    {
      id: 1,
      slideNumber: 1,
      title: 'Gaia Commons',
      subtitle: 'Regenerative Education for a Sustainable Future',
      content:
        'A nationwide network of school-based greenhouses transforming education, climate, and food security',
      visualType: 'Hero image',
      keyMetrics: ['6 pilot schools', '5,630 students', '$5B endowment'],
    },
    {
      id: 2,
      slideNumber: 2,
      title: 'The Challenge',
      subtitle: 'Three Interconnected Crises',
      content:
        'Climate emergency, food insecurity, and educational disengagement require systemic solutions',
      visualType: 'Problem statement',
      keyMetrics: ['12% food insecurity', '40% student disengagement', '1.5°C warming'],
    },
    {
      id: 3,
      slideNumber: 3,
      title: 'Our Solution',
      subtitle: 'Schools as Regeneration Hubs',
      content:
        'Every school becomes a center for food production, climate education, and community resilience',
      visualType: 'Solution diagram',
      keyMetrics: ['10,000 schools by 2030', '9M students', '2.5M tons carbon'],
    },
    {
      id: 4,
      slideNumber: 4,
      title: 'Pilot Results',
      subtitle: 'Proven Impact in Year One',
      content:
        'Six schools demonstrate measurable improvements in student engagement, food security, and climate metrics',
      visualType: 'Data dashboard',
      keyMetrics: ['34,650 sq ft greenhouses', '12,500 tons carbon', '45M gallons water saved'],
    },
    {
      id: 5,
      slideNumber: 5,
      title: 'Financial Model',
      subtitle: '$5B Endowment by 2030',
      content: 'Sustainable funding through diversified endowment generating $225M annually',
      visualType: 'Financial projections',
      keyMetrics: ['$5B principal', '$225M annual', '4.5-7% growth'],
    },
    {
      id: 6,
      slideNumber: 6,
      title: 'Scale Plan',
      subtitle: '5-Year Roadmap',
      content: 'Phased expansion from 6 pilot schools to 10,000 nationwide by 2030',
      visualType: 'Timeline chart',
      keyMetrics: ['2026: 6 schools', '2028: 200 schools', '2030: 10,000 schools'],
    },
    {
      id: 7,
      slideNumber: 7,
      title: 'Coalition Support',
      subtitle: 'Bipartisan Backing',
      content: 'Broad coalition of education, environmental, and economic development partners',
      visualType: 'Partner logos',
      keyMetrics: ['6 major partners', '5 tribal nations', '3 federal agencies'],
    },
    {
      id: 8,
      slideNumber: 8,
      title: 'Join Us',
      subtitle: 'Build the Future',
      content: 'Opportunities for schools, funders, policymakers, and communities to participate',
      visualType: 'Call to action',
      keyMetrics: ['Apply now', 'Invest today', 'Learn more'],
    },
  ]);

  await storage.setScaleProjections([
    {
      id: 1,
      year: 2026,
      schools: 6,
      students: 5630,
      investment: 125000000,
      greenhouses: 6,
      employmentCreated: 180,
      carbonOffset: 12500,
    },
    {
      id: 2,
      year: 2027,
      schools: 50,
      students: 45000,
      investment: 450000000,
      greenhouses: 50,
      employmentCreated: 1500,
      carbonOffset: 104000,
    },
    {
      id: 3,
      year: 2028,
      schools: 200,
      students: 180000,
      investment: 1200000000,
      greenhouses: 200,
      employmentCreated: 6000,
      carbonOffset: 416000,
    },
    {
      id: 4,
      year: 2029,
      schools: 1000,
      students: 900000,
      investment: 2800000000,
      greenhouses: 1000,
      employmentCreated: 30000,
      carbonOffset: 2080000,
    },
    {
      id: 5,
      year: 2030,
      schools: 10000,
      students: 9000000,
      investment: 5000000000,
      greenhouses: 10000,
      employmentCreated: 300000,
      carbonOffset: 20800000,
    },
  ]);

  await storage.setHistoricalFinancials([
    {
      id: 1,
      year: 2021,
      revenue: 0,
      expenses: 2500000,
      netIncome: -2500000,
      assets: 5000000,
      liabilities: 1000000,
      equity: 4000000,
    },
    {
      id: 2,
      year: 2022,
      revenue: 500000,
      expenses: 8000000,
      netIncome: -7500000,
      assets: 15000000,
      liabilities: 3000000,
      equity: 12000000,
    },
    {
      id: 3,
      year: 2023,
      revenue: 2000000,
      expenses: 18000000,
      netIncome: -16000000,
      assets: 45000000,
      liabilities: 8000000,
      equity: 37000000,
    },
    {
      id: 4,
      year: 2024,
      revenue: 8000000,
      expenses: 35000000,
      netIncome: -27000000,
      assets: 125000000,
      liabilities: 15000000,
      equity: 110000000,
    },
    {
      id: 5,
      year: 2025,
      revenue: 25000000,
      expenses: 85000000,
      netIncome: -60000000,
      assets: 450000000,
      liabilities: 50000000,
      equity: 400000000,
    },
  ]);

  await storage.setEndowmentProjections([
    {
      id: 1,
      year: 2026,
      principal: 500000000,
      returns: 30000000,
      distributions: 22500000,
      growthRate: 6.0,
      assumptions: 'Conservative market returns, steady contributions',
    },
    {
      id: 2,
      year: 2027,
      principal: 1200000000,
      returns: 72000000,
      distributions: 54000000,
      growthRate: 6.0,
      assumptions: 'Federal matching funds secured',
    },
    {
      id: 3,
      year: 2028,
      principal: 2000000000,
      returns: 120000000,
      distributions: 90000000,
      growthRate: 6.0,
      assumptions: 'Major philanthropic commitments',
    },
    {
      id: 4,
      year: 2029,
      principal: 3500000000,
      returns: 210000000,
      distributions: 157500000,
      growthRate: 6.0,
      assumptions: 'Climate bond issuance',
    },
    {
      id: 5,
      year: 2030,
      principal: 5000000000,
      returns: 300000000,
      distributions: 225000000,
      growthRate: 6.0,
      assumptions: 'Full endowment target achieved',
    },
  ]);

  await storage.setFundingSources([
    {
      id: 1,
      sourceName: 'Federal Climate Grants',
      fundingType: 'Government',
      amount: 1500000000,
      status: 'Committed',
      terms: '10-year appropriation',
      timeline: '2026-2030',
    },
    {
      id: 2,
      sourceName: 'Philanthropic Foundations',
      fundingType: 'Private',
      amount: 1200000000,
      status: 'Committed',
      terms: 'Matching fund structure',
      timeline: '2025-2029',
    },
    {
      id: 3,
      sourceName: 'Green Bonds',
      fundingType: 'Debt',
      amount: 800000000,
      status: 'In Progress',
      terms: '20-year municipal bonds',
      timeline: '2027-2030',
    },
    {
      id: 4,
      sourceName: 'State Education Budgets',
      fundingType: 'Government',
      amount: 700000000,
      status: 'Committed',
      terms: 'Per-school allocation',
      timeline: '2026-2030',
    },
    {
      id: 5,
      sourceName: 'Impact Investors',
      fundingType: 'Private',
      amount: 500000000,
      status: 'Committed',
      terms: 'Social return focus',
      timeline: '2026-2028',
    },
    {
      id: 6,
      sourceName: 'Carbon Credit Revenue',
      fundingType: 'Earned',
      amount: 300000000,
      status: 'Projected',
      terms: 'Market-based',
      timeline: '2028-2030',
    },
  ]);

  await storage.setEnvironmentalImpacts([
    {
      id: 1,
      category: 'Carbon Sequestration',
      metric: 'Annual CO2 captured',
      currentValue: 12500,
      projectedValue: 20800000,
      unit: 'tons',
      methodology: 'Soil carbon analysis and vegetation growth modeling',
    },
    {
      id: 2,
      category: 'Water Conservation',
      metric: 'Annual water saved',
      currentValue: 45000000,
      projectedValue: 75000000000,
      unit: 'gallons',
      methodology: 'Drip irrigation vs traditional comparison',
    },
    {
      id: 3,
      category: 'Renewable Energy',
      metric: 'Annual solar generation',
      currentValue: 2800000,
      projectedValue: 4700000000,
      unit: 'kWh',
      methodology: 'Solar panel output monitoring',
    },
    {
      id: 4,
      category: 'Biodiversity',
      metric: 'Species count',
      currentValue: 145,
      projectedValue: 2400,
      unit: 'species',
      methodology: 'Ecological surveys and habitat assessment',
    },
    {
      id: 5,
      category: 'Soil Health',
      metric: 'Composite soil score',
      currentValue: 8.7,
      projectedValue: 9.2,
      unit: 'index',
      methodology: 'Multi-factor soil testing protocol',
    },
    {
      id: 6,
      category: 'Waste Reduction',
      metric: 'Organic waste diverted',
      currentValue: 78.5,
      projectedValue: 95.0,
      unit: 'percent',
      methodology: 'Composting and recycling tracking',
    },
  ]);

  await storage.setRegenerativeAgriculturePractices([
    {
      id: 1,
      practice: 'No-Till Farming',
      description: 'Minimal soil disturbance to preserve structure',
      carbonSequestration: 1.5,
      soilHealthImprovement: 25,
      waterConservation: 30,
      implementationCost: 2500,
    },
    {
      id: 2,
      practice: 'Cover Cropping',
      description: 'Year-round soil coverage with diverse plants',
      carbonSequestration: 2.0,
      soilHealthImprovement: 35,
      waterConservation: 20,
      implementationCost: 1800,
    },
    {
      id: 3,
      practice: 'Composting',
      description: 'Converting organic waste to nutrient-rich soil',
      carbonSequestration: 1.2,
      soilHealthImprovement: 40,
      waterConservation: 15,
      implementationCost: 3200,
    },
    {
      id: 4,
      practice: 'Crop Rotation',
      description: 'Diverse planting sequences to improve soil',
      carbonSequestration: 1.0,
      soilHealthImprovement: 30,
      waterConservation: 10,
      implementationCost: 1500,
    },
    {
      id: 5,
      practice: 'Agroforestry',
      description: 'Integrating trees with crops for ecosystem benefits',
      carbonSequestration: 3.5,
      soilHealthImprovement: 45,
      waterConservation: 40,
      implementationCost: 8500,
    },
    {
      id: 6,
      practice: 'Integrated Pest Management',
      description: 'Ecological pest control reducing chemical use',
      carbonSequestration: 0.5,
      soilHealthImprovement: 20,
      waterConservation: 5,
      implementationCost: 2000,
    },
  ]);

  await storage.setTieredCarbonPricings([
    {
      id: 1,
      tier: 'Tier 1: Community Scale',
      pricePerTon: 25,
      volumeThreshold: 100,
      applicability: 'Individual schools and small farms',
      incentives: 'Bonus for early adoption',
      adjustmentSchedule: 'Annual CPI adjustment',
    },
    {
      id: 2,
      tier: 'Tier 2: District Scale',
      pricePerTon: 35,
      volumeThreshold: 1000,
      applicability: 'School districts and regional cooperatives',
      incentives: 'Volume discounts available',
      adjustmentSchedule: 'Biannual market review',
    },
    {
      id: 3,
      tier: 'Tier 3: State Scale',
      pricePerTon: 50,
      volumeThreshold: 10000,
      applicability: 'State-wide programs',
      incentives: 'Infrastructure grants',
      adjustmentSchedule: 'Quarterly adjustment',
    },
    {
      id: 4,
      tier: 'Tier 4: National Scale',
      pricePerTon: 75,
      volumeThreshold: 100000,
      applicability: 'Federal programs and large corporations',
      incentives: 'Policy support and recognition',
      adjustmentSchedule: 'Market-driven pricing',
    },
  ]);

  await storage.setJobCreations([
    {
      id: 1,
      category: 'Education',
      jobType: 'Greenhouse Educators',
      positions: 15000,
      avgSalary: 52000,
      skillsRequired: [
        'Teaching certification',
        'Agricultural knowledge',
        'Curriculum development',
      ],
      growthRate: 12.5,
    },
    {
      id: 2,
      category: 'Agriculture',
      jobType: 'Greenhouse Technicians',
      positions: 20000,
      avgSalary: 45000,
      skillsRequired: ['Horticulture', 'Systems maintenance', 'Data collection'],
      growthRate: 15.0,
    },
    {
      id: 3,
      category: 'Construction',
      jobType: 'Green Infrastructure Workers',
      positions: 8000,
      avgSalary: 58000,
      skillsRequired: ['Construction', 'Solar installation', 'Plumbing'],
      growthRate: 10.0,
    },
    {
      id: 4,
      category: 'Management',
      jobType: 'Program Coordinators',
      positions: 3000,
      avgSalary: 68000,
      skillsRequired: ['Project management', 'Community engagement', 'Budget oversight'],
      growthRate: 8.5,
    },
    {
      id: 5,
      category: 'Technology',
      jobType: 'Data Analysts',
      positions: 2000,
      avgSalary: 75000,
      skillsRequired: ['Data science', 'Climate modeling', 'Systems analysis'],
      growthRate: 18.0,
    },
  ]);

  await storage.setExpandedJobs([
    {
      id: 1,
      sector: 'Food Distribution',
      jobType: 'Logistics Coordinators',
      indirectPositions: 12000,
      multiplierEffect: 2.4,
      region: 'National',
      description: 'Managing food distribution networks from schools to communities',
    },
    {
      id: 2,
      sector: 'Manufacturing',
      jobType: 'Equipment Suppliers',
      indirectPositions: 8500,
      multiplierEffect: 1.7,
      region: 'Regional',
      description: 'Producing greenhouse systems, solar panels, and agricultural equipment',
    },
    {
      id: 3,
      sector: 'Professional Services',
      jobType: 'Consultants and Trainers',
      indirectPositions: 5500,
      multiplierEffect: 1.1,
      region: 'National',
      description: 'Providing technical assistance and training programs',
    },
    {
      id: 4,
      sector: 'Research',
      jobType: 'Academic Researchers',
      indirectPositions: 3200,
      multiplierEffect: 0.6,
      region: 'Universities',
      description: 'Studying climate impact, educational outcomes, and agricultural innovation',
    },
    {
      id: 5,
      sector: 'Healthcare',
      jobType: 'Nutrition Specialists',
      indirectPositions: 4800,
      multiplierEffect: 1.0,
      region: 'Community',
      description: 'Supporting improved nutrition and food access programs',
    },
  ]);

  await storage.setLaborTransitions([
    {
      id: 1,
      sector: 'Fossil Fuel Industry',
      currentJobs: 150000,
      projectedJobs: 45000,
      retrainingRequired: 'Renewable energy certification',
      timelineMonths: 18,
      supportPrograms: ['Federal retraining grants', 'Apprenticeship programs', 'Income support'],
    },
    {
      id: 2,
      sector: 'Traditional Agriculture',
      currentJobs: 280000,
      projectedJobs: 320000,
      retrainingRequired: 'Regenerative practices training',
      timelineMonths: 12,
      supportPrograms: ['USDA transition support', 'Mentorship networks', 'Equipment subsidies'],
    },
    {
      id: 3,
      sector: 'Food Service',
      currentJobs: 420000,
      projectedJobs: 480000,
      retrainingRequired: 'Local food systems training',
      timelineMonths: 6,
      supportPrograms: ['Community college partnerships', 'On-the-job training', 'Career pathways'],
    },
    {
      id: 4,
      sector: 'Education Support',
      currentJobs: 180000,
      projectedJobs: 250000,
      retrainingRequired: 'Environmental education certification',
      timelineMonths: 9,
      supportPrograms: [
        'Teacher training programs',
        'Credential support',
        'Professional development',
      ],
    },
  ]);

  await storage.setCoalitionPartners([
    {
      id: 1,
      organization: 'National Education Association',
      partnerType: 'Labor Union',
      contribution: 'Teacher training and advocacy',
      commitment: '5-year partnership agreement',
      contactPerson: 'Rebecca Williams',
      activeDate: '2025-03-15',
    },
    {
      id: 2,
      organization: 'Sierra Club',
      partnerType: 'Environmental NGO',
      contribution: 'Climate advocacy and technical support',
      commitment: 'Long-term strategic partnership',
      contactPerson: 'James Chen',
      activeDate: '2025-01-10',
    },
    {
      id: 3,
      organization: 'American Farm Bureau',
      partnerType: 'Agricultural Association',
      contribution: 'Agricultural expertise and network',
      commitment: '3-year pilot support',
      contactPerson: 'Maria Rodriguez',
      activeDate: '2025-06-01',
    },
    {
      id: 4,
      organization: 'Bloomberg Philanthropies',
      partnerType: 'Foundation',
      contribution: '$250M funding commitment',
      commitment: '10-year funding agreement',
      contactPerson: 'David Park',
      activeDate: '2024-11-20',
    },
    {
      id: 5,
      organization: 'National School Boards Association',
      partnerType: 'Education Association',
      contribution: 'Policy development and implementation',
      commitment: 'Ongoing partnership',
      contactPerson: 'Angela Martinez',
      activeDate: '2025-02-01',
    },
    {
      id: 6,
      organization: 'US Conference of Mayors',
      partnerType: 'Government Association',
      contribution: 'Municipal support and coordination',
      commitment: 'Multi-year engagement',
      contactPerson: 'Thomas Johnson',
      activeDate: '2025-04-15',
    },
  ]);

  await storage.setTribalPartnerships([
    {
      id: 1,
      tribeName: 'Navajo Nation',
      location: 'Arizona/New Mexico/Utah',
      partnershipType: 'Co-governance',
      focus: 'Traditional ecological knowledge integration',
      benefitsShared: 'Revenue sharing and employment priority',
      culturalIntegration: 'Traditional farming practices and ceremonies',
    },
    {
      id: 2,
      tribeName: 'Cherokee Nation',
      location: 'Oklahoma',
      partnershipType: 'Educational Partnership',
      focus: 'Youth education and cultural preservation',
      benefitsShared: 'Scholarship programs and job training',
      culturalIntegration: 'Cherokee language and heritage programs',
    },
    {
      id: 3,
      tribeName: 'Oglala Lakota',
      location: 'South Dakota',
      partnershipType: 'Land Stewardship',
      focus: 'Buffalo restoration and prairie ecology',
      benefitsShared: 'Land rights and resource management',
      culturalIntegration: 'Traditional buffalo management practices',
    },
    {
      id: 4,
      tribeName: 'Confederated Tribes of Warm Springs',
      location: 'Oregon',
      partnershipType: 'Resource Management',
      focus: 'Water conservation and salmon habitat',
      benefitsShared: 'Water rights and ecosystem restoration',
      culturalIntegration: 'Salmon ceremony and watershed stewardship',
    },
    {
      id: 5,
      tribeName: 'Seminole Tribe of Florida',
      location: 'Florida',
      partnershipType: 'Economic Development',
      focus: 'Sustainable agriculture and tourism',
      benefitsShared: 'Business development and revenue sharing',
      culturalIntegration: 'Traditional crop cultivation methods',
    },
  ]);

  await storage.setTransparencyFeatures([
    {
      id: 1,
      featureName: 'Real-time Financial Dashboard',
      description: 'Public access to all financial transactions and endowment performance',
      implementation: 'Web portal with API access',
      accessLevel: 'Public',
      updateFrequency: 'Daily',
    },
    {
      id: 2,
      featureName: 'Climate Impact Tracker',
      description: 'Live monitoring of carbon sequestration and environmental metrics',
      implementation: 'IoT sensors and data visualization',
      accessLevel: 'Public',
      updateFrequency: 'Hourly',
    },
    {
      id: 3,
      featureName: 'Student Outcome Reports',
      description: 'Academic performance and engagement metrics by school',
      implementation: 'Anonymized data portal',
      accessLevel: 'Public',
      updateFrequency: 'Quarterly',
    },
    {
      id: 4,
      featureName: 'Community Feedback System',
      description: 'Direct input channel for stakeholders and community members',
      implementation: 'Online platform and town halls',
      accessLevel: 'Public',
      updateFrequency: 'Continuous',
    },
    {
      id: 5,
      featureName: 'Open Source Technology',
      description: 'All software and technical specifications publicly available',
      implementation: 'GitHub repositories and documentation',
      accessLevel: 'Public',
      updateFrequency: 'Continuous',
    },
  ]);

  await storage.setAccountabilityMechanisms([
    {
      id: 1,
      mechanism: 'Independent Audits',
      description: 'Annual third-party financial and programmatic audits',
      frequency: 'Annual',
      stakeholders: ['Auditing firms', 'Board of directors', 'Public'],
      enforcementMethod: 'Mandatory corrective action plans',
    },
    {
      id: 2,
      mechanism: 'Community Oversight Board',
      description: 'Elected representatives from participating communities',
      frequency: 'Quarterly meetings',
      stakeholders: ['Community members', 'Parents', 'Students'],
      enforcementMethod: 'Voting authority on major decisions',
    },
    {
      id: 3,
      mechanism: 'Environmental Impact Assessment',
      description: 'Third-party verification of climate and ecological claims',
      frequency: 'Biannual',
      stakeholders: ['Environmental scientists', 'EPA', 'NGOs'],
      enforcementMethod: 'Public reporting and certification',
    },
    {
      id: 4,
      mechanism: 'Student and Parent Surveys',
      description: 'Regular feedback collection on program effectiveness',
      frequency: 'Semester',
      stakeholders: ['Students', 'Parents', 'Teachers'],
      enforcementMethod: 'Performance improvement requirements',
    },
    {
      id: 5,
      mechanism: 'Whistleblower Protection',
      description: 'Confidential reporting system for concerns and violations',
      frequency: 'Continuous',
      stakeholders: ['Employees', 'Community members', 'Partners'],
      enforcementMethod: 'Independent investigation process',
    },
  ]);

  await storage.setStressTests([
    {
      id: 1,
      scenarioName: 'Economic Recession',
      stressType: 'Financial',
      severity: 'High',
      impactDescription: '30% reduction in funding and endowment returns',
      mitigationStrategy: 'Reserve fund and phased rollout adjustments',
      recoveryTime: '18-24 months',
    },
    {
      id: 2,
      scenarioName: 'Climate Disaster',
      stressType: 'Environmental',
      severity: 'Severe',
      impactDescription: 'Major weather events damaging 15% of greenhouses',
      mitigationStrategy: 'Insurance coverage and rapid response teams',
      recoveryTime: '12-18 months',
    },
    {
      id: 3,
      scenarioName: 'Political Opposition',
      stressType: 'Political',
      severity: 'Medium',
      impactDescription: 'Loss of federal support and state-level resistance',
      mitigationStrategy: 'Diversified funding and grassroots mobilization',
      recoveryTime: '24-36 months',
    },
    {
      id: 4,
      scenarioName: 'Supply Chain Disruption',
      stressType: 'Operational',
      severity: 'Medium',
      impactDescription: 'Equipment delays and cost increases',
      mitigationStrategy: 'Local manufacturing partnerships and inventory buffers',
      recoveryTime: '6-12 months',
    },
    {
      id: 5,
      scenarioName: 'Pandemic Impact',
      stressType: 'Health',
      severity: 'High',
      impactDescription: 'School closures and reduced student participation',
      mitigationStrategy: 'Remote learning integration and safety protocols',
      recoveryTime: '12-24 months',
    },
  ]);

  await storage.setMonteCarloSimulations([
    {
      id: 1,
      simulationName: 'Endowment Growth',
      iterations: 10000,
      meanOutcome: 5200000000,
      standardDeviation: 850000000,
      confidenceInterval: '90% CI: $4.1B-$6.3B',
      assumptions: 'Variable market returns and contribution timing',
    },
    {
      id: 2,
      simulationName: 'Student Enrollment',
      iterations: 10000,
      meanOutcome: 8750000,
      standardDeviation: 1200000,
      confidenceInterval: '90% CI: 6.8M-10.7M',
      assumptions: 'Varying adoption rates and demographic changes',
    },
    {
      id: 3,
      simulationName: 'Carbon Sequestration',
      iterations: 10000,
      meanOutcome: 19500000,
      standardDeviation: 3200000,
      confidenceInterval: '90% CI: 14.2M-24.8M tons',
      assumptions: 'Climate variability and practice effectiveness',
    },
    {
      id: 4,
      simulationName: 'Political Support',
      iterations: 10000,
      meanOutcome: 72,
      standardDeviation: 15,
      confidenceInterval: '90% CI: 48%-96%',
      assumptions: 'Electoral cycles and policy environment',
    },
  ]);

  await storage.setScenarioComparisons([
    {
      id: 1,
      scenarioName: 'Baseline: Current Trajectory',
      policyApproach: 'Status quo policies',
      climateOutcome: 2.5,
      economicCost: 8500000000000,
      socialBenefit: 2.1,
      feasibility: 'High likelihood',
    },
    {
      id: 2,
      scenarioName: 'Gaia Commons Implementation',
      policyApproach: 'Full program deployment',
      climateOutcome: 1.8,
      economicCost: 5000000000,
      socialBenefit: 8.7,
      feasibility: 'Medium-high likelihood',
    },
    {
      id: 3,
      scenarioName: 'Accelerated Green New Deal',
      policyApproach: 'Comprehensive federal program',
      climateOutcome: 1.5,
      economicCost: 50000000000,
      socialBenefit: 9.2,
      feasibility: 'Medium likelihood',
    },
    {
      id: 4,
      scenarioName: 'Market-Only Solutions',
      policyApproach: 'Carbon pricing without programs',
      climateOutcome: 2.2,
      economicCost: 2000000000,
      socialBenefit: 3.5,
      feasibility: 'High likelihood',
    },
  ]);

  await storage.setSensitivityAnalyses([
    {
      id: 1,
      variable: 'Endowment Return Rate',
      baselineValue: 6.0,
      sensitivityCoefficient: 0.85,
      impactOnOutcome: '1% change = $150M annual impact',
      criticalThreshold: 3.5,
      confidenceLevel: 0.75,
    },
    {
      id: 2,
      variable: 'Student Participation Rate',
      baselineValue: 85,
      sensitivityCoefficient: 1.2,
      impactOnOutcome: '10% change = 900K students',
      criticalThreshold: 60,
      confidenceLevel: 0.82,
    },
    {
      id: 3,
      variable: 'Carbon Price per Ton',
      baselineValue: 50,
      sensitivityCoefficient: 0.65,
      impactOnOutcome: '$10 change = $200M revenue impact',
      criticalThreshold: 25,
      confidenceLevel: 0.68,
    },
    {
      id: 4,
      variable: 'Federal Funding Level',
      baselineValue: 1500000000,
      sensitivityCoefficient: 0.95,
      impactOnOutcome: '20% reduction = 2-year delay',
      criticalThreshold: 750000000,
      confidenceLevel: 0.71,
    },
    {
      id: 5,
      variable: 'Implementation Speed',
      baselineValue: 100,
      sensitivityCoefficient: 1.1,
      impactOnOutcome: '25% slower = target year 2032',
      criticalThreshold: 50,
      confidenceLevel: 0.79,
    },
  ]);

  await storage.setOptimizationParams([
    {
      id: 1,
      parameterName: 'Greenhouse Size',
      currentValue: 5775,
      optimalRange: '5000-7000 sq ft',
      sensitivity: 0.45,
      adjustmentImpact: 'Cost efficiency vs capacity tradeoff',
      constraints: 'School property limitations',
    },
    {
      id: 2,
      parameterName: 'Teacher-Student Ratio',
      currentValue: 1 / 25,
      optimalRange: '1:20 to 1:30',
      sensitivity: 0.72,
      adjustmentImpact: 'Educational quality vs staffing costs',
      constraints: 'Union agreements and standards',
    },
    {
      id: 3,
      parameterName: 'Regional Hub Density',
      currentValue: 3,
      optimalRange: '8-12 hubs nationally',
      sensitivity: 0.58,
      adjustmentImpact: 'Coordination efficiency vs local autonomy',
      constraints: 'Geographic distribution requirements',
    },
    {
      id: 4,
      parameterName: 'Curriculum Hours',
      currentValue: 30,
      optimalRange: '25-40 hours per module',
      sensitivity: 0.34,
      adjustmentImpact: 'Learning depth vs schedule flexibility',
      constraints: 'State education requirements',
    },
    {
      id: 5,
      parameterName: 'Endowment Allocation',
      currentValue: 0.045,
      optimalRange: '4.0-5.5% distribution rate',
      sensitivity: 0.88,
      adjustmentImpact: 'Current funding vs long-term sustainability',
      constraints: 'Nonprofit regulations',
    },
  ]);

  await storage.setCalibrationTargets([
    {
      id: 1,
      targetName: 'Student Engagement Score',
      targetValue: 85,
      currentValue: 82,
      calibrationMethod: 'Survey and attendance data',
      accuracy: 0.92,
      validationSource: 'Independent educational research',
    },
    {
      id: 2,
      targetName: 'Carbon Sequestration Rate',
      targetValue: 2080,
      currentValue: 2050,
      calibrationMethod: 'Soil sampling and modeling',
      accuracy: 0.87,
      validationSource: 'EPA verification protocols',
    },
    {
      id: 3,
      targetName: 'Cost per Student',
      targetValue: 550,
      currentValue: 578,
      calibrationMethod: 'Financial tracking and analysis',
      accuracy: 0.95,
      validationSource: 'Third-party audit',
    },
    {
      id: 4,
      targetName: 'Community Satisfaction',
      targetValue: 90,
      currentValue: 88,
      calibrationMethod: 'Stakeholder surveys',
      accuracy: 0.83,
      validationSource: 'University research partnership',
    },
    {
      id: 5,
      targetName: 'Food Production Efficiency',
      targetValue: 95,
      currentValue: 91,
      calibrationMethod: 'Yield measurement and benchmarking',
      accuracy: 0.89,
      validationSource: 'Agricultural extension services',
    },
  ]);

  await storage.setModelMaturities([
    {
      id: 1,
      component: 'Financial Projections',
      maturityLevel: 'Advanced',
      dataQuality: 0.88,
      validationStatus: 'Third-party verified',
      uncertaintyRange: '±12%',
      improvementNeeded: 'Long-term market assumptions',
    },
    {
      id: 2,
      component: 'Climate Impact Model',
      maturityLevel: 'Intermediate',
      dataQuality: 0.82,
      validationStatus: 'Peer-reviewed methodology',
      uncertaintyRange: '±18%',
      improvementNeeded: 'Regional climate variations',
    },
    {
      id: 3,
      component: 'Student Outcome Tracking',
      maturityLevel: 'Advanced',
      dataQuality: 0.91,
      validationStatus: 'IRB approved protocols',
      uncertaintyRange: '±8%',
      improvementNeeded: 'Long-term outcome studies',
    },
    {
      id: 4,
      component: 'Scale Deployment Model',
      maturityLevel: 'Developing',
      dataQuality: 0.76,
      validationStatus: 'Pilot data only',
      uncertaintyRange: '±25%',
      improvementNeeded: 'Multi-year operational data',
    },
    {
      id: 5,
      component: 'Political Feasibility',
      maturityLevel: 'Basic',
      dataQuality: 0.65,
      validationStatus: 'Expert judgment',
      uncertaintyRange: '±35%',
      improvementNeeded: 'Stakeholder engagement data',
    },
  ]);

  await storage.setHistoricalClimateData([
    {
      id: 1,
      year: 2020,
      avgTemperature: 14.88,
      precipitation: 990,
      extremeEvents: 22,
      co2Levels: 414,
      seaLevelChange: 3.6,
    },
    {
      id: 2,
      year: 2021,
      avgTemperature: 14.92,
      precipitation: 1005,
      extremeEvents: 24,
      co2Levels: 416,
      seaLevelChange: 3.8,
    },
    {
      id: 3,
      year: 2022,
      avgTemperature: 14.98,
      precipitation: 985,
      extremeEvents: 28,
      co2Levels: 418,
      seaLevelChange: 4.0,
    },
    {
      id: 4,
      year: 2023,
      avgTemperature: 15.05,
      precipitation: 1020,
      extremeEvents: 31,
      co2Levels: 421,
      seaLevelChange: 4.3,
    },
    {
      id: 5,
      year: 2024,
      avgTemperature: 15.12,
      precipitation: 995,
      extremeEvents: 29,
      co2Levels: 424,
      seaLevelChange: 4.5,
    },
    {
      id: 6,
      year: 2025,
      avgTemperature: 15.18,
      precipitation: 1010,
      extremeEvents: 33,
      co2Levels: 427,
      seaLevelChange: 4.8,
    },
  ]);

  await storage.setPoliticalCoalitions([
    {
      id: 1,
      group: 'Progressive Democrats',
      alignment: 'Strong Support',
      size: 95,
      keyIssues: ['Climate action', 'Education equity', 'Food security'],
      engagementStrategy: 'Direct advocacy and coalition building',
      influence: 'High',
    },
    {
      id: 2,
      group: 'Moderate Democrats',
      alignment: 'Support with Conditions',
      size: 120,
      keyIssues: ['Fiscal responsibility', 'Local control', 'Job creation'],
      engagementStrategy: 'Economic benefits emphasis',
      influence: 'Very High',
    },
    {
      id: 3,
      group: 'Progressive Republicans',
      alignment: 'Cautious Support',
      size: 35,
      keyIssues: ['Rural development', 'Agriculture', 'Conservation'],
      engagementStrategy: 'Local benefits and tradition',
      influence: 'Medium',
    },
    {
      id: 4,
      group: 'Moderate Republicans',
      alignment: 'Neutral to Skeptical',
      size: 85,
      keyIssues: ['Cost concerns', 'Federal overreach', 'Market solutions'],
      engagementStrategy: 'Private sector partnerships',
      influence: 'High',
    },
    {
      id: 5,
      group: 'Environmental Movement',
      alignment: 'Strong Support',
      size: 250,
      keyIssues: ['Climate emergency', 'Biodiversity', 'Sustainability'],
      engagementStrategy: 'Grassroots mobilization',
      influence: 'Medium-High',
    },
    {
      id: 6,
      group: 'Education Advocates',
      alignment: 'Strong Support',
      size: 180,
      keyIssues: ['Student engagement', 'Hands-on learning', 'Career readiness'],
      engagementStrategy: 'Teacher and parent organizing',
      influence: 'High',
    },
  ]);

  await storage.setPlanetaryBoundaries([
    {
      id: 1,
      boundary: 'Climate Change',
      currentStatus: 'Beyond safe zone',
      threshold: 350,
      currentValue: 427,
      trendDirection: 'Worsening',
      gaiaImpact: 'Significant mitigation potential',
    },
    {
      id: 2,
      boundary: 'Biodiversity Loss',
      currentStatus: 'Beyond safe zone',
      threshold: 10,
      currentValue: 100,
      trendDirection: 'Worsening',
      gaiaImpact: 'Habitat restoration benefits',
    },
    {
      id: 3,
      boundary: 'Nitrogen Cycle',
      currentStatus: 'Beyond safe zone',
      threshold: 62,
      currentValue: 150,
      trendDirection: 'Worsening',
      gaiaImpact: 'Reduced fertilizer dependency',
    },
    {
      id: 4,
      boundary: 'Freshwater Use',
      currentStatus: 'Approaching boundary',
      threshold: 4000,
      currentValue: 2600,
      trendDirection: 'Stable',
      gaiaImpact: 'Major water conservation',
    },
    {
      id: 5,
      boundary: 'Land System Change',
      currentStatus: 'Beyond safe zone',
      threshold: 75,
      currentValue: 62,
      trendDirection: 'Worsening',
      gaiaImpact: 'Reduced conversion pressure',
    },
    {
      id: 6,
      boundary: 'Ocean Acidification',
      currentStatus: 'Approaching boundary',
      threshold: 2.75,
      currentValue: 2.9,
      trendDirection: 'Worsening',
      gaiaImpact: 'Indirect carbon benefits',
    },
  ]);

  await storage.setMiningAlternatives([
    {
      id: 1,
      material: 'Rare Earth Elements',
      alternative: 'Urban mining and recycling',
      performanceRatio: 0.92,
      costRatio: 1.15,
      environmentalBenefit: '85% reduction in extraction impact',
      scalability: 'High with infrastructure investment',
    },
    {
      id: 2,
      material: 'Lithium',
      alternative: 'Geothermal brine extraction',
      performanceRatio: 0.98,
      costRatio: 0.88,
      environmentalBenefit: '70% water use reduction',
      scalability: 'Medium in volcanic regions',
    },
    {
      id: 3,
      material: 'Copper',
      alternative: 'Biosynthesis and recovery',
      performanceRatio: 0.85,
      costRatio: 1.35,
      environmentalBenefit: '90% tailings reduction',
      scalability: 'Developing technology',
    },
    {
      id: 4,
      material: 'Cobalt',
      alternative: 'Iron-based battery alternatives',
      performanceRatio: 0.88,
      costRatio: 0.75,
      environmentalBenefit: 'Eliminates conflict mineral concerns',
      scalability: 'High with R&D investment',
    },
    {
      id: 5,
      material: 'Silicon',
      alternative: 'Agricultural waste silica',
      performanceRatio: 0.95,
      costRatio: 0.65,
      environmentalBenefit: 'Circular economy integration',
      scalability: 'Very high globally',
    },
  ]);

  console.log('✅ Database seeded successfully with comprehensive Gaia Commons data');
}

export async function registerRoutes(_server: Server) {
  const router = Router();

  router.use(limiter);

  router.get('/api/health', async (_req: Request, res: Response) => {
    const startTime = Date.now();

    // Test database connectivity
    const dbConnected = await testConnection();
    const dbResponseTime = Date.now() - startTime;

    // Calculate uptime in seconds
    const uptime = Math.floor((Date.now() - serverStartTime) / 1000);

    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

    // Prepare response
    const healthStatus = {
      status: dbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      database: {
        connected: dbConnected,
        responseTime: `${dbResponseTime}ms`,
      },
      memory: {
        heapUsed: `${heapUsedMB}MB`,
        heapTotal: `${heapTotalMB}MB`,
      },
      version: '5.0.0',
      environment: process.env.NODE_ENV || 'development',
    };

    // Return 503 if database is unreachable
    const statusCode = dbConnected ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  });

  router.get('/api/pilot', async (_req: Request, res: Response) => {
    const stats = await storage.getPilotStats();
    res.json(stats);
  });

  router.get('/api/endowment', async (_req: Request, res: Response) => {
    const stats = await storage.getEndowmentStats();
    res.json(stats);
  });

  router.get('/api/financials', async (_req: Request, res: Response) => {
    const metrics = await storage.getFinancialMetrics();
    res.json(metrics);
  });

  router.get('/api/climate', async (_req: Request, res: Response) => {
    const metrics = await storage.getClimateMetrics();
    res.json(metrics);
  });

  router.get('/api/timeline', async (_req: Request, res: Response) => {
    const events = await storage.getTimelineEvents();
    res.json(events);
  });

  router.get('/api/implementation-timeline', async (_req: Request, res: Response) => {
    const timelines = await storage.getImplementationTimelines();
    res.json(timelines);
  });

  router.get('/api/political-roadmap', async (_req: Request, res: Response) => {
    const roadmaps = await storage.getPoliticalRoadmaps();
    res.json(roadmaps);
  });

  router.get('/api/schools', async (_req: Request, res: Response) => {
    const schools = await storage.getSchools();
    res.json(schools);
  });

  router.get('/api/school-clusters', async (_req: Request, res: Response) => {
    const clusters = await storage.getSchoolClusters();
    res.json(clusters);
  });

  router.get('/api/k12-curriculum', async (_req: Request, res: Response) => {
    const curriculum = await storage.getK12Curriculums();
    res.json(curriculum);
  });

  router.get('/api/slides', async (_req: Request, res: Response) => {
    const slides = await storage.getSlides();
    res.json(slides);
  });

  router.get('/api/scale-projections', async (_req: Request, res: Response) => {
    const projections = await storage.getScaleProjections();
    res.json(projections);
  });

  router.get('/api/historical-financials', async (_req: Request, res: Response) => {
    const financials = await storage.getHistoricalFinancials();
    res.json(financials);
  });

  router.get('/api/endowment-projections', async (_req: Request, res: Response) => {
    const projections = await storage.getEndowmentProjections();
    res.json(projections);
  });

  router.get('/api/funding-sources', async (_req: Request, res: Response) => {
    const sources = await storage.getFundingSources();
    res.json(sources);
  });

  router.get('/api/environmental-impact', async (_req: Request, res: Response) => {
    const impacts = await storage.getEnvironmentalImpacts();
    res.json(impacts);
  });

  router.get('/api/regenerative-agriculture', async (_req: Request, res: Response) => {
    const practices = await storage.getRegenerativeAgriculturePractices();
    res.json(practices);
  });

  router.get('/api/tiered-carbon-pricing', async (_req: Request, res: Response) => {
    const pricing = await storage.getTieredCarbonPricings();
    res.json(pricing);
  });

  router.get('/api/nationwide-food-security', async (_req: Request, res: Response) => {
    const security = await storage.getNationwideFoodSecurity();
    res.json(security);
  });

  router.get('/api/planetary-boundaries', async (_req: Request, res: Response) => {
    const boundaries = await storage.getPlanetaryBoundaries();
    res.json(boundaries);
  });

  router.get('/api/historical-climate-data', async (_req: Request, res: Response) => {
    const data = await storage.getHistoricalClimateData();
    res.json(data);
  });

  router.get('/api/job-creation', async (_req: Request, res: Response) => {
    const jobs = await storage.getJobCreations();
    res.json(jobs);
  });

  router.get('/api/expanded-jobs', async (_req: Request, res: Response) => {
    const jobs = await storage.getExpandedJobs();
    res.json(jobs);
  });

  router.get('/api/labor-transition', async (_req: Request, res: Response) => {
    const transitions = await storage.getLaborTransitions();
    res.json(transitions);
  });

  router.get('/api/legal-framework', async (_req: Request, res: Response) => {
    const framework = await storage.getLegalFramework();
    res.json(framework);
  });

  router.get('/api/coalition-partners', async (_req: Request, res: Response) => {
    const partners = await storage.getCoalitionPartners();
    res.json(partners);
  });

  router.get('/api/tribal-partnerships', async (_req: Request, res: Response) => {
    const partnerships = await storage.getTribalPartnerships();
    res.json(partnerships);
  });

  router.get('/api/transparency-features', async (_req: Request, res: Response) => {
    const features = await storage.getTransparencyFeatures();
    res.json(features);
  });

  router.get('/api/accountability-mechanisms', async (_req: Request, res: Response) => {
    const mechanisms = await storage.getAccountabilityMechanisms();
    res.json(mechanisms);
  });

  router.get('/api/stress-tests', async (_req: Request, res: Response) => {
    const tests = await storage.getStressTests();
    res.json(tests);
  });

  router.get('/api/monte-carlo-simulations', async (_req: Request, res: Response) => {
    const simulations = await storage.getMonteCarloSimulations();
    res.json(simulations);
  });

  router.get('/api/scenario-comparisons', async (_req: Request, res: Response) => {
    const comparisons = await storage.getScenarioComparisons();
    res.json(comparisons);
  });

  router.get('/api/sensitivity-analysis', async (_req: Request, res: Response) => {
    const analyses = await storage.getSensitivityAnalyses();
    res.json(analyses);
  });

  router.get('/api/optimization-params', async (_req: Request, res: Response) => {
    const params = await storage.getOptimizationParams();
    res.json(params);
  });

  router.get('/api/calibration-targets', async (_req: Request, res: Response) => {
    const targets = await storage.getCalibrationTargets();
    res.json(targets);
  });

  router.get('/api/model-maturity', async (_req: Request, res: Response) => {
    const maturity = await storage.getModelMaturities();
    res.json(maturity);
  });

  router.get('/api/global-regeneration-summary', async (_req: Request, res: Response) => {
    const summary = await storage.getGlobalRegenerationSummary();
    res.json(summary);
  });

  router.get('/api/political-coalition', async (_req: Request, res: Response) => {
    const coalition = await storage.getPoliticalCoalitions();
    res.json(coalition);
  });

  router.get('/api/mining-alternatives', async (_req: Request, res: Response) => {
    const alternatives = await storage.getMiningAlternatives();
    res.json(alternatives);
  });

  // ============================================================================
  // MONITORING & HEALTH ENDPOINTS
  // ============================================================================

  // Kubernetes readiness probe
  router.get('/api/ready', async (_req: Request, res: Response) => {
    try {
      const dbConnected = await testConnection(1, 500);
      if (dbConnected) {
        res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
      } else {
        res.status(503).json({ status: 'not ready', reason: 'database unavailable' });
      }
    } catch (err) {
      res
        .status(503)
        .json({ status: 'not ready', error: err instanceof Error ? err.message : 'unknown error' });
    }
  });

  // Kubernetes liveness probe
  router.get('/api/live', (_req: Request, res: Response) => {
    const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
    res.status(200).json({
      status: 'alive',
      uptime: `${uptime}s`,
      timestamp: new Date().toISOString(),
    });
  });

  // Metrics endpoint for monitoring
  router.get('/api/metrics', async (_req: Request, res: Response) => {
    const { checkHealth } = await import('./db');
    const health = await checkHealth();
    const uptime = Math.floor((Date.now() - serverStartTime) / 1000);

    res.json({
      uptime: uptime,
      database: {
        healthy: health.healthy,
        latency: health.latency,
        pool: health.metrics,
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      timestamp: new Date().toISOString(),
    });
  });

  await seedDatabase();

  return router;
}

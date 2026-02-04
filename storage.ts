// Core Stats Interfaces (Singleton)

export interface PilotStats {
  totalSchools: number;
  totalStudents: number;
  greenhouseArea: number;
  launchDate: string;
  regionalHubs: number;
  avgGreenhouseSize: number;
}

export interface EndowmentStats {
  principal: number;
  annualDistribution: number;
  greenhousesFunded: number;
  growthRate: string;
  targetYear: number;
}

export interface FinancialMetrics {
  totalInvestment: number;
  operatingCosts: number;
  revenueStreams: number;
  roi: number;
  breakEvenYear: number;
  netPresentValue: number;
}

export interface ClimateMetrics {
  carbonSequestered: number;
  waterSaved: number;
  solarGenerated: number;
  biodiversityCount: number;
  soilHealthScore: number;
  wasteReduction: number;
}

export interface LegalFramework {
  structure: string;
  governanceModel: string;
  landOwnership: string;
  taxStatus: string;
  complianceFramework: string;
  stakeholderRights: string;
}

export interface NationwideFoodSecurity {
  mealsServed: number;
  nutritionScore: number;
  localFoodPercent: number;
  foodDesertsCovered: number;
  emergencyReserve: number;
  distributionNetwork: string;
}

export interface GlobalRegenerationSummary {
  totalCountries: number;
  globalSchools: number;
  totalCarbonOffset: number;
  waterConserved: number;
  biodiversityProtected: number;
  employmentCreated: number;
}

// List Item Interfaces

export interface TimelineEvent {
  id: number;
  year: number;
  quarter: string;
  milestone: string;
  description: string;
  status: string;
  impact: string;
}

export interface Slide {
  id: number;
  slideNumber: number;
  title: string;
  subtitle: string;
  content: string;
  visualType: string;
  keyMetrics: string[];
}

export interface HistoricalFinancial {
  id: number;
  year: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  equity: number;
}

export interface SchoolCluster {
  id: number;
  name: string;
  region: string;
  schools: number;
  students: number;
  coordinator: string;
  launchDate: string;
}

export interface School {
  id: number;
  name: string;
  district: string;
  state: string;
  students: number;
  greenhouseSize: number;
  clusterId: number;
  status: string;
}

export interface ScaleProjection {
  id: number;
  year: number;
  schools: number;
  students: number;
  investment: number;
  greenhouses: number;
  employmentCreated: number;
  carbonOffset: number;
}

export interface EnvironmentalImpact {
  id: number;
  category: string;
  metric: string;
  currentValue: number;
  projectedValue: number;
  unit: string;
  methodology: string;
}

export interface JobCreation {
  id: number;
  category: string;
  jobType: string;
  positions: number;
  avgSalary: number;
  skillsRequired: string[];
  growthRate: number;
}

export interface EndowmentProjection {
  id: number;
  year: number;
  principal: number;
  returns: number;
  distributions: number;
  growthRate: number;
  assumptions: string;
}

export interface ExpandedJob {
  id: number;
  sector: string;
  jobType: string;
  indirectPositions: number;
  multiplierEffect: number;
  region: string;
  description: string;
}

export interface K12Curriculum {
  id: number;
  gradeLevel: string;
  moduleName: string;
  subject: string;
  hoursRequired: number;
  learningObjectives: string[];
  assessmentType: string;
}

export interface CoalitionPartner {
  id: number;
  organization: string;
  partnerType: string;
  contribution: string;
  commitment: string;
  contactPerson: string;
  activeDate: string;
}

export interface FundingSource {
  id: number;
  sourceName: string;
  fundingType: string;
  amount: number;
  status: string;
  terms: string;
  timeline: string;
}

export interface TransparencyFeature {
  id: number;
  featureName: string;
  description: string;
  implementation: string;
  accessLevel: string;
  updateFrequency: string;
}

export interface AccountabilityMechanism {
  id: number;
  mechanism: string;
  description: string;
  frequency: string;
  stakeholders: string[];
  enforcementMethod: string;
}

export interface TribalPartnership {
  id: number;
  tribeName: string;
  location: string;
  partnershipType: string;
  focus: string;
  benefitsShared: string;
  culturalIntegration: string;
}

export interface ImplementationTimeline {
  id: number;
  phase: string;
  startDate: string;
  endDate: string;
  deliverables: string[];
  milestones: string[];
  dependencies: string;
}

export interface PoliticalRoadmap {
  id: number;
  milestone: string;
  targetDate: string;
  strategy: string;
  stakeholders: string[];
  successMetrics: string;
  riskLevel: string;
}

export interface StressTest {
  id: number;
  scenarioName: string;
  stressType: string;
  severity: string;
  impactDescription: string;
  mitigationStrategy: string;
  recoveryTime: string;
}

export interface TieredCarbonPricing {
  id: number;
  tier: string;
  pricePerTon: number;
  volumeThreshold: number;
  applicability: string;
  incentives: string;
  adjustmentSchedule: string;
}

export interface RegenerativeAgriculture {
  id: number;
  practice: string;
  description: string;
  carbonSequestration: number;
  soilHealthImprovement: number;
  waterConservation: number;
  implementationCost: number;
}

export interface LaborTransition {
  id: number;
  sector: string;
  currentJobs: number;
  projectedJobs: number;
  retrainingRequired: string;
  timelineMonths: number;
  supportPrograms: string[];
}

export interface PoliticalCoalition {
  id: number;
  group: string;
  alignment: string;
  size: number;
  keyIssues: string[];
  engagementStrategy: string;
  influence: string;
}

export interface PlanetaryBoundary {
  id: number;
  boundary: string;
  currentStatus: string;
  threshold: number;
  currentValue: number;
  trendDirection: string;
  gaiaImpact: string;
}

export interface CalibrationTarget {
  id: number;
  targetName: string;
  targetValue: number;
  currentValue: number;
  calibrationMethod: string;
  accuracy: number;
  validationSource: string;
}

export interface ModelMaturity {
  id: number;
  component: string;
  maturityLevel: string;
  dataQuality: number;
  validationStatus: string;
  uncertaintyRange: string;
  improvementNeeded: string;
}

export interface HistoricalClimateData {
  id: number;
  year: number;
  avgTemperature: number;
  precipitation: number;
  extremeEvents: number;
  co2Levels: number;
  seaLevelChange: number;
}

export interface MonteCarloSimulation {
  id: number;
  simulationName: string;
  iterations: number;
  meanOutcome: number;
  standardDeviation: number;
  confidenceInterval: string;
  assumptions: string;
}

export interface ScenarioComparison {
  id: number;
  scenarioName: string;
  policyApproach: string;
  climateOutcome: number;
  economicCost: number;
  socialBenefit: number;
  feasibility: string;
}

export interface OptimizationParam {
  id: number;
  parameterName: string;
  currentValue: number;
  optimalRange: string;
  sensitivity: number;
  adjustmentImpact: string;
  constraints: string;
}

export interface SensitivityAnalysis {
  id: number;
  variable: string;
  baselineValue: number;
  sensitivityCoefficient: number;
  impactOnOutcome: string;
  criticalThreshold: number;
  confidenceLevel: number;
}

export interface MiningAlternative {
  id: number;
  material: string;
  alternative: string;
  performanceRatio: number;
  costRatio: number;
  environmentalBenefit: string;
  scalability: string;
}

// Storage Interface

export interface IStorage {
  // Core Stats (Singleton)
  getPilotStats(): Promise<PilotStats | null>;
  setPilotStats(stats: PilotStats): Promise<void>;
  
  getEndowmentStats(): Promise<EndowmentStats | null>;
  setEndowmentStats(stats: EndowmentStats): Promise<void>;
  
  getFinancialMetrics(): Promise<FinancialMetrics | null>;
  setFinancialMetrics(metrics: FinancialMetrics): Promise<void>;
  
  getClimateMetrics(): Promise<ClimateMetrics | null>;
  setClimateMetrics(metrics: ClimateMetrics): Promise<void>;
  
  getLegalFramework(): Promise<LegalFramework | null>;
  setLegalFramework(framework: LegalFramework): Promise<void>;
  
  getNationwideFoodSecurity(): Promise<NationwideFoodSecurity | null>;
  setNationwideFoodSecurity(security: NationwideFoodSecurity): Promise<void>;
  
  getGlobalRegenerationSummary(): Promise<GlobalRegenerationSummary | null>;
  setGlobalRegenerationSummary(summary: GlobalRegenerationSummary): Promise<void>;
  
  // Lists
  getTimelineEvents(): Promise<TimelineEvent[]>;
  setTimelineEvents(events: TimelineEvent[]): Promise<void>;
  
  getSlides(): Promise<Slide[]>;
  setSlides(slides: Slide[]): Promise<void>;
  
  getHistoricalFinancials(): Promise<HistoricalFinancial[]>;
  setHistoricalFinancials(financials: HistoricalFinancial[]): Promise<void>;
  
  getSchoolClusters(): Promise<SchoolCluster[]>;
  setSchoolClusters(clusters: SchoolCluster[]): Promise<void>;
  
  getSchools(): Promise<School[]>;
  setSchools(schools: School[]): Promise<void>;
  
  getScaleProjections(): Promise<ScaleProjection[]>;
  setScaleProjections(projections: ScaleProjection[]): Promise<void>;
  
  getEnvironmentalImpacts(): Promise<EnvironmentalImpact[]>;
  setEnvironmentalImpacts(impacts: EnvironmentalImpact[]): Promise<void>;
  
  getJobCreations(): Promise<JobCreation[]>;
  setJobCreations(jobs: JobCreation[]): Promise<void>;
  
  getEndowmentProjections(): Promise<EndowmentProjection[]>;
  setEndowmentProjections(projections: EndowmentProjection[]): Promise<void>;
  
  getExpandedJobs(): Promise<ExpandedJob[]>;
  setExpandedJobs(jobs: ExpandedJob[]): Promise<void>;
  
  getK12Curriculums(): Promise<K12Curriculum[]>;
  setK12Curriculums(curriculums: K12Curriculum[]): Promise<void>;
  
  getCoalitionPartners(): Promise<CoalitionPartner[]>;
  setCoalitionPartners(partners: CoalitionPartner[]): Promise<void>;
  
  getFundingSources(): Promise<FundingSource[]>;
  setFundingSources(sources: FundingSource[]): Promise<void>;
  
  getTransparencyFeatures(): Promise<TransparencyFeature[]>;
  setTransparencyFeatures(features: TransparencyFeature[]): Promise<void>;
  
  getAccountabilityMechanisms(): Promise<AccountabilityMechanism[]>;
  setAccountabilityMechanisms(mechanisms: AccountabilityMechanism[]): Promise<void>;
  
  getTribalPartnerships(): Promise<TribalPartnership[]>;
  setTribalPartnerships(partnerships: TribalPartnership[]): Promise<void>;
  
  getImplementationTimelines(): Promise<ImplementationTimeline[]>;
  setImplementationTimelines(timelines: ImplementationTimeline[]): Promise<void>;
  
  getPoliticalRoadmaps(): Promise<PoliticalRoadmap[]>;
  setPoliticalRoadmaps(roadmaps: PoliticalRoadmap[]): Promise<void>;
  
  getStressTests(): Promise<StressTest[]>;
  setStressTests(tests: StressTest[]): Promise<void>;
  
  getTieredCarbonPricings(): Promise<TieredCarbonPricing[]>;
  setTieredCarbonPricings(pricings: TieredCarbonPricing[]): Promise<void>;
  
  getRegenerativeAgriculturePractices(): Promise<RegenerativeAgriculture[]>;
  setRegenerativeAgriculturePractices(practices: RegenerativeAgriculture[]): Promise<void>;
  
  getLaborTransitions(): Promise<LaborTransition[]>;
  setLaborTransitions(transitions: LaborTransition[]): Promise<void>;
  
  getPoliticalCoalitions(): Promise<PoliticalCoalition[]>;
  setPoliticalCoalitions(coalitions: PoliticalCoalition[]): Promise<void>;
  
  getPlanetaryBoundaries(): Promise<PlanetaryBoundary[]>;
  setPlanetaryBoundaries(boundaries: PlanetaryBoundary[]): Promise<void>;
  
  getCalibrationTargets(): Promise<CalibrationTarget[]>;
  setCalibrationTargets(targets: CalibrationTarget[]): Promise<void>;
  
  getModelMaturities(): Promise<ModelMaturity[]>;
  setModelMaturities(maturities: ModelMaturity[]): Promise<void>;
  
  getHistoricalClimateData(): Promise<HistoricalClimateData[]>;
  setHistoricalClimateData(data: HistoricalClimateData[]): Promise<void>;
  
  getMonteCarloSimulations(): Promise<MonteCarloSimulation[]>;
  setMonteCarloSimulations(simulations: MonteCarloSimulation[]): Promise<void>;
  
  getScenarioComparisons(): Promise<ScenarioComparison[]>;
  setScenarioComparisons(comparisons: ScenarioComparison[]): Promise<void>;
  
  getOptimizationParams(): Promise<OptimizationParam[]>;
  setOptimizationParams(params: OptimizationParam[]): Promise<void>;
  
  getSensitivityAnalyses(): Promise<SensitivityAnalysis[]>;
  setSensitivityAnalyses(analyses: SensitivityAnalysis[]): Promise<void>;
  
  getMiningAlternatives(): Promise<MiningAlternative[]>;
  setMiningAlternatives(alternatives: MiningAlternative[]): Promise<void>;
}

// In-Memory Storage Implementation

export class MemStorage implements IStorage {
  // Core Stats (Singleton)
  private pilotStats: PilotStats | null = null;
  private endowmentStats: EndowmentStats | null = null;
  private financialMetrics: FinancialMetrics | null = null;
  private climateMetrics: ClimateMetrics | null = null;
  private legalFramework: LegalFramework | null = null;
  private nationwideFoodSecurity: NationwideFoodSecurity | null = null;
  private globalRegenerationSummary: GlobalRegenerationSummary | null = null;
  
  // Lists
  private timelineEvents: TimelineEvent[] = [];
  private slides: Slide[] = [];
  private historicalFinancials: HistoricalFinancial[] = [];
  private schoolClusters: SchoolCluster[] = [];
  private schools: School[] = [];
  private scaleProjections: ScaleProjection[] = [];
  private environmentalImpacts: EnvironmentalImpact[] = [];
  private jobCreations: JobCreation[] = [];
  private endowmentProjections: EndowmentProjection[] = [];
  private expandedJobs: ExpandedJob[] = [];
  private k12Curriculums: K12Curriculum[] = [];
  private coalitionPartners: CoalitionPartner[] = [];
  private fundingSources: FundingSource[] = [];
  private transparencyFeatures: TransparencyFeature[] = [];
  private accountabilityMechanisms: AccountabilityMechanism[] = [];
  private tribalPartnerships: TribalPartnership[] = [];
  private implementationTimelines: ImplementationTimeline[] = [];
  private politicalRoadmaps: PoliticalRoadmap[] = [];
  private stressTests: StressTest[] = [];
  private tieredCarbonPricings: TieredCarbonPricing[] = [];
  private regenerativeAgriculturePractices: RegenerativeAgriculture[] = [];
  private laborTransitions: LaborTransition[] = [];
  private politicalCoalitions: PoliticalCoalition[] = [];
  private planetaryBoundaries: PlanetaryBoundary[] = [];
  private calibrationTargets: CalibrationTarget[] = [];
  private modelMaturities: ModelMaturity[] = [];
  private historicalClimateData: HistoricalClimateData[] = [];
  private monteCarloSimulations: MonteCarloSimulation[] = [];
  private scenarioComparisons: ScenarioComparison[] = [];
  private optimizationParams: OptimizationParam[] = [];
  private sensitivityAnalyses: SensitivityAnalysis[] = [];
  private miningAlternatives: MiningAlternative[] = [];
  
  // Core Stats Methods
  async getPilotStats(): Promise<PilotStats | null> {
    return this.pilotStats;
  }
  
  async setPilotStats(stats: PilotStats): Promise<void> {
    this.pilotStats = stats;
  }
  
  async getEndowmentStats(): Promise<EndowmentStats | null> {
    return this.endowmentStats;
  }
  
  async setEndowmentStats(stats: EndowmentStats): Promise<void> {
    this.endowmentStats = stats;
  }
  
  async getFinancialMetrics(): Promise<FinancialMetrics | null> {
    return this.financialMetrics;
  }
  
  async setFinancialMetrics(metrics: FinancialMetrics): Promise<void> {
    this.financialMetrics = metrics;
  }
  
  async getClimateMetrics(): Promise<ClimateMetrics | null> {
    return this.climateMetrics;
  }
  
  async setClimateMetrics(metrics: ClimateMetrics): Promise<void> {
    this.climateMetrics = metrics;
  }
  
  async getLegalFramework(): Promise<LegalFramework | null> {
    return this.legalFramework;
  }
  
  async setLegalFramework(framework: LegalFramework): Promise<void> {
    this.legalFramework = framework;
  }
  
  async getNationwideFoodSecurity(): Promise<NationwideFoodSecurity | null> {
    return this.nationwideFoodSecurity;
  }
  
  async setNationwideFoodSecurity(security: NationwideFoodSecurity): Promise<void> {
    this.nationwideFoodSecurity = security;
  }
  
  async getGlobalRegenerationSummary(): Promise<GlobalRegenerationSummary | null> {
    return this.globalRegenerationSummary;
  }
  
  async setGlobalRegenerationSummary(summary: GlobalRegenerationSummary): Promise<void> {
    this.globalRegenerationSummary = summary;
  }
  
  // List Methods
  async getTimelineEvents(): Promise<TimelineEvent[]> {
    return this.timelineEvents;
  }
  
  async setTimelineEvents(events: TimelineEvent[]): Promise<void> {
    this.timelineEvents = events;
  }
  
  async getSlides(): Promise<Slide[]> {
    return this.slides;
  }
  
  async setSlides(slides: Slide[]): Promise<void> {
    this.slides = slides;
  }
  
  async getHistoricalFinancials(): Promise<HistoricalFinancial[]> {
    return this.historicalFinancials;
  }
  
  async setHistoricalFinancials(financials: HistoricalFinancial[]): Promise<void> {
    this.historicalFinancials = financials;
  }
  
  async getSchoolClusters(): Promise<SchoolCluster[]> {
    return this.schoolClusters;
  }
  
  async setSchoolClusters(clusters: SchoolCluster[]): Promise<void> {
    this.schoolClusters = clusters;
  }
  
  async getSchools(): Promise<School[]> {
    return this.schools;
  }
  
  async setSchools(schools: School[]): Promise<void> {
    this.schools = schools;
  }
  
  async getScaleProjections(): Promise<ScaleProjection[]> {
    return this.scaleProjections;
  }
  
  async setScaleProjections(projections: ScaleProjection[]): Promise<void> {
    this.scaleProjections = projections;
  }
  
  async getEnvironmentalImpacts(): Promise<EnvironmentalImpact[]> {
    return this.environmentalImpacts;
  }
  
  async setEnvironmentalImpacts(impacts: EnvironmentalImpact[]): Promise<void> {
    this.environmentalImpacts = impacts;
  }
  
  async getJobCreations(): Promise<JobCreation[]> {
    return this.jobCreations;
  }
  
  async setJobCreations(jobs: JobCreation[]): Promise<void> {
    this.jobCreations = jobs;
  }
  
  async getEndowmentProjections(): Promise<EndowmentProjection[]> {
    return this.endowmentProjections;
  }
  
  async setEndowmentProjections(projections: EndowmentProjection[]): Promise<void> {
    this.endowmentProjections = projections;
  }
  
  async getExpandedJobs(): Promise<ExpandedJob[]> {
    return this.expandedJobs;
  }
  
  async setExpandedJobs(jobs: ExpandedJob[]): Promise<void> {
    this.expandedJobs = jobs;
  }
  
  async getK12Curriculums(): Promise<K12Curriculum[]> {
    return this.k12Curriculums;
  }
  
  async setK12Curriculums(curriculums: K12Curriculum[]): Promise<void> {
    this.k12Curriculums = curriculums;
  }
  
  async getCoalitionPartners(): Promise<CoalitionPartner[]> {
    return this.coalitionPartners;
  }
  
  async setCoalitionPartners(partners: CoalitionPartner[]): Promise<void> {
    this.coalitionPartners = partners;
  }
  
  async getFundingSources(): Promise<FundingSource[]> {
    return this.fundingSources;
  }
  
  async setFundingSources(sources: FundingSource[]): Promise<void> {
    this.fundingSources = sources;
  }
  
  async getTransparencyFeatures(): Promise<TransparencyFeature[]> {
    return this.transparencyFeatures;
  }
  
  async setTransparencyFeatures(features: TransparencyFeature[]): Promise<void> {
    this.transparencyFeatures = features;
  }
  
  async getAccountabilityMechanisms(): Promise<AccountabilityMechanism[]> {
    return this.accountabilityMechanisms;
  }
  
  async setAccountabilityMechanisms(mechanisms: AccountabilityMechanism[]): Promise<void> {
    this.accountabilityMechanisms = mechanisms;
  }
  
  async getTribalPartnerships(): Promise<TribalPartnership[]> {
    return this.tribalPartnerships;
  }
  
  async setTribalPartnerships(partnerships: TribalPartnership[]): Promise<void> {
    this.tribalPartnerships = partnerships;
  }
  
  async getImplementationTimelines(): Promise<ImplementationTimeline[]> {
    return this.implementationTimelines;
  }
  
  async setImplementationTimelines(timelines: ImplementationTimeline[]): Promise<void> {
    this.implementationTimelines = timelines;
  }
  
  async getPoliticalRoadmaps(): Promise<PoliticalRoadmap[]> {
    return this.politicalRoadmaps;
  }
  
  async setPoliticalRoadmaps(roadmaps: PoliticalRoadmap[]): Promise<void> {
    this.politicalRoadmaps = roadmaps;
  }
  
  async getStressTests(): Promise<StressTest[]> {
    return this.stressTests;
  }
  
  async setStressTests(tests: StressTest[]): Promise<void> {
    this.stressTests = tests;
  }
  
  async getTieredCarbonPricings(): Promise<TieredCarbonPricing[]> {
    return this.tieredCarbonPricings;
  }
  
  async setTieredCarbonPricings(pricings: TieredCarbonPricing[]): Promise<void> {
    this.tieredCarbonPricings = pricings;
  }
  
  async getRegenerativeAgriculturePractices(): Promise<RegenerativeAgriculture[]> {
    return this.regenerativeAgriculturePractices;
  }
  
  async setRegenerativeAgriculturePractices(practices: RegenerativeAgriculture[]): Promise<void> {
    this.regenerativeAgriculturePractices = practices;
  }
  
  async getLaborTransitions(): Promise<LaborTransition[]> {
    return this.laborTransitions;
  }
  
  async setLaborTransitions(transitions: LaborTransition[]): Promise<void> {
    this.laborTransitions = transitions;
  }
  
  async getPoliticalCoalitions(): Promise<PoliticalCoalition[]> {
    return this.politicalCoalitions;
  }
  
  async setPoliticalCoalitions(coalitions: PoliticalCoalition[]): Promise<void> {
    this.politicalCoalitions = coalitions;
  }
  
  async getPlanetaryBoundaries(): Promise<PlanetaryBoundary[]> {
    return this.planetaryBoundaries;
  }
  
  async setPlanetaryBoundaries(boundaries: PlanetaryBoundary[]): Promise<void> {
    this.planetaryBoundaries = boundaries;
  }
  
  async getCalibrationTargets(): Promise<CalibrationTarget[]> {
    return this.calibrationTargets;
  }
  
  async setCalibrationTargets(targets: CalibrationTarget[]): Promise<void> {
    this.calibrationTargets = targets;
  }
  
  async getModelMaturities(): Promise<ModelMaturity[]> {
    return this.modelMaturities;
  }
  
  async setModelMaturities(maturities: ModelMaturity[]): Promise<void> {
    this.modelMaturities = maturities;
  }
  
  async getHistoricalClimateData(): Promise<HistoricalClimateData[]> {
    return this.historicalClimateData;
  }
  
  async setHistoricalClimateData(data: HistoricalClimateData[]): Promise<void> {
    this.historicalClimateData = data;
  }
  
  async getMonteCarloSimulations(): Promise<MonteCarloSimulation[]> {
    return this.monteCarloSimulations;
  }
  
  async setMonteCarloSimulations(simulations: MonteCarloSimulation[]): Promise<void> {
    this.monteCarloSimulations = simulations;
  }
  
  async getScenarioComparisons(): Promise<ScenarioComparison[]> {
    return this.scenarioComparisons;
  }
  
  async setScenarioComparisons(comparisons: ScenarioComparison[]): Promise<void> {
    this.scenarioComparisons = comparisons;
  }
  
  async getOptimizationParams(): Promise<OptimizationParam[]> {
    return this.optimizationParams;
  }
  
  async setOptimizationParams(params: OptimizationParam[]): Promise<void> {
    this.optimizationParams = params;
  }
  
  async getSensitivityAnalyses(): Promise<SensitivityAnalysis[]> {
    return this.sensitivityAnalyses;
  }
  
  async setSensitivityAnalyses(analyses: SensitivityAnalysis[]): Promise<void> {
    this.sensitivityAnalyses = analyses;
  }
  
  async getMiningAlternatives(): Promise<MiningAlternative[]> {
    return this.miningAlternatives;
  }
  
  async setMiningAlternatives(alternatives: MiningAlternative[]): Promise<void> {
    this.miningAlternatives = alternatives;
  }
}

// Export singleton instance
export const storage = new MemStorage();

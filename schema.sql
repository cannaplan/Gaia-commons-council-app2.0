-- Gaia Commons API - PostgreSQL Schema
-- 39 Tables organized by category

-- Clean slate for reinstallation
DROP TABLE IF EXISTS mining_alternatives CASCADE;
DROP TABLE IF EXISTS sensitivity_analysis CASCADE;
DROP TABLE IF EXISTS optimization_params CASCADE;
DROP TABLE IF EXISTS scenario_comparisons CASCADE;
DROP TABLE IF EXISTS monte_carlo_simulations CASCADE;
DROP TABLE IF EXISTS historical_climate_data CASCADE;
DROP TABLE IF EXISTS model_maturity CASCADE;
DROP TABLE IF EXISTS calibration_targets CASCADE;
DROP TABLE IF EXISTS planetary_boundaries CASCADE;
DROP TABLE IF EXISTS political_coalition CASCADE;
DROP TABLE IF EXISTS labor_transition CASCADE;
DROP TABLE IF EXISTS regenerative_agriculture CASCADE;
DROP TABLE IF EXISTS tiered_carbon_pricing CASCADE;
DROP TABLE IF EXISTS stress_tests CASCADE;
DROP TABLE IF EXISTS political_roadmap CASCADE;
DROP TABLE IF EXISTS implementation_timeline CASCADE;
DROP TABLE IF EXISTS tribal_partnerships CASCADE;
DROP TABLE IF EXISTS accountability_mechanisms CASCADE;
DROP TABLE IF EXISTS transparency_features CASCADE;
DROP TABLE IF EXISTS funding_sources CASCADE;
DROP TABLE IF EXISTS coalition_partners CASCADE;
DROP TABLE IF EXISTS k12_curriculum CASCADE;
DROP TABLE IF EXISTS expanded_jobs CASCADE;
DROP TABLE IF EXISTS endowment_projections CASCADE;
DROP TABLE IF EXISTS job_creation CASCADE;
DROP TABLE IF EXISTS environmental_impact CASCADE;
DROP TABLE IF EXISTS scale_projections CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS school_clusters CASCADE;
DROP TABLE IF EXISTS historical_financials CASCADE;
DROP TABLE IF EXISTS slides CASCADE;
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS global_regeneration_summary CASCADE;
DROP TABLE IF EXISTS nationwide_food_security CASCADE;
DROP TABLE IF EXISTS legal_framework CASCADE;
DROP TABLE IF EXISTS climate_metrics CASCADE;
DROP TABLE IF EXISTS financial_metrics CASCADE;
DROP TABLE IF EXISTS endowment_stats CASCADE;
DROP TABLE IF EXISTS pilot_stats CASCADE;

-- ============================================================
-- CORE STATS (4 singleton tables)
-- ============================================================

CREATE TABLE pilot_stats (
    total_schools INTEGER NOT NULL,
    total_students INTEGER NOT NULL,
    greenhouse_area DECIMAL(15,2) NOT NULL,
    launch_date VARCHAR(255) NOT NULL,
    regional_hubs INTEGER NOT NULL,
    avg_greenhouse_size DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE endowment_stats (
    principal DECIMAL(20,2) NOT NULL,
    annual_distribution DECIMAL(20,2) NOT NULL,
    greenhouses_funded INTEGER NOT NULL,
    growth_rate VARCHAR(50) NOT NULL,
    target_year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE financial_metrics (
    total_investment DECIMAL(20,2) NOT NULL,
    operating_costs DECIMAL(20,2) NOT NULL,
    revenue_streams DECIMAL(20,2) NOT NULL,
    roi DECIMAL(10,4) NOT NULL,
    break_even_year INTEGER NOT NULL,
    net_present_value DECIMAL(20,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE climate_metrics (
    carbon_sequestered DECIMAL(15,2) NOT NULL,
    water_saved DECIMAL(15,2) NOT NULL,
    solar_generated DECIMAL(15,2) NOT NULL,
    biodiversity_count INTEGER NOT NULL,
    soil_health_score DECIMAL(10,4) NOT NULL,
    waste_reduction DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIMELINE & PLANNING (3 tables)
-- ============================================================

CREATE TABLE timeline_events (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    quarter VARCHAR(10) NOT NULL,
    milestone VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    impact VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE implementation_timeline (
    id SERIAL PRIMARY KEY,
    phase VARCHAR(255) NOT NULL,
    start_date VARCHAR(50) NOT NULL,
    end_date VARCHAR(50) NOT NULL,
    deliverables JSONB NOT NULL,
    milestones JSONB NOT NULL,
    dependencies TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE political_roadmap (
    id SERIAL PRIMARY KEY,
    milestone VARCHAR(255) NOT NULL,
    target_date VARCHAR(50) NOT NULL,
    strategy TEXT NOT NULL,
    stakeholders JSONB NOT NULL,
    success_metrics TEXT NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- EDUCATION (4 tables)
-- ============================================================

CREATE TABLE school_clusters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    schools INTEGER NOT NULL,
    students INTEGER NOT NULL,
    coordinator VARCHAR(255) NOT NULL,
    launch_date VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    students INTEGER NOT NULL,
    greenhouse_size DECIMAL(15,2) NOT NULL,
    cluster_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE k12_curriculum (
    id SERIAL PRIMARY KEY,
    grade_level VARCHAR(50) NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    hours_required DECIMAL(10,2) NOT NULL,
    learning_objectives JSONB NOT NULL,
    assessment_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE slides (
    id SERIAL PRIMARY KEY,
    slide_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NOT NULL,
    content TEXT NOT NULL,
    visual_type VARCHAR(100) NOT NULL,
    key_metrics JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ECONOMICS (4 tables)
-- ============================================================

CREATE TABLE scale_projections (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    schools INTEGER NOT NULL,
    students INTEGER NOT NULL,
    investment DECIMAL(20,2) NOT NULL,
    greenhouses INTEGER NOT NULL,
    employment_created INTEGER NOT NULL,
    carbon_offset DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historical_financials (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    revenue DECIMAL(20,2) NOT NULL,
    expenses DECIMAL(20,2) NOT NULL,
    net_income DECIMAL(20,2) NOT NULL,
    assets DECIMAL(20,2) NOT NULL,
    liabilities DECIMAL(20,2) NOT NULL,
    equity DECIMAL(20,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE endowment_projections (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    principal DECIMAL(20,2) NOT NULL,
    returns DECIMAL(20,2) NOT NULL,
    distributions DECIMAL(20,2) NOT NULL,
    growth_rate DECIMAL(10,4) NOT NULL,
    assumptions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE funding_sources (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL,
    funding_type VARCHAR(100) NOT NULL,
    amount DECIMAL(20,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    terms TEXT NOT NULL,
    timeline VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ENVIRONMENT (6 tables)
-- ============================================================

CREATE TABLE environmental_impact (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    metric VARCHAR(255) NOT NULL,
    current_value DECIMAL(15,4) NOT NULL,
    projected_value DECIMAL(15,4) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    methodology TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE regenerative_agriculture (
    id SERIAL PRIMARY KEY,
    practice VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    carbon_sequestration DECIMAL(15,4) NOT NULL,
    soil_health_improvement DECIMAL(10,4) NOT NULL,
    water_conservation DECIMAL(15,4) NOT NULL,
    implementation_cost DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tiered_carbon_pricing (
    id SERIAL PRIMARY KEY,
    tier VARCHAR(100) NOT NULL,
    price_per_ton DECIMAL(15,2) NOT NULL,
    volume_threshold DECIMAL(15,2) NOT NULL,
    applicability TEXT NOT NULL,
    incentives TEXT NOT NULL,
    adjustment_schedule VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nationwide_food_security (
    meals_served DECIMAL(15,0) NOT NULL,
    nutrition_score DECIMAL(10,4) NOT NULL,
    local_food_percent DECIMAL(10,4) NOT NULL,
    food_deserts_covered INTEGER NOT NULL,
    emergency_reserve DECIMAL(15,2) NOT NULL,
    distribution_network TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE planetary_boundaries (
    id SERIAL PRIMARY KEY,
    boundary VARCHAR(255) NOT NULL,
    current_status VARCHAR(100) NOT NULL,
    threshold DECIMAL(15,4) NOT NULL,
    current_value DECIMAL(15,4) NOT NULL,
    trend_direction VARCHAR(50) NOT NULL,
    gaia_impact TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historical_climate_data (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    avg_temperature DECIMAL(10,4) NOT NULL,
    precipitation DECIMAL(15,4) NOT NULL,
    extreme_events INTEGER NOT NULL,
    co2_levels DECIMAL(10,4) NOT NULL,
    sea_level_change DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- EMPLOYMENT (3 tables)
-- ============================================================

CREATE TABLE job_creation (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    job_type VARCHAR(255) NOT NULL,
    positions INTEGER NOT NULL,
    avg_salary DECIMAL(15,2) NOT NULL,
    skills_required JSONB NOT NULL,
    growth_rate DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expanded_jobs (
    id SERIAL PRIMARY KEY,
    sector VARCHAR(100) NOT NULL,
    job_type VARCHAR(255) NOT NULL,
    indirect_positions INTEGER NOT NULL,
    multiplier_effect DECIMAL(10,4) NOT NULL,
    region VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE labor_transition (
    id SERIAL PRIMARY KEY,
    sector VARCHAR(100) NOT NULL,
    current_jobs INTEGER NOT NULL,
    projected_jobs INTEGER NOT NULL,
    retraining_required TEXT NOT NULL,
    timeline_months INTEGER NOT NULL,
    support_programs JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- GOVERNANCE (5 tables)
-- ============================================================

CREATE TABLE legal_framework (
    structure VARCHAR(255) NOT NULL,
    governance_model VARCHAR(255) NOT NULL,
    land_ownership TEXT NOT NULL,
    tax_status VARCHAR(100) NOT NULL,
    compliance_framework TEXT NOT NULL,
    stakeholder_rights TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coalition_partners (
    id SERIAL PRIMARY KEY,
    organization VARCHAR(255) NOT NULL,
    partner_type VARCHAR(100) NOT NULL,
    contribution TEXT NOT NULL,
    commitment TEXT NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    active_date VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tribal_partnerships (
    id SERIAL PRIMARY KEY,
    tribe_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    partnership_type VARCHAR(100) NOT NULL,
    focus TEXT NOT NULL,
    benefits_shared TEXT NOT NULL,
    cultural_integration TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transparency_features (
    id SERIAL PRIMARY KEY,
    feature_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    implementation TEXT NOT NULL,
    access_level VARCHAR(100) NOT NULL,
    update_frequency VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accountability_mechanisms (
    id SERIAL PRIMARY KEY,
    mechanism VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    stakeholders JSONB NOT NULL,
    enforcement_method TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ANALYSIS (8 tables)
-- ============================================================

CREATE TABLE stress_tests (
    id SERIAL PRIMARY KEY,
    scenario_name VARCHAR(255) NOT NULL,
    stress_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    impact_description TEXT NOT NULL,
    mitigation_strategy TEXT NOT NULL,
    recovery_time VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monte_carlo_simulations (
    id SERIAL PRIMARY KEY,
    simulation_name VARCHAR(255) NOT NULL,
    iterations INTEGER NOT NULL,
    mean_outcome DECIMAL(15,4) NOT NULL,
    standard_deviation DECIMAL(15,4) NOT NULL,
    confidence_interval VARCHAR(100) NOT NULL,
    assumptions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scenario_comparisons (
    id SERIAL PRIMARY KEY,
    scenario_name VARCHAR(255) NOT NULL,
    policy_approach TEXT NOT NULL,
    climate_outcome DECIMAL(15,4) NOT NULL,
    economic_cost DECIMAL(20,2) NOT NULL,
    social_benefit DECIMAL(15,4) NOT NULL,
    feasibility VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sensitivity_analysis (
    id SERIAL PRIMARY KEY,
    variable VARCHAR(255) NOT NULL,
    baseline_value DECIMAL(15,4) NOT NULL,
    sensitivity_coefficient DECIMAL(15,6) NOT NULL,
    impact_on_outcome TEXT NOT NULL,
    critical_threshold DECIMAL(15,4) NOT NULL,
    confidence_level DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE optimization_params (
    id SERIAL PRIMARY KEY,
    parameter_name VARCHAR(255) NOT NULL,
    current_value DECIMAL(15,4) NOT NULL,
    optimal_range VARCHAR(100) NOT NULL,
    sensitivity DECIMAL(10,4) NOT NULL,
    adjustment_impact TEXT NOT NULL,
    constraints TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calibration_targets (
    id SERIAL PRIMARY KEY,
    target_name VARCHAR(255) NOT NULL,
    target_value DECIMAL(15,4) NOT NULL,
    current_value DECIMAL(15,4) NOT NULL,
    calibration_method TEXT NOT NULL,
    accuracy DECIMAL(10,4) NOT NULL,
    validation_source VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE model_maturity (
    id SERIAL PRIMARY KEY,
    component VARCHAR(255) NOT NULL,
    maturity_level VARCHAR(100) NOT NULL,
    data_quality DECIMAL(10,4) NOT NULL,
    validation_status VARCHAR(100) NOT NULL,
    uncertainty_range VARCHAR(100) NOT NULL,
    improvement_needed TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mining_alternatives (
    id SERIAL PRIMARY KEY,
    material VARCHAR(255) NOT NULL,
    alternative VARCHAR(255) NOT NULL,
    performance_ratio DECIMAL(10,4) NOT NULL,
    cost_ratio DECIMAL(10,4) NOT NULL,
    environmental_benefit TEXT NOT NULL,
    scalability VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- GLOBAL (2 tables)
-- ============================================================

CREATE TABLE global_regeneration_summary (
    total_countries INTEGER NOT NULL,
    global_schools INTEGER NOT NULL,
    total_carbon_offset DECIMAL(20,2) NOT NULL,
    water_conserved DECIMAL(20,2) NOT NULL,
    biodiversity_protected INTEGER NOT NULL,
    employment_created INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE political_coalition (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    alignment VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    key_issues JSONB NOT NULL,
    engagement_strategy TEXT NOT NULL,
    influence VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CREATE INDEXES for better query performance
-- ============================================================

CREATE INDEX idx_timeline_events_year ON timeline_events(year);
CREATE INDEX idx_timeline_events_status ON timeline_events(status);
CREATE INDEX idx_schools_cluster_id ON schools(cluster_id);
CREATE INDEX idx_schools_state ON schools(state);
CREATE INDEX idx_scale_projections_year ON scale_projections(year);
CREATE INDEX idx_historical_financials_year ON historical_financials(year);
CREATE INDEX idx_endowment_projections_year ON endowment_projections(year);
CREATE INDEX idx_historical_climate_data_year ON historical_climate_data(year);
CREATE INDEX idx_job_creation_category ON job_creation(category);
CREATE INDEX idx_expanded_jobs_sector ON expanded_jobs(sector);
CREATE INDEX idx_environmental_impact_category ON environmental_impact(category);

-- Grant permissions to gaia_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gaia_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gaia_user;

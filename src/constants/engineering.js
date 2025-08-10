/**
 * Engineering Constants and Formulas
 * Centralized calculations for structural engineering
 */

export const MATERIAL_PROPERTIES = {
  steel: {
    name: 'Steel',
    elasticModulus: 200000, // MPa
    density: 7850, // kg/m³
    yieldStrength: 250 // MPa
  },
  concrete: {
    name: 'Concrete',
    elasticModulus: 25000, // MPa
    density: 2400, // kg/m³
    compressiveStrength: 25 // MPa
  },
  timber: {
    name: 'Timber',
    elasticModulus: 12000, // MPa
    density: 600, // kg/m³
    bendingStrength: 40 // MPa
  }
};

export const SOIL_PROPERTIES = {
  rock: {
    name: 'Rock',
    shearWaveVelocity: 800, // m/s
    bearing_capacity: 5000, // kPa
    description: 'Hard rock, excellent foundation'
  },
  dense_sand: {
    name: 'Dense Sand',
    shearWaveVelocity: 400, // m/s
    bearing_capacity: 600, // kPa
    description: 'Dense sand and gravel'
  },
  soft_clay: {
    name: 'Soft Clay',
    shearWaveVelocity: 150, // m/s
    bearing_capacity: 100, // kPa
    description: 'Soft clay, poor foundation'
  }
};

export const SEISMIC_ZONES = {
  low: {
    name: 'Low Seismic',
    designAcceleration: 0.1, // g
    description: 'Minimal earthquake risk'
  },
  moderate: {
    name: 'Moderate Seismic',
    designAcceleration: 0.25, // g
    description: 'Moderate earthquake risk'
  },
  high: {
    name: 'High Seismic',
    designAcceleration: 0.4, // g
    description: 'High earthquake risk (California, Japan)'
  }
};

/**
 * Core Engineering Calculations
 */
export const FORMULAS = {
  // Structural Dynamics
  naturalFrequency: (stiffness, mass) => Math.sqrt(stiffness / mass) / (2 * Math.PI),
  
  period: (naturalFreq) => 1 / naturalFreq,
  
  dampingRatio: (actualDamping, criticalDamping) => actualDamping / criticalDamping,
  
  dynamicAmplification: (frequencyRatio, dampingRatio) => {
    const denominator = Math.sqrt(
      Math.pow(1 - frequencyRatio * frequencyRatio, 2) +
      Math.pow(2 * dampingRatio * frequencyRatio, 2)
    );
    return 1 / denominator;
  },

  // Beam Analysis
  cantileverDeflection: (force, length, elasticModulus, momentOfInertia) => 
    (force * Math.pow(length, 3)) / (3 * elasticModulus * momentOfInertia),
  
  simplySupported_centerDeflection: (distributedLoad, length, elasticModulus, momentOfInertia) =>
    (5 * distributedLoad * Math.pow(length, 4)) / (384 * elasticModulus * momentOfInertia),
  
  maxBendingMoment_distributedLoad: (distributedLoad, length) =>
    (distributedLoad * Math.pow(length, 2)) / 8,

  // Column Analysis
  eulerBucklingLoad: (elasticModulus, momentOfInertia, length, endConditionFactor = 1) =>
    (Math.pow(Math.PI, 2) * elasticModulus * momentOfInertia) / Math.pow(endConditionFactor * length, 2),
  
  slendernessRatio: (effectiveLength, radiusOfGyration) =>
    effectiveLength / radiusOfGyration,

  // Stress Analysis
  axialStress: (force, area) => force / area,
  
  bendingStress: (moment, distanceFromNeutral, momentOfInertia) =>
    (moment * distanceFromNeutral) / momentOfInertia,
  
  shearStress: (shearForce, area) => shearForce / area,

  // Foundation Analysis
  bearingCapacity: (cohesion, surcharge, gamma, depth, Nc = 5.7, Nq = 1, Ng = 0) =>
    cohesion * Nc + surcharge * Nq + 0.5 * gamma * depth * Ng,

  // Seismic Analysis
  baseShear: (seismicWeight, designAcceleration, responseModification = 1) =>
    (seismicWeight * designAcceleration) / responseModification,
  
  storyDrift: (displacement_upper, displacement_lower, storyHeight) =>
    (displacement_upper - displacement_lower) / storyHeight
};

/**
 * Unit Conversion Functions
 */
export const UNITS = {
  // Length
  mm_to_m: (mm) => mm / 1000,
  m_to_mm: (m) => m * 1000,
  ft_to_m: (ft) => ft * 0.3048,
  m_to_ft: (m) => m / 0.3048,
  in_to_mm: (inches) => inches * 25.4,
  mm_to_in: (mm) => mm / 25.4,

  // Force
  kN_to_N: (kN) => kN * 1000,
  N_to_kN: (N) => N / 1000,
  lbs_to_N: (lbs) => lbs * 4.448,
  N_to_lbs: (N) => N / 4.448,
  kips_to_kN: (kips) => kips * 4.448,
  kN_to_kips: (kN) => kN / 4.448,

  // Stress/Pressure
  MPa_to_Pa: (MPa) => MPa * 1000000,
  Pa_to_MPa: (Pa) => Pa / 1000000,
  psi_to_MPa: (psi) => psi * 0.00689,
  MPa_to_psi: (MPa) => MPa / 0.00689,
  ksi_to_MPa: (ksi) => ksi * 6.895,
  MPa_to_ksi: (MPa) => MPa / 6.895,

  // Mass
  kg_to_lb: (kg) => kg * 2.205,
  lb_to_kg: (lb) => lb / 2.205,
  ton_to_kg: (ton) => ton * 1000,
  kg_to_ton: (kg) => kg / 1000
};

/**
 * Engineering Standards and Codes
 */
export const STANDARDS = {
  steel: {
    AISC: 'AISC 360 - Steel Construction Manual',
    ASCE7: 'ASCE 7 - Minimum Design Loads',
    AWS: 'AWS D1.1 - Structural Welding Code'
  },
  concrete: {
    ACI318: 'ACI 318 - Building Code Requirements',
    ACI301: 'ACI 301 - Concrete Construction',
    ASTM: 'ASTM C39 - Concrete Strength Testing'
  },
  seismic: {
    ASCE7: 'ASCE 7 - Seismic Design Requirements',
    IBC: 'International Building Code',
    FEMA: 'FEMA P-695 - Seismic Performance Assessment'
  }
};
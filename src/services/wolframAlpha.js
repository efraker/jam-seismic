/**
 * Wolfram Alpha Integration Service
 * Pre-constructed URLs for engineering calculations
 */

const WOLFRAM_BASE = 'https://www.wolframalpha.com/input/?i=';

/**
 * Generate Wolfram Alpha URL for a given query
 */
function generateWolframURL(query) {
  return WOLFRAM_BASE + encodeURIComponent(query);
}

/**
 * Structural Dynamics Calculations
 */
export const STRUCTURAL_DYNAMICS = {
  naturalFrequency: (stiffness, mass) => 
    generateWolframURL(`natural frequency sqrt(${stiffness}/${mass})/(2*pi) Hz`),
    
  period: (naturalFreq) => 
    generateWolframURL(`period 1/${naturalFreq} seconds`),
    
  dampingRatio: (actualDamping, criticalDamping) =>
    generateWolframURL(`damping ratio ${actualDamping}/${criticalDamping}`),
    
  dynamicAmplification: (frequencyRatio, dampingRatio) =>
    generateWolframURL(`dynamic amplification factor frequency ratio ${frequencyRatio} damping ${dampingRatio}`)
};

/**
 * Beam Analysis Calculations
 */
export const BEAM_ANALYSIS = {
  cantileverDeflection: (force, length, E, I) =>
    generateWolframURL(`cantilever beam deflection P=${force}N L=${length}m E=${E}Pa I=${I}m^4`),
    
  simplySupported: (load, length, E, I) =>
    generateWolframURL(`simply supported beam center deflection w=${load}N/m L=${length}m E=${E}Pa I=${I}m^4`),
    
  bendingMoment: (load, length) =>
    generateWolframURL(`maximum bending moment distributed load ${load}N/m span ${length}m`),
    
  beamStress: (moment, section_modulus) =>
    generateWolframURL(`bending stress M=${moment}Nm S=${section_modulus}m^3`)
};

/**
 * Column Analysis Calculations
 */
export const COLUMN_ANALYSIS = {
  eulerBuckling: (E, I, length) =>
    generateWolframURL(`Euler buckling load E=${E}Pa I=${I}m^4 L=${length}m`),
    
  slendernessRatio: (effectiveLength, radiusOfGyration) =>
    generateWolframURL(`slenderness ratio L=${effectiveLength}m r=${radiusOfGyration}m`),
    
  criticalStress: (E, slenderness) =>
    generateWolframURL(`column critical stress E=${E}Pa slenderness ratio ${slenderness}`)
};

/**
 * Foundation Analysis Calculations  
 */
export const FOUNDATION_ANALYSIS = {
  bearingCapacity: (cohesion, surcharge, gamma, depth) =>
    generateWolframURL(`bearing capacity c=${cohesion}kPa q=${surcharge}kPa gamma=${gamma}kN/m^3 D=${depth}m`),
    
  settlement: (load, area, E, depth) =>
    generateWolframURL(`foundation settlement P=${load}kN A=${area}m^2 E=${E}MPa D=${depth}m`),
    
  soilPressure: (load, area) =>
    generateWolframURL(`soil bearing pressure ${load}kN / ${area}m^2`)
};

/**
 * Seismic Analysis Calculations
 */
export const SEISMIC_ANALYSIS = {
  baseShear: (weight, acceleration, R = 1) =>
    generateWolframURL(`seismic base shear W=${weight}kN a=${acceleration}g R=${R}`),
    
  storyDrift: (displacement_upper, displacement_lower, height) =>
    generateWolframURL(`story drift ratio (${displacement_upper} - ${displacement_lower})mm / ${height}mm`),
    
  responseSpectrum: (period, damping = 0.05) =>
    generateWolframURL(`seismic response spectrum T=${period}s damping=${damping}`)
};

/**
 * Unit Conversion Links
 */
export const UNIT_CONVERSIONS = {
  // Length conversions
  mmToMeters: (mm) => generateWolframURL(`${mm} millimeters to meters`),
  feetToMeters: (ft) => generateWolframURL(`${ft} feet to meters`),
  inchesToMM: (inches) => generateWolframURL(`${inches} inches to millimeters`),
  
  // Force conversions
  kipsToKN: (kips) => generateWolframURL(`${kips} kips to kilonewtons`),
  lbsToNewtons: (lbs) => generateWolframURL(`${lbs} pounds to newtons`),
  
  // Pressure/Stress conversions
  psiToMPa: (psi) => generateWolframURL(`${psi} psi to MPa`),
  ksfToKPa: (ksf) => generateWolframURL(`${ksf} ksf to kPa`),
  
  // Mass conversions
  poundsToKg: (lbs) => generateWolframURL(`${lbs} pounds to kilograms`),
  
  // General conversion
  convert: (value, fromUnit, toUnit) => 
    generateWolframURL(`convert ${value} ${fromUnit} to ${toUnit}`)
};

/**
 * Material Property References
 */
export const MATERIAL_PROPERTIES = {
  steel: () => generateWolframURL('steel elastic modulus yield strength density'),
  concrete: () => generateWolframURL('concrete compressive strength elastic modulus density'),
  timber: () => generateWolframURL('timber lumber elastic modulus bending strength'),
  aluminum: () => generateWolframURL('aluminum alloy properties elastic modulus yield strength'),
  
  // Specific queries
  steelModulus: () => generateWolframURL('steel modulus of elasticity'),
  concreteStrength: () => generateWolframURL('concrete compressive strength typical values')
};

/**
 * Engineering Standards and Codes Reference
 */
export const STANDARDS_REFERENCE = {
  seismicDesign: () => generateWolframURL('ASCE 7 seismic design categories'),
  steelDesign: () => generateWolframURL('AISC steel design factors safety'),
  concreteDesign: () => generateWolframURL('ACI 318 concrete design requirements'),
  buildingCodes: () => generateWolframURL('international building code seismic wind loads')
};

/**
 * Quick Engineering Reference Queries
 */
export const QUICK_REFERENCES = {
  // Common formulas
  momentOfInertia: (shape) => generateWolframURL(`moment of inertia ${shape}`),
  sectionModulus: (shape) => generateWolframURL(`section modulus ${shape}`),
  shearCenter: (shape) => generateWolframURL(`shear center ${shape}`),
  
  // Load combinations
  loadCombinations: () => generateWolframURL('building code load combinations ASCE 7'),
  
  // Seismic factors
  seismicFactors: () => generateWolframURL('seismic design factors R Cd Ie'),
  
  // Common calculations
  deflectionLimits: () => generateWolframURL('beam deflection limits building code L/240 L/360'),
  
  // Professional reference
  engineeringLicensure: () => generateWolframURL('professional engineer PE license requirements')
};

/**
 * Interactive Formula Builder
 * Generates Wolfram Alpha links based on user input parameters
 */
export class FormulaBuilder {
  constructor() {
    this.query = '';
    this.parameters = {};
  }
  
  setFormula(formulaType) {
    this.formulaType = formulaType;
    return this;
  }
  
  addParameter(name, value, unit = '') {
    this.parameters[name] = { value, unit };
    return this;
  }
  
  build() {
    let query = this.formulaType;
    
    Object.entries(this.parameters).forEach(([name, { value, unit }]) => {
      query += ` ${name}=${value}${unit}`;
    });
    
    return generateWolframURL(query);
  }
}

/**
 * Preset Engineering Problems
 */
export const EXAMPLE_PROBLEMS = {
  // Structural dynamics examples
  buildingFrequency: () => 
    generateWolframURL('natural frequency 10-story building mass 1000kg/floor stiffness'),
    
  // Beam design examples  
  officeBeam: () =>
    generateWolframURL('steel beam design office loading 40 psf 30 foot span'),
    
  // Column design examples
  columnDesign: () =>
    generateWolframURL('steel column design 100 kip axial load 12 foot height'),
    
  // Foundation examples
  foundationDesign: () =>
    generateWolframURL('concrete footing design 200 kip column load soil bearing 3 ksf'),
    
  // Seismic examples
  seismicBuilding: () =>
    generateWolframURL('seismic analysis 5-story building California high seismic')
};
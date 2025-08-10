import React, { useState, useEffect } from 'react';
import { SimulationLayout } from '../../components/layout/AcademicPage';
import { ParameterInput, ParameterPanel, DataDisplay, ControlButton } from '../../components/scientific/ParameterPanel';
import { Figure } from '../../components/scientific/Figure';
import { UNITS } from '../../constants/engineering';
import { UNIT_CONVERSIONS } from '../../services/wolframAlpha';

export default function UnitsConversionsCalculator() {
  const [conversionType, setConversionType] = useState('length');
  const [inputValue, setInputValue] = useState(1.0);
  const [inputUnit, setInputUnit] = useState('m');
  const [outputUnit, setOutputUnit] = useState('ft');
  const [result, setResult] = useState(0);
  const [conversionHistory, setConversionHistory] = useState([]);

  // Available conversion categories and their units
  const conversionCategories = {
    length: {
      name: 'Length',
      units: {
        mm: { name: 'Millimeters', symbol: 'mm' },
        m: { name: 'Meters', symbol: 'm' },
        ft: { name: 'Feet', symbol: 'ft' },
        in: { name: 'Inches', symbol: 'in' }
      },
      conversions: {
        'mm-m': (val) => UNITS.mm_to_m(val),
        'm-mm': (val) => UNITS.m_to_mm(val),
        'ft-m': (val) => UNITS.ft_to_m(val),
        'm-ft': (val) => UNITS.m_to_ft(val),
        'in-mm': (val) => UNITS.in_to_mm(val),
        'mm-in': (val) => UNITS.mm_to_in(val),
        'ft-in': (val) => val * 12,
        'in-ft': (val) => val / 12,
        'ft-mm': (val) => UNITS.m_to_mm(UNITS.ft_to_m(val)),
        'mm-ft': (val) => UNITS.m_to_ft(UNITS.mm_to_m(val)),
        'in-m': (val) => UNITS.mm_to_m(UNITS.in_to_mm(val)),
        'm-in': (val) => UNITS.mm_to_in(UNITS.m_to_mm(val))
      }
    },
    
    force: {
      name: 'Force',
      units: {
        N: { name: 'Newtons', symbol: 'N' },
        kN: { name: 'Kilonewtons', symbol: 'kN' },
        lbs: { name: 'Pounds', symbol: 'lbs' },
        kips: { name: 'Kips', symbol: 'kips' }
      },
      conversions: {
        'kN-N': (val) => UNITS.kN_to_N(val),
        'N-kN': (val) => UNITS.N_to_kN(val),
        'lbs-N': (val) => UNITS.lbs_to_N(val),
        'N-lbs': (val) => UNITS.N_to_lbs(val),
        'kips-kN': (val) => UNITS.kips_to_kN(val),
        'kN-kips': (val) => UNITS.kN_to_kips(val),
        'kips-lbs': (val) => val * 1000,
        'lbs-kips': (val) => val / 1000,
        'kips-N': (val) => UNITS.kN_to_N(UNITS.kips_to_kN(val)),
        'N-kips': (val) => UNITS.kN_to_kips(UNITS.N_to_kN(val)),
        'lbs-kN': (val) => UNITS.N_to_kN(UNITS.lbs_to_N(val)),
        'kN-lbs': (val) => UNITS.N_to_lbs(UNITS.kN_to_N(val))
      }
    },
    
    stress: {
      name: 'Stress/Pressure',
      units: {
        Pa: { name: 'Pascals', symbol: 'Pa' },
        MPa: { name: 'Megapascals', symbol: 'MPa' },
        psi: { name: 'Pounds per Square Inch', symbol: 'psi' },
        ksi: { name: 'Kips per Square Inch', symbol: 'ksi' }
      },
      conversions: {
        'MPa-Pa': (val) => UNITS.MPa_to_Pa(val),
        'Pa-MPa': (val) => UNITS.Pa_to_MPa(val),
        'psi-MPa': (val) => UNITS.psi_to_MPa(val),
        'MPa-psi': (val) => UNITS.MPa_to_psi(val),
        'ksi-MPa': (val) => UNITS.ksi_to_MPa(val),
        'MPa-ksi': (val) => UNITS.MPa_to_ksi(val),
        'ksi-psi': (val) => val * 1000,
        'psi-ksi': (val) => val / 1000,
        'psi-Pa': (val) => UNITS.MPa_to_Pa(UNITS.psi_to_MPa(val)),
        'Pa-psi': (val) => UNITS.MPa_to_psi(UNITS.Pa_to_MPa(val)),
        'ksi-Pa': (val) => UNITS.MPa_to_Pa(UNITS.ksi_to_MPa(val)),
        'Pa-ksi': (val) => UNITS.MPa_to_ksi(UNITS.Pa_to_MPa(val))
      }
    },
    
    mass: {
      name: 'Mass',
      units: {
        kg: { name: 'Kilograms', symbol: 'kg' },
        ton: { name: 'Metric Tons', symbol: 'ton' },
        lb: { name: 'Pounds', symbol: 'lb' }
      },
      conversions: {
        'kg-lb': (val) => UNITS.kg_to_lb(val),
        'lb-kg': (val) => UNITS.lb_to_kg(val),
        'ton-kg': (val) => UNITS.ton_to_kg(val),
        'kg-ton': (val) => UNITS.kg_to_ton(val),
        'ton-lb': (val) => UNITS.kg_to_lb(UNITS.ton_to_kg(val)),
        'lb-ton': (val) => UNITS.kg_to_ton(UNITS.lb_to_kg(val))
      }
    }
  };

  // Perform conversion calculation
  useEffect(() => {
    const category = conversionCategories[conversionType];
    if (category && category.conversions) {
      const conversionKey = `${inputUnit}-${outputUnit}`;
      const conversionFunc = category.conversions[conversionKey];
      
      if (conversionFunc) {
        const convertedValue = conversionFunc(inputValue);
        setResult(convertedValue);
      } else if (inputUnit === outputUnit) {
        setResult(inputValue);
      } else {
        setResult(0);
      }
    }
  }, [conversionCategories, conversionType, inputValue, inputUnit, outputUnit]);

  // Add conversion to history
  const addToHistory = () => {
    const historyItem = {
      id: Date.now(),
      type: conversionType,
      input: inputValue,
      inputUnit: inputUnit,
      output: result,
      outputUnit: outputUnit,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setConversionHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
  };

  // Clear history
  const clearHistory = () => {
    setConversionHistory([]);
  };

  // Get available units for current category
  const getCurrentUnits = () => {
    return conversionCategories[conversionType]?.units || {};
  };

  // Generate Wolfram Alpha verification link
  const getWolframLink = () => {
    const fromUnitName = getCurrentUnits()[inputUnit]?.name || inputUnit;
    const toUnitName = getCurrentUnits()[outputUnit]?.name || outputUnit;
    return UNIT_CONVERSIONS.convert(inputValue, fromUnitName.toLowerCase(), toUnitName.toLowerCase());
  };

  // Common engineering unit sets for quick selection
  const commonConversions = {
    length: [
      { from: 'm', to: 'ft', label: 'Meters → Feet' },
      { from: 'mm', to: 'in', label: 'mm → Inches' },
      { from: 'ft', to: 'm', label: 'Feet → Meters' }
    ],
    force: [
      { from: 'kN', to: 'kips', label: 'kN → Kips' },
      { from: 'lbs', to: 'N', label: 'Pounds → Newtons' },
      { from: 'kips', to: 'kN', label: 'Kips → kN' }
    ],
    stress: [
      { from: 'MPa', to: 'psi', label: 'MPa → PSI' },
      { from: 'ksi', to: 'MPa', label: 'KSI → MPa' },
      { from: 'psi', to: 'MPa', label: 'PSI → MPa' }
    ]
  };

  const parameterPanel = (
    <div>
      {/* Conversion Type Selection */}
      <ParameterPanel title="Conversion Category">
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(conversionCategories).map(([key, category]) => (
            <ControlButton
              key={key}
              onClick={() => {
                setConversionType(key);
                const units = Object.keys(category.units);
                setInputUnit(units[0]);
                setOutputUnit(units[1] || units[0]);
              }}
              variant={conversionType === key ? 'primary' : 'secondary'}
              className="text-sm"
            >
              {category.name}
            </ControlButton>
          ))}
        </div>
      </ParameterPanel>

      {/* Input Parameters */}
      <ParameterPanel title="Input Value">
        <ParameterInput
          label="Value"
          value={inputValue}
          onChange={setInputValue}
          min={0}
          step={0.001}
          precision={6}
        />
        
        <div className="mt-3">
          <label className="text-data-label block mb-1">From Unit</label>
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="w-full p-2 border border-mono-400 bg-mono-100 font-mono text-sm"
          >
            {Object.entries(getCurrentUnits()).map(([key, unit]) => (
              <option key={key} value={key}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3">
          <label className="text-data-label block mb-1">To Unit</label>
          <select
            value={outputUnit}
            onChange={(e) => setOutputUnit(e.target.value)}
            className="w-full p-2 border border-mono-400 bg-mono-100 font-mono text-sm"
          >
            {Object.entries(getCurrentUnits()).map(([key, unit]) => (
              <option key={key} value={key}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>
      </ParameterPanel>

      {/* Quick Conversions */}
      {commonConversions[conversionType] && (
        <ParameterPanel title="Common Conversions">
          {commonConversions[conversionType].map((conv, index) => (
            <ControlButton
              key={index}
              onClick={() => {
                setInputUnit(conv.from);
                setOutputUnit(conv.to);
              }}
              variant="secondary"
              className="text-xs mb-2 w-full"
            >
              {conv.label}
            </ControlButton>
          ))}
        </ParameterPanel>
      )}
    </div>
  );

  const resultsPanel = (
    <div>
      {/* Conversion Result */}
      <ParameterPanel title="Result" variant="data">
        <DataDisplay
          label="Converted Value"
          value={result}
          units={getCurrentUnits()[outputUnit]?.symbol}
          precision={6}
        />
        
        <div className="mt-4 text-center">
          <ControlButton
            onClick={addToHistory}
            variant="primary"
            className="mb-2"
          >
            Add to History
          </ControlButton>
          
          <br />
          
          <a
            href={getWolframLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-data-label hover:text-mono-black text-sm underline"
          >
            Verify with Wolfram Alpha
          </a>
        </div>
      </ParameterPanel>

      {/* Conversion History */}
      {conversionHistory.length > 0 && (
        <ParameterPanel title="Recent Conversions">
          <div className="max-h-64 overflow-y-auto">
            {conversionHistory.map((item) => (
              <div key={item.id} className="border-b border-mono-300 pb-2 mb-2 last:border-b-0">
                <div className="text-xs text-methodology">{item.timestamp}</div>
                <div className="font-mono text-sm">
                  {item.input} {item.inputUnit} = {item.output.toFixed(4)} {item.outputUnit}
                </div>
                <div className="text-xs text-methodology capitalize">{item.type}</div>
              </div>
            ))}
          </div>
          
          <ControlButton
            onClick={clearHistory}
            variant="secondary"
            className="w-full text-xs mt-2"
          >
            Clear History
          </ControlButton>
        </ParameterPanel>
      )}
    </div>
  );

  const visualization = (
    <Figure
      title="Units Conversion Calculator"
      caption="Interactive tool for converting between common engineering units"
    >
      <div className="conversion-display bg-mono-100 p-6 border-2 border-mono-400 min-h-64 flex items-center justify-center">
        
        <div className="conversion-equation text-center">
          {/* Input Value Display */}
          <div className="input-display mb-4">
            <div className="text-2xl font-mono text-mono-black">
              {inputValue.toFixed(3)}
            </div>
            <div className="text-lg text-data-label">
              {getCurrentUnits()[inputUnit]?.name} ({getCurrentUnits()[inputUnit]?.symbol})
            </div>
          </div>
          
          {/* Conversion Arrow */}
          <div className="conversion-arrow text-3xl text-mono-600 mb-4">
            ↓
          </div>
          
          {/* Result Display */}
          <div className="result-display">
            <div className="text-3xl font-mono text-data-value font-bold">
              {result.toFixed(6)}
            </div>
            <div className="text-lg text-data-label">
              {getCurrentUnits()[outputUnit]?.name} ({getCurrentUnits()[outputUnit]?.symbol})
            </div>
          </div>
          
          {/* Conversion Factor Display */}
          <div className="conversion-factor mt-4 p-3 bg-mono-200 border border-mono-400">
            <div className="text-sm text-methodology">Conversion Factor:</div>
            <div className="font-mono text-sm">
              1 {getCurrentUnits()[inputUnit]?.symbol} = {(result / inputValue).toFixed(6)} {getCurrentUnits()[outputUnit]?.symbol}
            </div>
          </div>
        </div>
        
      </div>
    </Figure>
  );

  return (
    <SimulationLayout
      title="Units & Conversions Calculator"
      subtitle="Smart Engineering Unit Converter"
      parameterPanel={parameterPanel}
      visualization={visualization}
      resultsPanel={resultsPanel}
    >
      
      {/* Usage Guidelines */}
      <section className="panel-scientific p-6 border-precise-2 mt-8">
        <h3 className="text-data-value text-lg mb-4">Engineering Unit Conversion Guidelines</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-data-label mb-2">Common US to Metric</h4>
            <ul className="text-methodology text-sm space-y-1">
              <li>• <strong>Length:</strong> ft → m, in → mm</li>
              <li>• <strong>Force:</strong> kips → kN, lbs → N</li>
              <li>• <strong>Stress:</strong> ksi → MPa, psi → kPa</li>
              <li>• <strong>Mass:</strong> lbs → kg</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-data-label mb-2">Engineering Standards</h4>
            <ul className="text-methodology text-sm space-y-1">
              <li>• Use consistent units throughout calculations</li>
              <li>• Verify critical conversions with multiple sources</li>
              <li>• Round appropriately for engineering precision</li>
              <li>• Consider significant figures in results</li>
            </ul>
          </div>
        </div>
      </section>
      
    </SimulationLayout>
  );
}
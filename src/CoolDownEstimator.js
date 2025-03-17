import React, { useState } from 'react';

const materials = [
  { name: 'Carbon Steel', density: 7850, specificHeat: 500 },
  { name: 'Stainless Steel', density: 8000, specificHeat: 500 },
  { name: '9% Nickel Steel', density: 8050, specificHeat: 490 },
  { name: 'Aluminum', density: 2700, specificHeat: 900 },
  { name: 'Copper', density: 8960, specificHeat: 380 },
];

// Constants
const latentHeatLIN = 200 * 1000; // LIN latent heat in J/kg
const latentHeatLNG = 512 * 1000; // LNG latent heat in J/kg
const densityLIN = 800; // LIN density in kg/m³
const densityLNG = 450; // LNG density in kg/m³

const CoolDownEstimator = () => {
  const [tankHeight, setTankHeight] = useState('');
  const [tankDiameter, setTankDiameter] = useState('');
  const [tankWallThickness, setTankWallThickness] = useState('');
  const [tankMaterial, setTankMaterial] = useState(materials[2]); // Default to 9% Nickel Steel
  const [initialTemperature, setInitialTemperature] = useState('');
  const [targetTemperature, setTargetTemperature] = useState('');
  const [coolingRate, setCoolingRate] = useState('');
  const [contingencyFactor, setContingencyFactor] = useState('');
  const [results, setResults] = useState(null);

  const calculateValues = () => {
    const deltaT_vaporLIN = initialTemperature - (-120);
    const deltaT_LIN = -120 - (-160);
    const deltaT_LNG = -160 - targetTemperature;

    const tankRadius = (tankDiameter / 2) / 1000;
    const tankSurfaceArea = 2 * Math.PI * tankRadius * tankHeight + 2 * Math.PI * Math.pow(tankRadius, 2);
    const tankWeight = tankSurfaceArea * (tankWallThickness / 1000) * tankMaterial.density;

    const totalHeatLoad = tankWeight * tankMaterial.specificHeat * (initialTemperature - targetTemperature);

    const energyPerHour = (tankWeight * tankMaterial.specificHeat * coolingRate) * 3600;

    const LINCooldownDuration = (deltaT_vaporLIN + deltaT_LIN) / coolingRate;
    const LNGCooldownDuration = deltaT_LNG / coolingRate;
    const totalDuration = LINCooldownDuration + LNGCooldownDuration;

    const flowRateLIN = energyPerHour / latentHeatLIN / densityLIN; // m³/hr
    const flowRateLNG = energyPerHour / latentHeatLNG / densityLNG; // m³/hr

    const actualVolumeLIN = flowRateLIN * LINCooldownDuration;
    const actualVolumeLNG = flowRateLNG * LNGCooldownDuration;

    const contingency = (contingencyFactor / 100) * actualVolumeLIN;
    const totalLINVolume = actualVolumeLIN + contingency;
    const totalLNGVolume = actualVolumeLNG;

    setResults({
      totalLINVolume,
      totalLNGVolume,
      LINCooldownDuration,
      LNGCooldownDuration,
      totalDuration,
      flowRateLIN,
      flowRateLNG,
      message: 'Calculated based on flow rate and duration.'
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">LNG Cool Down Estimator</h2>
      <div className="grid gap-4">
        <div>
          <label>Tank Height (m)</label>
          <input type="number" value={tankHeight} onChange={(e) => setTankHeight(e.target.value)} placeholder="Enter tank height" className="border p-2 rounded" />
        </div>
        <div>
          <label>Tank Diameter (m)</label>
          <input type="number" value={tankDiameter} onChange={(e) => setTankDiameter(e.target.value)} placeholder="Enter tank diameter" className="border p-2 rounded" />
        </div>
        <div>
          <label>Tank Wall Thickness (mm)</label>
          <input type="number" value={tankWallThickness} onChange={(e) => setTankWallThickness(e.target.value)} placeholder="Enter wall thickness" className="border p-2 rounded" />
        </div>
        <div>
          <label>Tank Material</label>
          <select value={tankMaterial.density} onChange={(e) => setTankMaterial(materials.find(m => m.density == e.target.value))} className="border p-2 rounded">
            {materials.map((material) => (
              <option key={material.name} value={material.density}>{material.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Initial Temperature (°C)</label>
          <input type="number" value={initialTemperature} onChange={(e) => setInitialTemperature(e.target.value)} placeholder="Enter initial temperature" className="border p-2 rounded" />
        </div>
        <div>
          <label>Target Temperature (°C)</label>
          <input type="number" value={targetTemperature} onChange={(e) => setTargetTemperature(e.target.value)} placeholder="Enter target temperature" className="border p-2 rounded" />
        </div>
        <div>
          <label>Cooling Rate (°C/hr)</label>
          <input type="number" value={coolingRate} onChange={(e) => setCoolingRate(e.target.value)} placeholder="Enter cooling rate" className="border p-2 rounded" />
        </div>
        <div>
          <label>Contingency Factor (%)</label>
          <input type="number" value={contingencyFactor} onChange={(e) => setContingencyFactor(e.target.value)} placeholder="Enter contingency factor" className="border p-2 rounded" />
        </div>
        <button onClick={calculateValues} className="bg-blue-500 text-white px-4 py-2 rounded">Calculate</button>
      </div>
      {results && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Results</h3>
          <p>Total LIN Volume (m³): {results.totalLINVolume.toFixed(2)}</p>
          <p>Total LNG Volume (m³): {results.totalLNGVolume.toFixed(2)}</p>
          <p>Total Duration (hours): {results.totalDuration.toFixed(2)}</p>
          <p>LIN Flow Rate (m³/hr): {results.flowRateLIN.toFixed(2)}</p>
          <p>LNG Flow Rate (m³/hr): {results.flowRateLNG.toFixed(2)}</p>
          <p>{results.message}</p>
        </div>
      )}
    </div>
  );
};

export default CoolDownEstimator;

import React, { useState } from 'react';

const materials = [
  { name: 'Carbon Steel', density: 7850, specificHeat: 500 },
  { name: 'Stainless Steel', density: 8000, specificHeat: 500 },
  { name: '9% Nickel Steel', density: 8050, specificHeat: 490 },
  { name: 'Aluminum', density: 2700, specificHeat: 900 },
  { name: 'Copper', density: 8960, specificHeat: 380 },
];

const CoolDownEstimator = () => {
  const [tankVolume, setTankVolume] = useState('');
  const [tankHeight, setTankHeight] = useState('');
  const [tankDiameter, setTankDiameter] = useState('');
  const [tankWallThickness, setTankWallThickness] = useState('');
  const [tankMaterial, setTankMaterial] = useState(materials[0]);
  const [initialTemperature, setInitialTemperature] = useState('');
  const [targetTemperature, setTargetTemperature] = useState('');
  const [LINFlowRate, setLINFlowRate] = useState('');
  const [LNGFlowRate, setLNGFlowRate] = useState('');
  const [pipelineLength, setPipelineLength] = useState(''); // New pipeline input
  const [pipelineDiameter, setPipelineDiameter] = useState(''); // New pipeline input
  const [contingencyFactor, setContingencyFactor] = useState('');
  const [coolingRate, setCoolingRate] = useState('');
  const [results, setResults] = useState(null);

  const calculateValues = () => {
    const deltaT_vaporLIN = initialTemperature - (-120); // Vapor LIN cooling to -120°C
    const deltaT_LIN = -120 - (-160); // LIN cooling to -160°C
    const deltaT_LNG = -160 - targetTemperature; // LNG cooling below -160°C

    const tankRadius = (tankDiameter / 2) / 1000; // Convert to meters
    const tankSurfaceArea = 2 * Math.PI * tankRadius * tankHeight + 2 * Math.PI * Math.pow(tankRadius, 2);
    const tankVolumeInternal = Math.PI * Math.pow(tankRadius, 2) * tankHeight;
    const tankWeight = tankVolume ? tankVolume * tankMaterial.density : tankSurfaceArea * tankWallThickness / 1000 * tankMaterial.density;

    // Phase 1: Vapor LIN cooling
    const heatLoadVaporLIN = tankWeight * tankMaterial.specificHeat * deltaT_vaporLIN;
    const latentHeatLIN = 200 * 1000; // Latent heat of LIN in J/kg
    const requiredVaporLINVolume = heatLoadVaporLIN / latentHeatLIN;

    // Phase 2: LIN cooling
    const heatLoadLIN = tankWeight * tankMaterial.specificHeat * deltaT_LIN;
    const requiredLINVolume = heatLoadLIN / latentHeatLIN;
    const totalLINVolume = requiredVaporLINVolume + requiredLINVolume;

    // Phase 3: LNG cooling
    const heatLoadLNG = tankWeight * tankMaterial.specificHeat * deltaT_LNG;
    const latentHeatLNG = 512 * 1000; // Latent heat of LNG in J/kg
    const requiredLNGVolume = heatLoadLNG / latentHeatLNG;

    // Contingency
    const finalLINVolumeWithSafety = totalLINVolume * (1 + contingencyFactor / 100);

    // Cooling duration
    const LINCooldownDuration = totalLINVolume / LINFlowRate;
    const LNGCooldownDuration = requiredLNGVolume / LNGFlowRate;
    const totalDuration = LINCooldownDuration + LNGCooldownDuration;

    setResults({ LINCooldownDuration, LNGCooldownDuration, requiredVaporLINVolume, requiredLINVolume, finalLINVolumeWithSafety, totalDuration });
  };

  return (
    <div className="p-4 max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">LNG Cool Down Estimator</h2>
      <div className="grid gap-4">
        <div>
          <label>Tank Volume (m³)</label>
          <input
            type="number"
            value={tankVolume}
            onChange={(e) => setTankVolume(e.target.value)}
            placeholder="Enter tank volume"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>Tank Height (m)</label>
          <input
            type="number"
            value={tankHeight}
            onChange={(e) => setTankHeight(e.target.value)}
            placeholder="Enter tank height"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>Tank Diameter (m)</label>
          <input
            type="number"
            value={tankDiameter}
            onChange={(e) => setTankDiameter(e.target.value)}
            placeholder="Enter tank diameter"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>Tank Wall Thickness (mm)</label>
          <input
            type="number"
            value={tankWallThickness}
            onChange={(e) => setTankWallThickness(e.target.value)}
            placeholder="Enter wall thickness"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>Tank Material</label>
          <select
            value={tankMaterial.density}
            onChange={(e) => setTankMaterial(materials.find(m => m.density == e.target.value))}
            className="border p-2 rounded"
          >
            {materials.map((material) => (
              <option key={material.name} value={material.density}>
                {material.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Initial Temperature (°C)</label>
          <input
            type="number"
            value={initialTemperature}
            onChange={(e) => setInitialTemperature(e.target.value)}
            placeholder="Enter initial temperature"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>Target Temperature (°C)</label>
          <input
            type="number"
            value={targetTemperature}
            onChange={(e) => setTargetTemperature(e.target.value)}
            placeholder="Enter target temperature"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>LIN Flow Rate (m³/hr)</label>
          <input
            type="number"
            value={LINFlowRate}
            onChange={(e) => setLINFlowRate(e.target.value)}
            placeholder="Enter LIN flow rate"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>LNG Flow Rate (m³/hr)</label>
          <input
            type="number"
            value={LNGFlowRate}
            onChange={(e) => setLNGFlowRate(e.target.value)}
            placeholder="Enter LNG flow rate"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>Pipeline Length (m)</label>
          <input
            type="number"
            value={pipelineLength}
            onChange={(e) => setPipelineLength(e.target.value)}
            placeholder="Enter pipeline length"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>Pipeline Diameter (mm)</label>
          <input
            type="number"
            value={pipelineDiameter}
            onChange={(e) => setPipelineDiameter(e.target.value)}
            placeholder="Enter pipeline diameter"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>Contingency Factor (%)</label>
          <input
            type="number"
            value={contingencyFactor}
            onChange={(e) => setContingencyFactor(e.target.value)}
            placeholder="Enter contingency factor"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>Cooling Rate (°C/hr)</label>
          <input
            type="number"
            value={coolingRate}
            onChange={(e) => setCoolingRate(e.target.value)}
            placeholder="Enter cooling rate"
            className="border p-2 rounded"
          />
        </div>

        <div className="mt-4">
          <button onClick={calculateValues} className="bg-blue-500 text-white p-2 rounded">
            Calculate
          </button>
        </div>

        {results && (
          <div className="mt-4 bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-bold mb-2">Results</h3>
            <p><strong>LIN Cooling Duration:</strong> {results.LINCooldownDuration.toFixed(2)} hours</p>
            <p><strong>LNG Cooling Duration:</strong> {results.LNGCooldownDuration.toFixed(2)} hours</p>
            <p><strong>Required Vapor LIN Volume:</strong> {results.requiredVaporLINVolume.toFixed(2)} m³</p>
            <p><strong>Required LIN Volume:</strong> {results.requiredLINVolume.toFixed(2)} m³</p>
            <p><strong>Total LIN Volume with Contingency:</strong> {results.finalLINVolumeWithSafety.toFixed(2)} m³</p>
            <p><strong>Total Duration:</strong> {results.totalDuration.toFixed(2)} hours</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoolDownEstimator;

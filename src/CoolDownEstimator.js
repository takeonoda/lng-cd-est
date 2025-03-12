import React, { useState } from 'react';
import Card from './components/card';      // Corrected path
import Input from './components/input';    // Corrected path
import Button from './components/button';  // Corrected path
import { HashRouter as Router, Route, Switch } from 'react-router-dom';


const materials = [
  { name: 'Carbon Steel', density: 7850, specificHeat: 500 },
  { name: 'Stainless Steel', density: 8000, specificHeat: 500 },
  { name: '9% Nickel Steel', density: 8050, specificHeat: 490 },
  { name: 'Aluminum', density: 2700, specificHeat: 900 },
  { name: 'Copper', density: 8960, specificHeat: 380 },
];

const CoolDownEstimator = () => {
  const [tankVolume, setTankVolume] = useState('');
  const [tankWallThickness, setTankWallThickness] = useState('');
  const [tankMaterial, setTankMaterial] = useState(materials[1]);
  const [pipelineLength, setPipelineLength] = useState('');
  const [pipelineDiameter, setPipelineDiameter] = useState('');
  const [pipelineMaterial, setPipelineMaterial] = useState(materials[1]);
  const [initialTemperature, setInitialTemperature] = useState('');
  const [targetTemperature, setTargetTemperature] = useState('');
  const [contingencyFactor, setContingencyFactor] = useState('');
  const [LINFlowRate, setLINFlowRate] = useState('');
  const [LNGFlowRate, setLNGFlowRate] = useState('');
  const [results, setResults] = useState(null);

  const calculateValues = () => {
    const deltaTLIN = initialTemperature - (-160); // LIN cooling down to -160°C
    const deltaTLNG = -160 - targetTemperature; // LNG cooling below -160°C
    const pipelineRadius = (pipelineDiameter / 1000) / 2;
    const pipelineVolume = Math.PI * Math.pow(pipelineRadius, 2) * pipelineLength;
    const totalSystemMass = (tankVolume * tankMaterial.density) + (pipelineVolume * pipelineMaterial.density);

    // LIN Phase
    const heatLoadLIN = totalSystemMass * tankMaterial.specificHeat * deltaTLIN;
    const latentHeatLIN = 200; // Example latent heat of LIN
    const requiredLINVolume = heatLoadLIN / (latentHeatLIN + (tankMaterial.specificHeat * deltaTLIN));
    const LINCooldownDuration = requiredLINVolume / LINFlowRate;

    // LNG Phase
    const heatLoadLNG = totalSystemMass * tankMaterial.specificHeat * deltaTLNG;
    const latentHeatLNG = 500; // Example latent heat of LNG
    const requiredLNGVolume = heatLoadLNG / (latentHeatLNG + (tankMaterial.specificHeat * deltaTLNG));
    const LNGCooldownDuration = requiredLNGVolume / LNGFlowRate;

    // Maximum allowable LIN flow rate before exceeding the cooling limit of 12.5°C/hour
    const maxCoolingRatePerHour = 12.5;
    const maxLINFlowRate = (heatLoadLIN / (maxCoolingRatePerHour * tankMaterial.specificHeat * totalSystemMass)) / 16; // Cooling duration of 16 hours

    const finalLNGVolumeWithSafety = requiredLNGVolume * (1 + contingencyFactor / 100);

    setResults({ LINCooldownDuration, LNGCooldownDuration, requiredLINVolume, finalLNGVolumeWithSafety, maxLINFlowRate });
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
          <label>Pipeline Total Length (m)</label>
          <input
            type="number"
            value={pipelineLength}
            onChange={(e) => setPipelineLength(e.target.value)}
            placeholder="Enter pipeline total length"
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
          <label>Pipeline Material</label>
          <select
            value={pipelineMaterial.density}
            onChange={(e) => setPipelineMaterial(materials.find(m => m.density == e.target.value))}
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
        <button onClick={calculateValues} className="bg-blue-500 text-white p-2 rounded">
          Calculate
        </button>

{results && (
  <div className="mt-4">
    <p>
      LIN Cooldown Duration: {results.LINCooldownDuration.toFixed(2)} hours (
      {Math.floor(results.LINCooldownDuration / 24)} days{" "}
      {(results.LINCooldownDuration % 24).toFixed(2)} hours)
    </p>
    <p>
      LNG Cooldown Duration: {results.LNGCooldownDuration.toFixed(2)} hours (
      {Math.floor(results.LNGCooldownDuration / 24)} days{" "}
      {(results.LNGCooldownDuration % 24).toFixed(2)} hours)
    </p>
    <p>LIN Volume Used: {results.requiredLINVolume.toFixed(2)} m³</p>
    <p>Final LNG Volume with Safety Factor: {results.finalLNGVolumeWithSafety.toFixed(2)} m³</p>
    <p>
      Maximum LIN Flow Rate (before exceeding 12.5°C/hr): {results.maxLINFlowRate.toFixed(2)} m³/hr
    </p>
  </div>
)}

      </div>
    </div>
 

  );
};

export default CoolDownEstimator;
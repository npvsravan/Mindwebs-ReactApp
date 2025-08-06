import React, { useState, useEffect } from "react";
import "./Sidebar.css";

interface ThresholdRule {
  color: string;
  operator: string;
  value: number;
}

interface DataSourceConfig {
  field: string;
  rules: ThresholdRule[];
}

const availableFields = ["temperature_2m", "humidity", "wind_speed"];
const operators = ["<", "<=", ">", ">=", "="];

interface SidebarProps {
  onConfigChange: (config: DataSourceConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onConfigChange }) => {
  const [selectedDataSource, setSelectedDataSource] = useState("Open-Meteo");
  const [field, setField] = useState("temperature_2m");
  const [rules, setRules] = useState<ThresholdRule[]>([]);

  const addRule = () => {
    setRules([...rules, { color: "#ff0000", operator: "<", value: 10 }]);
  };

  const updateRule = (index: number, updatedRule: Partial<ThresholdRule>) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], ...updatedRule };
    setRules(updatedRules);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onConfigChange({ field, rules });
  }, [field, rules, onConfigChange]);

  return (
    <div className="sidebar">
      <h3>Data Source</h3>
      <select
        value={selectedDataSource}
        onChange={(e) => setSelectedDataSource(e.target.value)}
      >
        <option value="Open-Meteo">Open-Meteo</option>
      </select>

      <h4>Field</h4>
      <select value={field} onChange={(e) => setField(e.target.value)}>
        {availableFields.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <h4>Threshold Rules</h4>
      {rules.map((rule, index) => (
        <div key={index} className="rule-row">
          <input
            type="color"
            value={rule.color}
            onChange={(e) => updateRule(index, { color: e.target.value })}
          />
          <select
            value={rule.operator}
            onChange={(e) => updateRule(index, { operator: e.target.value })}
          >
            {operators.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={rule.value}
            onChange={(e) => updateRule(index, { value: parseFloat(e.target.value) })}
          />
          <button onClick={() => removeRule(index)}>🗑</button>
        </div>
      ))}

      <button onClick={addRule}>➕ Add Rule</button>
    </div>
  );
};

export default Sidebar;

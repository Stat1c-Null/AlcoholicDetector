import React, { useState } from 'react';
import { Download } from 'lucide-react';

const AlcoholicDatasetGenerator = () => {
  const [numSamples, setNumSamples] = useState(50);
  const [dataset, setDataset] = useState([]);

  const generateDataset = () => {
    const data = [];
    const numAlcoholic = Math.floor(numSamples / 2);
    const numNonAlcoholic = numSamples - numAlcoholic;

    // Generate alcoholic samples
    for (let i = 0; i < numAlcoholic; i++) {
      data.push({
        drinksPerSession: Math.floor(Math.random() * 8) + 5, // 5-12 drinks
        drunkPerMonth: Math.floor(Math.random() * 20) + 10, // 10-29 times
        avgAlcoholContent: parseFloat((Math.random() * 0.1 + 0.10).toFixed(2)), // 0.10-0.20 (10-20% ABV)
        thoughtsPerDay: Math.floor(Math.random() * 15) + 8, // 8-22 times
        sessionDuration: parseFloat((Math.random() * 4 + 3).toFixed(1)), // 3-7 hours
        morningDrinkingPerWeek: Math.floor(Math.random() * 6) + 2, // 2-7 times
        label: 'alcoholic'
      });
    }

    // Generate non-alcoholic samples
    for (let i = 0; i < numNonAlcoholic; i++) {
      data.push({
        drinksPerSession: Math.floor(Math.random() * 4) + 1, // 1-4 drinks
        drunkPerMonth: Math.floor(Math.random() * 5), // 0-4 times
        avgAlcoholContent: parseFloat((Math.random() * 0.08 + 0.04).toFixed(2)), // 0.04-0.12 (4-12% ABV)
        thoughtsPerDay: Math.floor(Math.random() * 4), // 0-3 times
        sessionDuration: parseFloat((Math.random() * 2.5 + 1).toFixed(1)), // 1-3.5 hours
        morningDrinkingPerWeek: Math.floor(Math.random() * 2), // 0-1 times
        label: 'non-alcoholic'
      });
    }

    // Shuffle the dataset
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }

    setDataset(data);
  };

  const downloadCSV = () => {
    const headers = [
      'drinks_per_session',
      'times_drunk_per_month',
      'avg_alcohol_content',
      'thoughts_per_day',
      'session_duration_hours',
      'morning_drinking_per_week',
      'label'
    ];

    const csvContent = [
      headers.join(','),
      ...dataset.map(row => 
        `${row.drinksPerSession},${row.drunkPerMonth},${row.avgAlcoholContent},${row.thoughtsPerDay},${row.sessionDuration},${row.morningDrinkingPerWeek},${row.label}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alcoholic_detection_dataset.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const matrixString = dataset.map(row => 
      `[${row.drinksPerSession}, ${row.drunkPerMonth}, ${row.avgAlcoholContent}, ${row.thoughtsPerDay}, ${row.sessionDuration}, ${row.morningDrinkingPerWeek}, "${row.label}"]`
    ).join(',\n');
    
    const fullMatrix = `[\n${matrixString}\n]`;
    navigator.clipboard.writeText(fullMatrix);
    alert('Dataset copied to clipboard!');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Alcoholic Detection Dataset Generator</h1>
      <p className="text-gray-600 mb-6">Generate realistic synthetic data for training a perceptron classifier</p>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <label className="font-medium">Number of Samples:</label>
          <input
            type="number"
            value={numSamples}
            onChange={(e) => setNumSamples(Math.max(10, parseInt(e.target.value) || 10))}
            className="border rounded px-3 py-2 w-24"
            min="10"
          />
          <button
            onClick={generateDataset}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
          >
            Generate Dataset
          </button>
          {dataset.length > 0 && (
            <>
              <button
                onClick={downloadCSV}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium flex items-center gap-2"
              >
                <Download size={18} />
                Download CSV
              </button>
              <button
                onClick={copyToClipboard}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 font-medium"
              >
                Copy Array
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h3 className="font-semibold mb-2">Features:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Drinks per session</li>
              <li>Times drunk per month</li>
              <li>Average alcohol content (ABV)</li>
              <li>Thoughts about alcohol per day</li>
              <li>Session duration (hours)</li>
              <li>Morning drinking per week</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Label Distributions:</h3>
            <p>• Alcoholic: ~{Math.floor(numSamples / 2)} samples</p>
            <p>• Non-alcoholic: ~{Math.ceil(numSamples / 2)} samples</p>
          </div>
        </div>
      </div>

      {dataset.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Generated Dataset ({dataset.length} samples)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Drinks/Session</th>
                  <th className="p-2 text-left">Drunk/Month</th>
                  <th className="p-2 text-left">Avg Alcohol</th>
                  <th className="p-2 text-left">Thoughts/Day</th>
                  <th className="p-2 text-left">Duration (hrs)</th>
                  <th className="p-2 text-left">Morning/Week</th>
                  <th className="p-2 text-left">Label</th>
                </tr>
              </thead>
              <tbody>
                {dataset.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{row.drinksPerSession}</td>
                    <td className="p-2">{row.drunkPerMonth}</td>
                    <td className="p-2">{row.avgAlcoholContent}</td>
                    <td className="p-2">{row.thoughtsPerDay}</td>
                    <td className="p-2">{row.sessionDuration}</td>
                    <td className="p-2">{row.morningDrinkingPerWeek}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        row.label === 'alcoholic' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlcoholicDatasetGenerator;
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import jsonData from '../../data/data.json'; // Assurez-vous que le chemin vers les données est correct
import geoData from '../../data/geo.json'; // Assurez-vous que le chemin vers les données est correct

const LineChart = () => {
  const [selectedStation, setSelectedStation] = useState('');
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stations, setStations] = useState([]);

  // Préparation des catégories pour les heures
  useEffect(() => {
    const hours = [];
    for (let i = 0; i < 24; i += 3) {
      hours.push(`${i}:00`);
    }
    setCategories(hours);
  }, []);

  // Extraction et mise en place des noms des stations
  useEffect(() => {
    const stationNamesMap = geoData.reduce((acc, station) => {
      acc[station['Code station']] = station['Nom station'];
      return acc;
    }, {});
  
    const allStationCodes = Object.values(jsonData).flatMap(zag => 
      Object.keys(zag)
    );
  
    // Créez un tableau unique de stations, puis triez-le par nom de station
    const uniqueStations = Array.from(new Set(allStationCodes))
      .map(code => ({
        code,
        name: stationNamesMap[code] || 'Unknown Station'
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Tri alphabétique par nom de station
  
    setStations(uniqueStations);
  }, []);

  // Mise à jour des séries de données lors de la sélection d'une station
  useEffect(() => {
    if (!selectedStation) {
      return;
    }

    const newSeries = [];
    const pollutantsData = Object.values(jsonData).map(zag => zag[selectedStation]).find(data => data);
    
    if (pollutantsData) {
      Object.entries(pollutantsData).forEach(([pollutant, readings]) => {
        // Initialisez les données pour chaque tranche de 3 heures
        const hourlyData = Array(8).fill(0);
        const counts = Array(8).fill(0);

        readings.forEach(([time, value]) => {
          const date = new Date(time);
          const valueParsed = parseFloat(value);
          if (!isNaN(date.getTime()) && !isNaN(valueParsed)) {
            const hourIndex = Math.floor(date.getHours() / 3);
            hourlyData[hourIndex] += valueParsed;
            counts[hourIndex]++;
          }
        });

        const averagedData = hourlyData.map((sum, index) => (counts[index] ? (sum / counts[index]).toFixed(2) : 0));

        newSeries.push({ name: pollutant, data: averagedData });
      });
    }

    setSeries(newSeries);
  }, [selectedStation]);

  // Options pour le graphique ApexCharts
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    xaxis: {
      categories
    },
    yaxis: {
      title: {
        text: 'Concentration'
      }
    },
    tooltip: {
      shared: true,
      intersect: false
    }
  };

  return (
    <div>
      <select value={selectedStation} onChange={(e) => setSelectedStation(e.target.value)}>
        <option value="">Sélectionnez votre station</option>
        {stations.map(station => (
          <option key={station.code} value={station.code}>{station.name}</option>
        ))}
      </select>

      <Chart
        options={chartOptions}
        series={series}
        type="line"
        height="350"
      />
    </div>
  );
};

export default LineChart;

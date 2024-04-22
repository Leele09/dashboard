import React, { useState, useEffect } from 'react';
import ApexChart from 'react-apexcharts';
import { processData } from '../../variables/charts'; // Ajustez le chemin selon vos besoins
import jsonData from '../../data/data.json'; // Ajustez le chemin selon vos besoins

function PieChart() {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      labels: [],
      // ...toutes autres options dont votre bibliothèque de graphiques a besoin
    },
  });

  useEffect(() => {
    const data = processData(jsonData);
    setChartData({
      series: Object.values(data), // Exemple : [21, 22, 23, 24, 25]
      options: {
        ...chartData.options,
        labels: Object.keys(data), // Exemple : ['NO', 'NO2', 'O3', 'PM10', 'PM2.5']
      },
    });
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', margin: 'auto' }}>
      <ApexChart
        options={chartData.options}
        series={chartData.series}
        type="pie"
        width="360"
      />
    </div>
  );
}  

export default PieChart;

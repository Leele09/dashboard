import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import jsonData from '../../data/data.json';
import geoData from '../../data/geo.json'; 

class BarChart extends Component {
  constructor(props) {
    super(props);

    const stationNamesMap = {};
    geoData.forEach(station => {
      stationNamesMap[station["Code station"]] = station["Nom station"];
    });

    this.state = {
      selectedStation: Object.keys(stationNamesMap)[1],
      stationNamesMap: stationNamesMap,
      chartData: {
        series: [{
          name: "Polluants",
          data: [],
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
          },
          xaxis: {
            categories: [],
          },
          ...props.chartOptions, // vos options de chart précédemment définies
        },
      },
    };
  }

  componentDidMount() {
    this.updateChartData(this.state.selectedStation);
  }

  updateChartData = (stationCode) => {
    const stationData = {}; // initialiser un objet pour les données de la station sélectionnée

    // Extraire et organiser les données par polluant pour la station sélectionnée
    Object.values(jsonData).forEach(zag => {
      const stationPollutants = zag[stationCode];
      if (stationPollutants) {
        Object.entries(stationPollutants).forEach(([pollutant, readings]) => {
          if (!stationData[pollutant]) {
            stationData[pollutant] = [];
          }
          readings.forEach(reading => {
            const [date, value, quality] = reading;
            if (value && value !== '-') {
              stationData[pollutant].push(parseFloat(value));
            }
          });
        });
      }
    });

    // Calculer la moyenne pour chaque polluant
    const series = Object.entries(stationData).map(([pollutant, values]) => {
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      return average.toFixed(2); // Arrondi à deux décimales
    });

    const categories = Object.keys(stationData);

    this.setState({
      chartData: {
        series: [{ name: "Moyenne des polluants", data: series }],
        options: {
          ...this.state.chartData.options,
          xaxis: { categories },
        },
      },
    });
  }

  handleStationChange = (event) => {
    const newStationCode = event.target.value;
    this.setState({ selectedStation: newStationCode });
    this.updateChartData(newStationCode);
  }

  render() {
    const { chartData, selectedStation, stationNamesMap } = this.state;
  
    // Trier les options des stations par nom de station de manière alphabétique
    const stationOptions = Object.entries(stationNamesMap)
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([code, name]) => <option key={code} value={code}>{name}</option>);
  
    return (
      <div>
        <select
          value={selectedStation}
          onChange={this.handleStationChange}
          style={{ width: '100%', padding: '0.25rem' }} // Ajustez la taille et le padding ici
        >
          {stationOptions}
        </select>
  
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          width="100%"
          height="250"
        />
      </div>
    );
  }
}

export default BarChart;

import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import jsonData from '../../data/data.json';
import zagNameData from '../../data/zag_name.json';


class BarChart extends Component {
  constructor(props) {
    super(props);

    // Create a sorted array of ZAG names for the filter dropdown
    const zagOptions = Object.entries(zagNameData)
      .sort(([, aName], [, bName]) => aName.localeCompare(bName))
      .map(([code, name]) => ({ code, name }));

    this.state = {
      selectedStation: zagOptions[1].code, // Default to the first station alphabetically
      zagOptions,
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
          toolbar: {
            show: true,
            tools: {
              download: true,
            },
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

  updateChartData = (station) => {
    const stationData = jsonData[station];
    const pollutantsAverages = {};
    Object.entries(stationData).forEach(([site, pollutants]) => {
      Object.entries(pollutants).forEach(([pollutant, values]) => {
        if (!pollutantsAverages[pollutant]) {
          pollutantsAverages[pollutant] = [];
        }
        const readings = values.map(([date, value]) => parseFloat(value)).filter(value => !isNaN(value));
        pollutantsAverages[pollutant].push(...readings);
      });
    });

    const series = Object.entries(pollutantsAverages).map(([pollutant, values]) => {
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      return average.toFixed(2); // Arrondi à deux décimales
    });

    const categories = Object.keys(pollutantsAverages);

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
    const newStation = event.target.value;
    this.setState({ selectedStation: newStation });
    this.updateChartData(newStation);
  }

  render() {
    const { chartData, selectedStation, zagOptions } = this.state;

    return (
      <div>
        <select value={selectedStation} onChange={this.handleStationChange}>
          {zagOptions.map(({ code, name }) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>

        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          width="100%"
          height="200%"
        />
      </div>
    );
  }
}

export default BarChart;
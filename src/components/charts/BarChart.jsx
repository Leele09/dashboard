import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { processData } from '../../variables/charts';
import jsonData from '../../data/data.json';

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        series: [],
        options: {
          ...props.chartOptions, // vos options de chart précédemment définies
          xaxis: {
            categories: [], // Ce sera mis à jour avec les noms des polluants
          },
        },
      },
    };
  }

  componentDidMount() {
    // Utilisez la fonction processData pour traiter vos données JSON
    const processedData = processData(jsonData);
    const series = Object.values(processedData).map(value => Math.round(value * 10) / 10);
    const categories = Object.keys(processedData);

    this.setState({
      chartData: {
        ...this.state.chartData,
        series: [{ name: "Polluants", data: series }],
        options: {
          ...this.state.chartData.options,
          xaxis: {
            ...this.state.chartData.options.xaxis,
            categories: categories,
          },
        },
      },
    });
  }

  render() {
    const { chartData } = this.state;
    return (
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        width="100%"
        height="100%"
      />
    );
  }
}

export default BarChart;

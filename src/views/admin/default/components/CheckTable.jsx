import React, { useMemo, useState, useEffect } from 'react';
import Card from '../../../../components/card/index.jsx';
import { useTable } from 'react-table';
import jsonData from '../../../../data/data.json'; 
import geoData from '../../../../data/geo.json'; 

const CheckTable = () => {
  const [selectedStation, setSelectedStation] = useState('');
  const [tableData, setTableData] = useState([]);
  const [stationNames, setStationNames] = useState({});

  useEffect(() => {
    const stationNamesMap = {};
    geoData.forEach(station => {
      stationNamesMap[station["Code station"]] = station["Nom station"];
    });
    setStationNames(stationNamesMap);
  }, []);

  useEffect(() => {
    const stationData = {};
    const pollutantSums = {};

    // Parcourir chaque ZAG pour obtenir les stations
    Object.values(jsonData).forEach(zag => {
      Object.entries(zag).forEach(([stationCode, pollutantsObj]) => {
        if (!pollutantSums[stationCode]) {
          pollutantSums[stationCode] = {};
        }

        // Parcourir chaque polluant pour la station
        Object.entries(pollutantsObj).forEach(([pollutant, readings]) => {
          readings.forEach(reading => {
            const [value] = reading;
            if (value && value !== '-') {
              const numericValue = parseFloat(value);
              if (!stationData[stationCode]) {
                stationData[stationCode] = {};
              }
              if (!stationData[stationCode][pollutant]) {
                stationData[stationCode][pollutant] = [];
                pollutantSums[stationCode][pollutant] = 0;
              }
              stationData[stationCode][pollutant].push(numericValue);
              pollutantSums[stationCode][pollutant] += numericValue;
            }
          });
        });
      });
    });

    const averagedData = [];
    Object.entries(stationData).forEach(([stationCode, pollutants]) => {
      const totalSum = Object.values(pollutantSums[stationCode]).reduce((acc, value) => acc + value, 0);

      Object.entries(pollutants).forEach(([pollutant, values]) => {
        const average = values.reduce((acc, value) => acc + value, 0) / values.length;
        const percentage = (pollutantSums[stationCode][pollutant] / totalSum) * 100;
        averagedData.push({
          station: stationNames[stationCode] || stationCode,
          pollutant: pollutant,
          average: average.toFixed(2),
          percentage: percentage.toFixed(2) // Pas besoin d'ajouter le signe % ici, cela sera ajouté lors de l'affichage dans le tableau
        });
      });
    });

    // Appliquer le filtre de station sélectionnée
    const filteredData = selectedStation
      ? averagedData.filter(data => data.station === stationNames[selectedStation])
      : averagedData;

    setTableData(filteredData);
  }, [selectedStation, stationNames]);

  const columns = useMemo(() => [
    {
      Header: 'Station',
      accessor: 'station',
    },
    {
      Header: 'Polluant',
      accessor: 'pollutant',
    },
    {
      Header: 'Moyenne',
      accessor: 'average',
    },
    {
      Header: 'Pourcentage',
      accessor: 'percentage',
      Cell: ({ value }) => {
        return value + '%'; // Ajout du signe % lors de l'affichage
      },
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: tableData,
  });

  return (
  <Card extra={'w-full h-full sm:overflow-auto px-6'}>
    <div className='flex justify-between items-center pt-4'>
      <div className="text-xl font-bold text-navy-700 dark:text-white">
        Tableau de données des stations
      </div>
      <select
        value={selectedStation}
        onChange={e => setSelectedStation(e.target.value)}
        className="select"
      >
        <option value="">Toutes les stations</option>
        {Object.entries(stationNames)
          .sort((a, b) => a[1].localeCompare(b[1])) // Triez par nom de station
          .map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))
        }
      </select>
    </div>

      <div className='mt-8 overflow-x-auto'>
        <table {...getTableProps()} className='w-full'>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="border-b border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CheckTable;

import React, { useMemo, useState, useEffect } from "react";
import CardMenu from "../../../../components/card/CardMenu";
import Card from "../../../../components/card/index.jsx";
import {
  useTable,
} from "react-table";
import jsonData from '../../../../data/data.json'; // Vérifiez le chemin d'accès

const CheckTable = () => {
  const [selectedStation, setSelectedStation] = useState(Object.keys(jsonData)[0]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const pollutantsData = {};
    Object.entries(jsonData[selectedStation] || {}).forEach(([siteCode, pollutants]) => {
      Object.entries(pollutants).forEach(([pollutant, readings]) => {
        const validReadings = readings.filter(r => r[1] !== null && r[1] !== "").map(r => ({
          value: parseFloat(r[1]),
          date: r[0].split(' ')[0] // Ici on ne prend que la date sans l'heure
        }));
        if (!pollutantsData[pollutant]) {
          pollutantsData[pollutant] = { values: [], dates: [] };
        }
        validReadings.forEach(reading => {
          pollutantsData[pollutant].values.push(reading.value);
          pollutantsData[pollutant].dates.push(reading.date);
        });
      });
    });

    const averagedData = Object.entries(pollutantsData).map(([pollutant, data]) => {
      const sum = data.values.reduce((acc, value) => acc + value, 0);
      const average = (sum / data.values.length).toFixed(2);
      // Utiliser la date la plus récente disponible pour chaque polluant
      const mostRecentDate = data.dates.sort((a, b) => new Date(b) - new Date(a))[0];
      return {
        NAME: `${selectedStation} - ${pollutant}`,
        PROGRESS: `${average}%`,
        DATE: mostRecentDate
      };
    });

    setTableData(averagedData);
  }, [selectedStation]);

  const columns = useMemo(() => [
    {
      Header: 'NOM',
      accessor: 'NAME',
    },
    {
      Header: 'MOYENNE',
      accessor: 'PROGRESS',
    },
    {
      Header: 'DATE',
      accessor: 'DATE',
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: tableData,
    }
  );

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">Tableau de données des régions</div>
        <select onChange={e => setSelectedStation(e.target.value)} value={selectedStation}>
          {Object.keys(jsonData).map(station => (
            <option key={station} value={station}>{station}</option>
          ))}
        </select>
        <CardMenu />
      </header>

      <div className="mt-8 overflow-x-auto">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="border-b border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.render("Header")}
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
                      {cell.render("Cell")}
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
import React from "react";
import Card from "components/card";
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "variables/charts";
import LineChart from "components/charts/LineChart";

const TotalSpent = () => {
  return (
      <Card extra="!p-[20px] text-center">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Tableau de données des stations
          </div>

          <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
            <div className="flex flex-col">
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center justify-center">
                </div>
              </div>
            </div>
            <div className="h-full w-full">
              <LineChart
                  options={lineChartOptionsTotalSpent}
                  series={lineChartDataTotalSpent}
              />
            </div>
          </div>
      </Card>
);
};

export default TotalSpent;

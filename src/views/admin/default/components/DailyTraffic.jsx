import BarChart from "components/charts/BarChart2";
import { barChartDataDailyTraffic } from "variables/charts";
import { barChartOptionsDailyTraffic } from "variables/charts";
import Card from "components/card";
const DailyTraffic = () => {
  return (
    <Card extra="pb-7 p-[20px] h-6/7">
      <div className="flex flex-row justify-between">
        <div className="ml-1 pt-2">
          <p className="text-sm font-medium leading-4 text-gray-600">
            Graphique avec 
          </p>
          <p className="text-[34px] font-bold text-navy-700 dark:text-white">
            280{" "}
            <span className="text-sm font-medium leading-6 text-gray-600">
              stations en marche
            </span>
          </p>
        </div>
        <div className="mt-2 flex items-start">
          <div className="flex items-center text-sm text-green-500">
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full pt-10 pb-0">
        <BarChart
          chartData={barChartDataDailyTraffic}
          chartOptions={barChartOptionsDailyTraffic}
        />
      </div>
    </Card>
  );
};

export default DailyTraffic;

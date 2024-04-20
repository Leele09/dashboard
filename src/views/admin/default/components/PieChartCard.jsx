import PieChart from "C:/Users/kaisd/OneDrive/Documents/GitHub/dashboard/src/components/charts/PieChart.jsx";
import { pieChartData, pieChartOptions } from "C:/Users/kaisd/OneDrive/Documents/GitHub/dashboard/src/variables/charts.js";
import Card from "C:/Users/kaisd/OneDrive/Documents/GitHub/dashboard/src/components/card/index.jsx";  


const PieChartCard = ({ dataPercentages }) => {

    return (
        <Card extra="rounded-[20px] p-3">
            <div className="flex flex-row justify-between px-3 pt-2">
                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                    Taux de polluant
                </h4>
                <select className="text-sm font-bold text-gray-600 hover:cursor-pointer dark:bg-navy-800 dark:text-white">
                    <option value="monthly">Mois</option>
                    <option value="yearly">Année</option>
                    <option value="weekly">Semaine</option>
                </select>
            </div>
            <div className="flex h-[220px] w-full items-center justify-center">
                <PieChart options={pieChartOptions} series={pieChartData} />
            </div>
            <div className="flex flex-row justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:bg-navy-700 dark:shadow-none">
                <div className="flex flex-col items-center">
                    <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-brand-500" />
                        <p className="ml-1 text-sm text-gray-600">NO</p>
                    </div>
                    <p className="text-xl font-bold text-navy-700 dark:text-white">
                        17%
                    </p>
                </div>
                <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />
                <div className="flex flex-col items-center">
                    <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
                        <p className="ml-1 text-sm text-gray-600">System</p>
                    </div>
                    <p className="text-xl font-bold text-navy-700 dark:text-white">
                        25%
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default PieChartCard;

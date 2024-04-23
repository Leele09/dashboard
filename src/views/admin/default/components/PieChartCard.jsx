import PieChart from "../../../../components/charts/PieChart.jsx";
import { pieChartData, pieChartOptions } from "../../../../variables/charts.js";
import Card from "../../../../components/card/index.jsx";


const PieChartCard = ({ dataPercentages }) => {
        // Information sur les polluants à afficher en dessous du graphique en camembert
        const pollutantsInfo = [
            { label: "NO", percentage: 4.9, color: "#3498DB" }, // Bleu
            { label: "NO2", percentage: 11.5, color: "#2ECC71" }, // Vert
            { label: "O3", percentage: 44.9, color: "#F39C12" }, // Violet
            { label: "PM10", percentage: 11.1, color: "#9B59B6" }, // Rouge
            { label: "PM2.5", percentage: 6.3, color: "#3498DB" }, // Orange
            { label: "NOX as NO2", percentage: 19.1, color: "#E74C3C" }, // Rose
            // Ajoutez d'autres polluants ici si nécessaire
        ];

        return (
            <Card extra="rounded-[20px] p-3 h-2/3">
                <div className="flex flex-row justify-between px-3 pt-2 ">
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                        Pourcentage des polluants en France
                    </h4>
                </div>
                <div className="flex h-[220px] w-full items-center justify-center ">
                    <PieChart options={pieChartOptions} series={pieChartData} />
                </div>
                <div className="flex flex-col px-6 py-3 ">
                    {pollutantsInfo.map((pollutant, index) => (
                        <div key={index} className="flex items-center mt-2 ">
                        </div>
                    ))}
                </div>
            </Card>
        );
    };
    
    export default PieChartCard;
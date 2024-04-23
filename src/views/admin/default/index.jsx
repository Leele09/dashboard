import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataCheck } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import tableDataCheck from "./variables/tableDataCheck.json";

const Dashboard = () => {
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Nombre de station"}
          subtitle={"280"}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Polluant très Fréquents"}
          subtitle={"03"} //44721
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Population totale"}
          subtitle={"30128985"}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Carte du"}
          subtitle={"Monde"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Nombre de graphique"}
          subtitle={"4"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Fait par"}
          subtitle={"Upec"}
        />
      </div>

      {/* Charts */}

      <div className="h-30 w-30 mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />


      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="maxh-0p grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

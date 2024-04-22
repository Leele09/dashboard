import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import DataTables from "views/admin/tables";



// Icon Imports
import {
  MdHome,
  MdBarChart,
} from "react-icons/md";
import {FaLocationDot} from "react-icons/fa6";
import {RiQuestionLine} from "react-icons/ri";

const routes = [
  {
    name: "Tableau de bord",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Stations",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <FaLocationDot className="h-6 w-6" />,
    component: <DataTables />,
    secondary: true,
  },
  {
    name: "Tableau données brut",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },
  {
    name: "Documentation",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <RiQuestionLine className="h-6 w-6" />,
    component: <DataTables />,
    secondary: true,
  },
];
export default routes;

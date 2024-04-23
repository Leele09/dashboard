import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import DataTables from "views/admin/tables";

// Icon Imports
import {
  MdHome,
  MdBarChart,
  MdPerson,
} from "react-icons/md";
import Francemap from "./views/admin/Cart/components/Francemap";

const routes = [
  {
    name: "Page d'accueil",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Tableau des données",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },
  {
    name: "Carte de France",
    layout: "/admin",
    icon: <MdPerson className="h-6 w-6" />,
    path: "Cart",
    component: <Francemap />,
  },
];
export default routes;

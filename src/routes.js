import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
//import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import Cart from "views/admin/Cart"
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";

// Auth Imports
//import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";
import Francemap from "./views/admin/Cart/components/Francemap";
//import Cart from "./views/admin/Cart";

const routes = [
  {
    name: "Page d'accueil",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  //{
  //  name: "NFT Marketplace",
  //  layout: "/admin",
  //  path: "nft-marketplace",
  //  icon: <MdOutlineShoppingCart className="h-6 w-6" />,
  //  component: <NFTMarketplace />,
  //  secondary: true,
  //},
  {
    name: "Tableau des données",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Carte",
    layout: "/admin",
    icon: <MdPerson className="h-6 w-6" />,
    path: "Cart",
    component: <Francemap />,
  },
  //{
  //  name: "Sign In",
  //  layout: "/auth",
  //  path: "sign-in",
  //  icon: <MdLock className="h-6 w-6" />,
  //  component: <SignIn />,
  //},
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "rtl",
    icon: <MdHome className="h-6 w-6" />,
    component: <RTLDefault />,
  },
];
export default routes;

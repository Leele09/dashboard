import React from "react";
import Dropdown from "components/dropdown";
import {FiAlignJustify} from "react-icons/fi";
import {Link} from "react-router-dom";
import {BsArrowBarUp} from "react-icons/bs";
import {RiMoonFill, RiSunFill} from "react-icons/ri";
import {
  IoMdNotificationsOutline,
} from "react-icons/io";
import {dataBySite, dataByPolluant} from "../../data/API/interactionsServeur.js";

import jsonData from '../../data/stations.json';
const polluants = ["SO2", "C6H6", "NO", "NO2", "CO", "O3", "NOX as NO2", "PM10", "PM2.5"]

const Navbar = (props) => {
  const {onOpenSidenav, brandText} = props;
  const [darkmode, setDarkmode] = React.useState(false);

  return (
      <nav
          className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
        <div className="ml-[6px]">
          <div className="h-6 w-[224px] pt-1">
            <a
                className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
                href=" "
            >
              Pages
              <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
                /{" "}
            </span>
            </a>
            <Link
                className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
                to="#"
            >
              {brandText}
            </Link>
          </div>
          <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
            <Link
                to="#"
                className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
            >
              {brandText}
            </Link>
          </p>
        </div>

        <div
            className="relative mt-[3px] flex flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:flex-grow-0 md:gap-1">

          <button id="multiLevelDropdownButton" data-dropdown-toggle="multi-dropdown"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-2"
                  type="button">Stations <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true"
                                              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="m1 1 4 4 4-4"/>
          </svg>
          </button>

          <div id="multi-dropdown"
               className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200"
                aria-labelledby="multiLevelDropdownButton">
              {Object.entries(jsonData).map(([key, values]) => (
                  <li key={key}>
                    <button key={key} id={key} data-dropdown-toggle={`doubleDropdown${key}`}
                            data-dropdown-placement="right-start" type="button"
                            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      {key}
                      <svg className="w-2.5 h-2.5 ms-3 rtl:rotate-180" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m1 9 4-4-4-4"/>
                      </svg>
                    </button>
                    <div id={`doubleDropdown${key}`}
                         className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                      <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200"
                          aria-labelledby="doubleDropdownButton">
                        {values.map((value) => (
                            <li>
                              <input defaultChecked id={`site-checkbox${value}`} type="checkbox" value={value}
                                     className="ml-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                     onClick={dataBySite}
                              />
                              <label htmlFor={`site-checkbox${value}`}
                                     className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{value}
                              </label>
                            </li>
                        ))}
                      </ul>
                    </div>
                  </li>
              ))}
            </ul>
          </div>

          <button id="dropdownCheckboxButton" data-dropdown-toggle="dropdownDefaultCheckbox"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-1"
                  type="button">Polluants <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true"
                                               xmlns="http://www.w3.org/2000/svg" fill="none"
                                               viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="m1 1 4 4 4-4"/>
          </svg>
          </button>
          <div id="dropdownDefaultCheckbox"
               className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
            <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownCheckboxButton">
              {polluants.map((polluant) => (
                  <li>
                    <input defaultChecked id={`polluant-checkbox${polluant}`} type="checkbox" value={polluant}
                           className="ml-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                           onClick={dataByPolluant}
                    />
                    <label htmlFor={`polluant-checkbox${polluant}`}
                           className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{polluant}
                    </label>
                  </li>
              ))}
            </ul>
          </div>

          <span
              className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
              onClick={onOpenSidenav}
          >
          <FiAlignJustify className="h-5 w-5"/>
          </span>
          {/* start Notification */}
          <Dropdown
              button={
                <p className="cursor-pointer">
                  <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white"/>
                </p>
              }
              animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
              children={
                <div
                    className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-navy-700 dark:text-white">
                      Notification
                    </p>
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      Mark all read
                    </p>
                  </div>

                  <button className="flex w-full items-center">
                    <div
                        className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                      <BsArrowBarUp/>
                    </div>
                    <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                      <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                        New Update: Horizon UI Dashboard PRO
                      </p>
                      <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                        A new update for your downloaded item is available!
                      </p>
                    </div>
                  </button>

                  <button className="flex w-full items-center">
                    <div
                        className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                      <BsArrowBarUp/>
                    </div>
                    <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                      <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                        New Update: Horizon UI Dashboard PRO
                      </p>
                      <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                        A new update for your downloaded item is available!
                      </p>
                    </div>
                  </button>
                </div>
              }
              classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
          />
          <div
              className="ml-1 mr-1 cursor-pointer text-gray-600"
              onClick={() => {
                if (darkmode) {
                  document.body.classList.remove("dark");
                  setDarkmode(false);
                } else {
                  document.body.classList.add("dark");
                  setDarkmode(true);
                }
              }}
          >
            {darkmode ? (
                <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white"/>
            ) : (
                <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white"/>
            )}
          </div>
        </div>
      </nav>
  );
};

export default Navbar;

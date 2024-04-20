import React from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
} from "react-icons/io";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
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
            className="relative mt-[3px] flex h-[61px] w-3/4 items-center rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
          <div
              className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white ">
            <p className="pl-3 pr-2 text-xl">
              <FiSearch className="h-4 w-4 text-gray-400 dark:text-white"/>
            </p>
            <input
                type="text"
                placeholder="Rechercher..."
                className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
            />
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
                  <IoMdNotificationsOutline className="h-4 w-4 ml-2 text-gray-600 dark:text-white"/>
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
              className="cursor-pointer text-gray-600"
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

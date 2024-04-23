import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import routes from "routes.js";
import logoImage from '../../assets/img/logo/logo.png';

const Sidebar = ({ open, onClose }) => {
    return (
        <div
            className={`fixed !z-50 min-h-full flex flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white duration-175 linear ${
                open ? "translate-x-0" : "-translate-x-96"
            } sm:none md:!z-50 lg:!z-50 xl:!z-0`}
        >
      <span
          className="absolute top-4 right-4 block cursor-pointer xl:hidden"
          onClick={onClose}
      >
        <HiX />
      </span>

            <div className={`mx-[40px] mt-[50px] flex items-center`}>
                <img
                    src={logoImage}
                    alt="Logo"
                    className="h-10 w-10" // Ajustez la taille selon vos besoins
                />
                <div className="ml-2 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
                    Qualit '<span className="font-medium">AIR</span>
                </div>
            </div>
            <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
            {/* Nav items */}
            <ul className="mb-auto pt-1">
                <Links routes={routes} />
            </ul>

            {/* Nav item end */}
        </div>
    );
};

export default Sidebar;

import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GrBarChart } from "react-icons/gr";
import logo from "../../../assets/logo.png";

import { AiOutlineHome } from "react-icons/ai";
import { PiStudent } from "react-icons/pi";
import { VscOrganization } from "react-icons/vsc";
import useAuthStore from "../../../stores/useAuthStore";

const Header: React.FC = () => {

  const headerHeight = "72px";

  return (
    <Link to={'/'}>
      <div
        className="flex lg:space-x-3 justify-between lg:px-8 border-b border-gray-300 items-center p-2"
        style={{ height: headerHeight }}
      >
        <img src={logo} alt="logo" />

      </div>
    </Link>
  );
};

interface MenuItemProps {
  title: string;
  to: string;
  active?: boolean;
  children: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, to, active, children }) => {
  const activeClass = active
    ? " lg:rounded-md text-white bg-primary"
    : " text-white lg:rounded-md hover:text-white hover:bg-primary";

  return (
    <Link
      to={to}
      replace
      className={
        "lg:mx-2 py-4 lg:py-3 lg:px-3 flex justify-center lg:justify-start space-x-4 items-center truncate" +
        activeClass
      }
    >
      {children}
      <span className="hidden lg:inline">{title}</span>
    </Link>
  );
};

const SideMenu: React.FC = () => {
  const { user } = useAuthStore()

  const itemIconClass = "w-8 h-8 lg:w-5 lg:h-5";

  const location = useLocation();

  useEffect(() => { }, [location]);
  console.log(location.pathname);


  return (
    <div className="overflow-y-auto h-screen bg-background space-y-4">
      <Header />

      <ul className="lg:mt-2 lg:space-y-2">
        <MenuItem
          to="profile"
          title="Profile"
          active={location.pathname === "/dashboard/profile"}
        >
          <AiOutlineHome className={itemIconClass} />
        </MenuItem>

        <MenuItem
          to="analytics"
          title="Analytics"
          active={location.pathname === "/dashboard/analytics"}
        >
          <GrBarChart className={itemIconClass} />
        </MenuItem>


        {user?.accountType === "admin" && <>
          <MenuItem
            to="students"
            title="Students"
            active={location.pathname === "/dashboard/students"}
          >
            <PiStudent className={itemIconClass} />
          </MenuItem>

          <MenuItem
            to="companies"
            title="Companies"
            active={location.pathname === "/dashboard/companies"}
          >
            <VscOrganization className={itemIconClass} />
          </MenuItem>
        </>
        }
      </ul>
    </div>
  );
};

export default SideMenu;

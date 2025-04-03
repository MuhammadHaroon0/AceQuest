import UserAvatar from "./profile.png";
import {
  FiSearch,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";

const NavBar: React.FC = () => {
  const navBarHeight = 71;
  const location = useLocation();

  return (
    <nav
      className="flex items-center space-x-4 shadow w-full px-5 absolute bg-white z-30"
      style={{ height: navBarHeight }}
    >
      {/* Search Bar */}
      <div className="inline-flex flex-1 gap-4 items-center">
        <h1 className="hidden md:block text-xl text-black font-medium capitalize">{(location.pathname.substring(11))}</h1>
        <div className="relative lg:w-1/3">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full border border-theme2 rounded-sm font-light focus:ring-0 focus:border-theme1 pl-10 py-1 placeholder-gray-500"
            placeholder="Search..."
          />
        </div>
      </div>


      <div className="flex-1 md:flex-none"></div>

      {/* Notification Icon */}
      <a href="#!" className="relative text-theme1 hover:text-primary">
        <span className="absolute top-0 right-0 w-2 h-2 bg-theme1 rounded-full"></span>
        <FiBell className="w-6 h-6" />
      </a>

      {/* User Menu */}
      <Menu as="div" className="relative inline-block text-left ">
        <div>
          <Menu.Button className="inline-flex justify-center w-full items-center text-theme1 hover:text-primary focus:outline-none">
            <img className="rounded-full w-8 h-8" src={UserAvatar} alt="User Avatar" />
            <FiChevronDown className="w-5 h-5" aria-hidden="true" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? "bg-indigo-600 text-primary" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    <FiUser className="w-5 h-5 mr-2" aria-hidden="true" />
                    Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? "bg-indigo-600 text-primary" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    <FiSettings className="w-5 h-5 mr-2" aria-hidden="true" />
                    Settings
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? "bg-indigo-600 text-primary" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    <FiLogOut className="w-5 h-5 mr-2" aria-hidden="true" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </nav>
  );
};

export default NavBar;

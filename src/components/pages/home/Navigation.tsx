import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SkewLoader } from "react-spinners";
import { css } from "@emotion/react";
import { useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../features/auth/authSlice';

import { sections } from "./Home";

interface NavigationProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const override = css`
  display: inline-block;
  top: 4px;
`;

const Navigation: React.FC<NavigationProps> = ({
  isAuthenticated,
  isLoading,
}) => {

    const [expanded, setExpanded] = useState(false);
    const dispatch = useAppDispatch();

  return (
    <nav className="fixed w-full top-0 left-0 z-50 max-w-full font-roboto bg-white">
      <div className="flex justify-between md:justify-around items-center py-2 px-4 border-b border-gray-300 my-0 md:mx-5">
        <div className="hidden md:block md:invisible">AE</div>
        <div className="flex justify-start items-center">
          <ul className={`flex flex-col md:flex-row absolute md:relative left-0 top-full md:top-0 justify-between w-full text-sm bg-white overflow-hidden transition-all duration-500 ${expanded? 'max-h-80': 'max-h-0'} md:max-h-full`}>
            {sections.map((section, index) => {
              const { name, title } = section;
              return (
                <li key={index}>
                  <a className="inline-block p-2 text-gray-600 hover:text-gray-900 transition-colors duration-500" href={`#${name}`}>{title}</a>
                </li>
              );
            })}
          </ul>
          <button
            className="self-center border-4 border-green-700 md:hidden focus:outline-none"
            onClick={() => setExpanded(!expanded)}
          >
            <div className={`w-6 h-1 m-1 bg-green-700 transition-all duration-500 transform ${expanded? '-rotate-45 translate-y-2': ''}`} />
            <div className={`w-6 h-1 m-1 bg-green-700 transition-all duration-500 ${expanded? 'opacity-0': ''}`} />
            <div className={`w-6 h-1 m-1 bg-green-700 transition-all duration-500 transform ${expanded? 'rotate-45 -translate-y-2': ''}`} />
          </button>
        </div>
        <div className="text-sm font-bold">
          {isLoading ? (
            <SkewLoader
              color="#333"
              loading={isLoading}
              size="24px"
              css={override}
            />
          ) : isAuthenticated ? (
            <>
              <button 
                className="text-gray-500 font-bold hover:text-gray-700 mr-4"
                onClick={() => dispatch(logout())}
              >Logout</button>
              <Link className="text-gray-500 hover:text-gray-700" to="/dashboard">Dashboard</Link>
            </>
          ) : (
            <>
              <Link className="text-gray-500 hover:text-gray-700 mr-6" to="/login">Sign In</Link>
              <Link className="text-gray-700 bg-gray-300 hover:text-gray-900 px-5 py-2" to="/register">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation
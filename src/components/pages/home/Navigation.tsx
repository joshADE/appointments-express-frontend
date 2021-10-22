import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { SkewLoader } from "react-spinners";
import { css } from "@emotion/react";
import { useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../features/auth/authSlice';
import logo from '../../../assets/logo.png';
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import { sections } from "./Home";

interface NavigationProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentSection: string;
}

const override = css`
  display: inline-block;
  top: 4px;
`;

const Navigation: React.FC<NavigationProps> = ({
  isAuthenticated,
  isLoading,
  currentSection,
}) => {
  console.log("rerendered nav")

    const [expanded, setExpanded] = useState(false);
    const dispatch = useAppDispatch();
    const [navClasses, setNavClasses] = useState('md:bg-transparent border-0 md:mx-5');

    useScrollPosition(
      ({ prevPos, currPos }) => {
        const isAtTop = -1 * currPos.y < 50;
    
        const shouldBeStyle = `
          ${isAtTop ? 'md:bg-transparent border-0 md:mx-5' : 'bg-white border-b border-gray-300 md:mx-0'}
        `;
    
        if (shouldBeStyle === navClasses) return;
    
        setNavClasses(shouldBeStyle);
      },
      [navClasses]
    )



  return (
    <nav className="fixed w-full top-0 left-0 z-50 max-w-full font-roboto">
      <div className={`flex justify-between md:justify-around items-center py-2 px-4 my-0 transition-all duration-200 ease-in ${navClasses}`}>
        <div className="hidden md:block">
          <Link 
              to="/"
              className="text-center"
          ><img src={logo} alt="logo" className="h-20 mx-auto" /></Link>
        </div>
        <div className="flex justify-start items-center">
          <ul className={`flex flex-col md:flex-row absolute md:relative left-0 top-full md:top-0 bg-white md:bg-transparent justify-between w-full text-sm overflow-hidden transition-all duration-500 ${expanded? 'max-h-80': 'max-h-0'} md:max-h-full`}>
            {sections.map((section, index) => {
              const { name, title } = section;
              return (
                <li key={index}>
                  <a className={`${currentSection === name? 'text-green-500': 'text-gray-600'} inline-block p-2 hover:text-gray-900 transition-colors duration-500`} href={`#${name}`}>{title}</a>
                </li>
              );
            })}
          </ul>
          <button
            className={`self-center border-4 border-green-400 md:hidden rounded-lg focus:outline-none`}
            onClick={() => setExpanded(!expanded)}
          >
            <div className={`w-6 h-1 m-1 rounded-lg bg-green-400 transition-all duration-500 transform ${expanded? '-rotate-45 translate-y-2': ''}`} />
            <div className={`w-6 h-1 m-1 rounded-lg bg-green-400 transition-all duration-500 ${expanded? 'opacity-0': ''}`} />
            <div className={`w-6 h-1 m-1 rounded-lg bg-green-400 transition-all duration-500 transform ${expanded? 'rotate-45 -translate-y-2': ''}`} />
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
              <Link className="text-gray-700 rounded-lg bg-gray-300 hover:text-gray-900 px-5 py-2" to="/register">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default memo(Navigation);
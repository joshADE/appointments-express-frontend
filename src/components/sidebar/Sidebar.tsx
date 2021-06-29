import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import ProfileNav from '../pages/auth/ProfileNav';
import { SidebarData } from './SidebarData'

const isActive = (path: string, match: any, location: any) => !!(match || path === location.pathname);

class Sidebar extends React.Component {

    render(){
        return (
            <nav 
                className="w-24 lg:hover:w-48 group h-full flex flex-col items-center justify-around p-0 z-10 transition-all duration-300 ease-linear border-r border-gray-400"
            >

                <Link 
                    to="/"
                    className="font-mono text-center text-green-900 rounded-lg border-2 border-green-900 w-8 hover:bg-green-100"
                >AE</Link>

                <ul
                    className="flex flex-col items-center justify-center m-5"
                >
                    {SidebarData.map((item, index) => {
                        return (
                            <li 
                                key={index} 
                                className=" flex items-center justify-center rounded-lg p-2 mb-6 w-3/4 bg-white text-black"
                            >
                                <NavLink exact title={item.title} className="flex" to={item.path} activeClassName="text-green-800" isActive={isActive.bind(this,item.path)}>
                                    <span
                                        className="text-xl mr-1 flex items-center"
                                    >{item.icon}</span>
                                    <span
                                        className="text-sm truncate w-0 lg:group-hover:w-32 transition-all duration-300 ease-linear"
                                    >{item.title}</span>
                                </NavLink>
                            </li>
                        )
                    }, this)}
                </ul>

                <ProfileNav />
            </nav>
        )
    }
}

export default Sidebar

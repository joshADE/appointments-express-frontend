import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { SidebarData } from './SidebarData'
import logo from '../../assets/logo.png'
import * as FiIcons from 'react-icons/fi'
import { connect, ConnectedProps } from 'react-redux'
import { logout } from '../../features/auth/authSlice';
const isActive = (path: string, match: any, location: any) => !!(match || path === location.pathname);

class Sidebar extends React.Component<SidebarProps, {}> {

    render(){
        return (
            <nav 
                className="w-24 lg:w-48 flex flex-col justify-center h-full p-0 z-10 border-2 border-gray-300 rounded-r-lg"
            >

                <Link 
                    to="/"
                    className="text-center h-1/6 pt-10"
                ><img src={logo} alt="logo" className="w-20 mx-auto" /></Link>
                <div className="flex flex-col items-center lg:items-start justify-between h-5/6 pt-10">
                    <ul
                        className="flex flex-col justify-center m-5"
                    >
                        {SidebarData.map((item, index) => {
                            return (
                                <li 
                                    key={index} 
                                    className="flex justify-center rounded-lg mb-12 w-min bg-white text-gray-600 hover:text-black"
                                >
                                    <NavLink exact title={item.title} className="flex" to={item.path} activeClassName="text-green-800" isActive={isActive.bind(this,item.path)}>
                                        <span
                                            className="text-xl mr-3 flex items-center"
                                        >{item.icon}</span>
                                        <span
                                            className="text-sm truncate w-0 lg:w-32"
                                        >{item.title}</span>
                                    </NavLink>
                                </li>
                            )
                        }, this)}
                    </ul>
                    <div className="flex flex-col justify-center m-5 mb-20">
                        <div className="flex justify-center w-min bg-white text-gray-600 hover:text-black">
                            <button
                                onClick={() => this.props.logout()}
                                className="flex"
                            >
                                <FiIcons.FiLogOut 
                                    className="text-xl mr-3 flex items-center"
                                />
                                <span
                                    className="text-sm truncate w-0 lg:w-min"
                                >Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

const actionCreators = { 
    logout
}

const connector = connect(null, actionCreators);
type SidebarProps = ConnectedProps<typeof connector>;

export default connector(Sidebar)

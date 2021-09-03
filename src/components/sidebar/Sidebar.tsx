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
                className="w-24 lg:w-48 flex flex-col justify-center h-full p-0 z-10 rounded-lg bg-white shadow font-montserrat"
            >

                <Link 
                    to="/"
                    className="text-center h-1/6 pt-10"
                ><img src={logo} alt="logo" className="w-20 mx-auto" /></Link>
                <div className="flex flex-col items-center lg:items-start justify-between h-5/6 pt-10">
                    <ul
                        className="flex flex-col justify-center w-3/4 mx-auto"
                    >
                        {SidebarData.map((item, index) => {
                            return (
                                <li 
                                    key={index} 
                                    className="flex justify-center lg:justify-start rounded-lg mb-5 bg-white text-gray-600 px-2 py-4 hover:bg-green-50"
                                >
                                    <NavLink exact title={item.title} className="flex truncate" to={item.path} activeClassName="text-green-800" isActive={isActive.bind(this,item.path)}>
                                        <span
                                            className="text-xl mx-auto lg:mx-0 lg:mr-3"
                                        >{item.icon}</span>
                                        <span
                                            className="text-sm w-0 truncate lg:w-min"
                                        >{item.title}</span>
                                    </NavLink>
                                </li>
                            )
                        }, this)}
                    </ul>
                    <div className="flex flex-col justify-center mb-20 w-3/4 mx-auto">
                        <div className="flex justify-center lg:justify-start rounded-lg bg-white text-gray-600 px-2 py-4 hover:bg-green-50">
                            <button
                                onClick={() => this.props.logout()}
                                className="flex truncate"
                            >
                                <FiIcons.FiLogOut 
                                    className="text-xl mx-auto lg:mx-0 lg:mr-3"
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

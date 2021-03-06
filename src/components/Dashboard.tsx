import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'
import ManageAccount from './pages/manageaccount/ManageAccount';
import ManageAppointment from './pages/manageappointment/ManageAppointment';
import ManageRole from './pages/managerole/ManageRole';
import ManageStore from './pages/managestore/ManageStore';
import Sidebar from './sidebar/Sidebar';

const Dashboard : React.FC<RouteComponentProps> = ({ match }) => {
    return (
        <div
            className="w-screen h-screen flex p-3 bg-gray-100"
        >
            <Sidebar />
            
            <Route exact path={match.url} component={ManageStore} />
            <Route exact path={match.url + '/appointments'} component={ManageAppointment} />
            <Route path={match.url + '/roles'} component={ManageRole} />
            <Route path={match.url + '/account'} component={ManageAccount} />
            <Route path={match.url + '/test'} component={() => <>Test</>} />
            
        </div>
    )
}

export default Dashboard 

import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'
import ManageStore from './pages/managestore/ManageStore';
import Sidebar from './sidebar/Sidebar';

const Dashboard : React.FC<RouteComponentProps> = ({ match }) => {
    return (
        <div
            className="w-screen h-screen flex"
        >
            <Sidebar />
            
            <Route exact path={match.url} component={ManageStore} />
            <Route path={match.url + '/test'} component={() => <>Test</>} />
            
        </div>
    )
}

export default Dashboard 

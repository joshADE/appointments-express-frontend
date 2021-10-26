import React from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks';
import { selectIsCustomerAuthenticated } from '../features/customerAuth/customerAuthSlice';
import LoginCustomer from './pages/auth/LoginCustomer'
import ProtectedRoute from './pages/auth/ProtectedRoute';
import UnprotectedRoute from './pages/auth/UnprotectedRoute';
import AppointmentDetails from './pages/customerview/appointmentdetails/AppointmentDetails';
import ViewAppointments from './pages/customerview/viewappointments/ViewAppointments';

const CustomerDashboard: React.FC<RouteComponentProps> = ({
    match
}) => {
    const { customerId } = useParams<{customerId: string}>();
    const isAuthenticated = useAppSelector(selectIsCustomerAuthenticated);

    const numberCustomerId = Number(customerId);

    return (
        isNaN(numberCustomerId)?
        <div className="w-screen h-screen">
            <p className="text-center">
                That is an invalid customer Id. Try Again.
            </p>
        </div>
        :
        <div className="w-screen h-screen">
            <UnprotectedRoute exact path={match.url} isAuthenticated={isAuthenticated} redirectPath={match.url + '/view'}> 
                <LoginCustomer 
                    customerId={numberCustomerId}
                />
            </UnprotectedRoute>
            <ProtectedRoute exact path={match.url + '/view'} isAuthenticated={isAuthenticated} authenticationPath={match.url}>
                <ViewAppointments 
                    url={match.url + '/view'}
                />
            </ProtectedRoute>
            <ProtectedRoute path={match.url + '/view/:id'} isAuthenticated={isAuthenticated} authenticationPath={match.url}>
                <AppointmentDetails
                    url={match.url + '/view'}
                />
            </ProtectedRoute>
        </div>
    )
}

export default CustomerDashboard
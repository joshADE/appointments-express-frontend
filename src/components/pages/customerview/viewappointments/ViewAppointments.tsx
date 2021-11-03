import moment from 'moment';
import React from 'react'
import { Link } from 'react-router-dom';
import { SkewLoader } from 'react-spinners';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useGetCustomerAppointmentsQuery } from '../../../../app/services/appointments';
import { AppointmentStatus } from '../../../../features/appointment/appointmentTypes';
import { logoutCustomer } from '../../../../features/customerAuth/customerAuthSlice';
import { Button } from '../../../shared/Button';
import CustomerNav from '../../auth/CustomerNav';

interface ViewAppointmentsProps {
    url: string;
}

const className = "border border-gray-300 text-gray-600 p-2";

const ViewAppointments: React.FC<ViewAppointmentsProps> = ({
    url,
}) => {
    const customer = useAppSelector(state => state.customerAuth.customer);
    const dispatch = useAppDispatch();

    const { data: allAppointments, isFetching, isLoading, error } = useGetCustomerAppointmentsQuery(customer?.id!, { skip: customer === null });

        return (
        <div className="p-3 bg-gray-100 h-full relative flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        type="button"
                        className="text-gray-500 hover:text-gray-900"
                        onClick={() => dispatch(logoutCustomer())}
                    >Exit</Button>
                </div>
                <CustomerNav />
            </div>
            {(isFetching || isLoading) && 
            <div className="absolute right-0 bottom-0">
                <SkewLoader
                    color="#333"
                    loading={isFetching || isLoading}
                    size="20px"
                />
            </div>}
            <div className="bg-white rounded-lg shadow p-5 mt-3 font-montserrat h-full overflow-auto">
                {error? 
                <div className="h-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 whitespace-pre-wrap">
                    Error fetching data from the server:{" "}
                    <div className="text-left w-20 mx-auto">
                        {JSON.stringify(error, null, 2)}
                    </div>
                    If the status is 401 try refreshing the page and relogging
                </div>:
                
                <table className="mx-auto text-sm">
                    <thead>
                        <tr>
                            <td className={`${className} font-bold bg-green-50 rounded-l-md pl-4`}>Title</td>
                            <td className={`${className} font-bold bg-green-50`}>Description</td>
                            <td className={`${className} font-bold bg-green-50`}>Start</td>
                            <td className={`${className} font-bold bg-green-50`}>End</td>
                            <td className={`${className} font-bold bg-green-50`}>Status</td>
                            <td className={`${className} font-bold bg-green-50 rounded-r-md pr-4`}>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allAppointments && allAppointments.map(app => (
                                <tr key={app.id}>
                                    <td className={className}>{app.title}</td>
                                    <td className={className}>{app.description? app.description: "None"}</td>
                                    <td className={className}>{moment(app.start, "YYYY-MM-DD[T]HH:mm:ss").format("lll")}</td>
                                    <td className={className}>{moment(app.end, "YYYY-MM-DD[T]HH:mm:ss").format("lll")}</td>
                                    <td className={className}>{AppointmentStatus[app.status]}</td>
                                    <td className={className}>
                                        <Link to={`${url}/${app.id}`} className="hover:underline text-green-300 hover:text-green-500">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                }
            </div>

        </div>);
}

export default ViewAppointments;
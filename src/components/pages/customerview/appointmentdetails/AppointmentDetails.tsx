import moment from 'moment';
import React from 'react'
import { Link, useParams } from 'react-router-dom';
import { SkewLoader } from 'react-spinners';
import { useGetAppointmentAndStoreDetailsQuery } from '../../../../app/services/appointments';
import { AppointmentAndStore, AppointmentStatus } from '../../../../features/appointment/appointmentTypes';
import CustomerNav from '../../auth/CustomerNav';
import { MdArrowBack } from 'react-icons/md';

interface AppointmentDetailsProps {
    url: string;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
    url,
}) => {
    const { id } = useParams<{id: string}>();
    const numberId = Number(id);
    const { data: appointmentAndStore, isLoading, isFetching, error } = useGetAppointmentAndStoreDetailsQuery(numberId, {skip: isNaN(numberId)});
        return (
        <div className="p-3 bg-gray-100 h-full relative flex flex-col font-montserrat">
            <div className="flex items-center justify-between">
                <div className="mr-2 text-sm">
                    <div className="mb-1">Viewing details of appointment: <span className="font-bold">{appointmentAndStore? appointmentAndStore.appointment.title: "..."}</span></div>
                    <Link to={url} className="text-gray-500 hover:text-gray-800 rounded bg-gray-300 w-max px-2 py-0.5 flex items-center"><MdArrowBack className="flex-none mr-1" /><span>Go back</span></Link>
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

            <div className="bg-white rounded-lg shadow p-5 mt-3 h-full overflow-auto">
                {error? 
                <div className="h-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 whitespace-pre-wrap">
                    Error fetching data from the server:{" "}
                    <div className="text-left w-20 mx-auto">
                        {JSON.stringify(error, null, 2)}
                    </div>
                    If the status is 401 try refreshing the page and relogging
                </div>:
                <div className="h-full">
                    {appointmentAndStore ? 
                    <DetailsSection appointmentAndStore={appointmentAndStore} />
                    :
                    <div>
                        That appointment might not exist. Try again
                    </div>
                    }
                </div>
                }
            </div>

        </div>);
}

export default AppointmentDetails;

interface DetailsSectionProps {
    appointmentAndStore: AppointmentAndStore;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({
    appointmentAndStore,
}) => {
    const { 
        appointment: {
            title,
            description,
            start,
            end,
            status,
            createdAt,
        }, 
        store: {
            name,
            location,
        } 
    } = appointmentAndStore;
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailBlock 
                heading="Title"
                content={title}
            />
            <DetailBlock 
                heading="Description"
                content={description? description: "None"}
            />
            <DetailBlock 
                heading="Start Date / Time"
                content={moment(start, "YYYY-MM-DD[T]HH:mm:ss").format("lll")}
            />
            <DetailBlock 
                heading="End Date / Time"
                content={moment(end, "YYYY-MM-DD[T]HH:mm:ss").format("lll")}
            />
            <DetailBlock 
                heading="Status"
                content={AppointmentStatus[status]}
            />
            <DetailBlock 
                heading="Sheduled On"
                content={moment(createdAt, "YYYY-MM-DD[T]HH:mm:ss").format("lll")}
            />
            <DetailBlock 
                heading="Store Name"
                content={name}
            />
            <DetailBlock 
                heading="Store Location"
                content={location}
            />
        </div>);
}


interface DetailBlockProps {
    heading: string;
    content: string;
}

const DetailBlock: React.FC<DetailBlockProps> = ({
    heading,
    content,
}) => {
    return (
        <div className="border border-gray-200 p-2">
            <h6 className="text-lg font-bold text-gray-700">{heading}</h6>
            <div className="text-sm text-gray-400">{content}</div>
        </div>);
}

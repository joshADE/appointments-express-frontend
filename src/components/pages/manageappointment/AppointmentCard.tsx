import moment from 'moment';
import React, { memo } from 'react'
import { Appointment, AppointmentStatus } from '../../../features/appointment/appointmentTypes';







interface AppointmentCardProps {
    appointment: Appointment;
    updatedStatus?: AppointmentStatus;
    updateStatus: (id: number, newStatus: AppointmentStatus) => void;
}


const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    updatedStatus,
    updateStatus,
}) => {
    const { id, title, description, start, end, status } = appointment;

    
    const desc = description? description: "None";
    const statusWithUpdate = updatedStatus !== undefined ? updatedStatus : status;



    const getStatusOptions: (currentStatus: AppointmentStatus) => JSX.Element = (current) => {
        switch(current){
            case AppointmentStatus.pending:
                return <>
                    <StatusOptionButton 
                        className="border-green-700 text-green-700 hover:text-white hover:bg-green-700"
                        onClick={() => updateStatus(id, AppointmentStatus.accepted)}
                    >
                        Accept
                    </StatusOptionButton>
                    <StatusOptionButton 
                        className="border-red-700 text-red-700 hover:text-white hover:bg-red-700"
                        onClick={() => updateStatus(id, AppointmentStatus.declined)}
                    >
                        Decline
                    </StatusOptionButton>
                </>;
            case AppointmentStatus.complete:
                    return <>
                    <StatusOptionButton 
                        className=""
                        onClick={() => updateStatus(id, AppointmentStatus.accepted)}
                    >
                        Revert
                    </StatusOptionButton>
                    </>;
            case AppointmentStatus.declined:
                return <>
                    <StatusOptionButton 
                        className=""
                        onClick={() => updateStatus(id, AppointmentStatus.pending)}
                    >
                        Revert
                    </StatusOptionButton>
                </>;
            case AppointmentStatus.accepted:
                return <>
                    <StatusOptionButton 
                        className="border-blue-700 text-blue-700 hover:bg-blue-700"
                        onClick={() => updateStatus(id, AppointmentStatus.complete)}
                    >
                        Complete
                    </StatusOptionButton>
                    <StatusOptionButton 
                        className=""
                        onClick={() => updateStatus(id, AppointmentStatus.pending)}
                    >
                        Revert
                    </StatusOptionButton>
                </>;
        }
    } 


        return (
        <div className={`w-full md:w-96 h-96 md:h-48 rounded-lg border border-gray-400 mb-3 md:mr-3 flex flex-col flex-wrap p-3 ${updatedStatus !== undefined ? 'border-primary':''}`}>
            <div className="w-1/2 text-gray-400 text-sm"><h6 className="text-gray-600 font-bold text-base">Title</h6><div className="truncate" title={title}>{title}</div></div>
            <div className="w-1/2 text-gray-400 text-sm"><h6 className="text-gray-600 font-bold text-base">Description</h6><div className="truncate" title={desc}>{desc}</div></div>
            <div className="w-1/2 text-gray-400 text-sm"><h6 className="text-gray-600 font-bold text-base">Status</h6>{AppointmentStatus[statusWithUpdate]}</div>
            <div className="w-1/2 text-gray-400 text-sm"><h6 className="text-gray-600 font-bold text-base">Start</h6>{moment(start, "YYYY-MM-DD[T]HH:mm:ss").format("lll")}</div>
            <div className="w-1/2 text-gray-400 text-sm"><h6 className="text-gray-600 font-bold text-base">End</h6>{moment(end, "YYYY-MM-DD[T]HH:mm:ss").format("lll")}</div>
            <div className="w-1/2 flex flex-col">
                {getStatusOptions(statusWithUpdate)}
            </div>
        </div>);
}

export default memo(AppointmentCard);


interface StatusOptionButtonProps {
    onClick?: () => void;
    className?: string;
}

const StatusOptionButton: React.FC<StatusOptionButtonProps> = ({
    onClick,
    className,
    children
}) => {
    return (
        <button
            onClick={onClick}
            className={`w-min text-xs mb-1 font-montserrat rounded px-3 py-1 border border-gray-700 text-gray-700 bg-white hover:text-white hover:bg-gray-700 focus:outline-none ${className}`}
        >
            {children}
        </button>
    )
}
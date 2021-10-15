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


        return (
        <div className={`w-full md:w-96 h-96 md:h-48 rounded border shadow mb-3 md:mr-3 flex flex-col flex-wrap p-3 ${updatedStatus !== undefined ? 'border-primary':''}`}>
            <div className="w-1/2 text-gray-400 text-sm"><h6 className="text-gray-600 font-bold text-base">Title</h6><div className="truncate" title={title}>{title}</div></div>
            <div className="w-1/2 text-gray-400 text-sm"><h6 className="text-gray-600 font-bold text-base">Description</h6><div className="truncate" title={desc}>{desc}</div></div>
            <div className="w-1/2 text-gray-400 text-sm">
                <h6 className="text-gray-600 font-bold text-base">Status</h6>
                <div className="flex items-center">
                    <VisualStatusIndicator currentStatus={statusWithUpdate} />
                    <span className="font-bold">{AppointmentStatus[statusWithUpdate]}</span>
                </div>
            </div>
            <div className="w-1/2 text-gray-400 text-sm"><h6 className="text-gray-600 font-bold text-base">Start</h6>{moment(start, "YYYY-MM-DD[T]HH:mm:ss").format("lll")}</div>
            <div className="w-1/2 text-gray-400 text-sm"><h6 className="text-gray-600 font-bold text-base">End</h6>{moment(end, "YYYY-MM-DD[T]HH:mm:ss").format("lll")}</div>
            <div className="w-1/2 flex flex-wrap mt-1">
                <StatusOptions 
                    currentStatus={statusWithUpdate}
                    id={id}
                    updateStatus={updateStatus}
                />
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
            className={`w-min text-xs mb-1 font-montserrat rounded-lg px-3 py-1 border text-green-400 bg-green-50 hover:text-green-500 focus:outline-none ${className}`}
        >
            {children}
        </button>
    )
}


interface StatusOptionsProps {
    currentStatus: AppointmentStatus;
    id: number;
    updateStatus: (id: number, newStatus: AppointmentStatus) => void;
}

const StatusOptions: React.FC<StatusOptionsProps> = ({
    currentStatus,
    id,
    updateStatus
}) => {
    switch(currentStatus){
        case AppointmentStatus.pending:
            return <>
                <StatusOptionButton 
                    className="mr-1"
                    onClick={() => updateStatus(id, AppointmentStatus.accepted)}
                >
                    Accept
                </StatusOptionButton>
                <StatusOptionButton 
                    className=""
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
                    className="mr-1"
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


interface VisualStatusIndicatorProps {
    currentStatus: AppointmentStatus;
}

const VisualStatusIndicator: React.FC<VisualStatusIndicatorProps> = ({
    currentStatus
}) => {
    switch(currentStatus){
        case AppointmentStatus.pending:
            return <span className="rounded-full w-3 h-3 inline-block mr-2 bg-yellow-300" />;
        case AppointmentStatus.complete:
            return <span className="rounded-full w-3 h-3 inline-block mr-2 bg-blue-700" />;
        case AppointmentStatus.declined:
            return <span className="rounded-full w-3 h-3 inline-block mr-2 bg-red-700" />;
        case AppointmentStatus.accepted:
            return <span className="rounded-full w-3 h-3 inline-block mr-2 bg-green-700" />;
        
    }

}
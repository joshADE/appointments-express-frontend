import moment from 'moment';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useUpdateAppointmentsStatusMutation } from '../../../app/services/appointments';
import { Appointment, AppointmentStatus, UpdateAppointmentStatusRequest } from '../../../features/appointment/appointmentTypes';
import { StoreWithDetails } from '../../../features/store/storeTypes';
import Checkbox from '../../shared/Checkbox';
import Select from '../../shared/Select';
import AppointmentCard from './AppointmentCard';

const sortingOptions = [
    { label: 'No Sorting', value: 0 },
    { label: 'Date Created Asc.', value: 1 },
    { label: 'Date Created Des.', value: 2 },
    { label: 'Start Date/Time Asc.', value: 3 },
    { label: 'Start Date/Time Des.', value: 4 },
]

const compareAsc = (dateStringA: string, dateStringB: string) => {
    const dateA = moment(dateStringA, "YYYY-MM-DD[T]HH:mm:ss");
    const dateB = moment(dateStringB, "YYYY-MM-DD[T]HH:mm:ss");

    if (dateA.isSame(dateB)){
        return 0;
    } else if (dateA > dateB){
        return 1;
    } else {
        return -1;
    }
}

const compareDes = (dateStringA: string, dateStringB: string) => {
    const dateA = moment(dateStringA, "YYYY-MM-DD[T]HH:mm:ss");
    const dateB = moment(dateStringB, "YYYY-MM-DD[T]HH:mm:ss");

    if (dateA.isSame(dateB)){
        return 0;
    } else if (dateA < dateB){
        return 1;
    } else {
        return -1;
    }
}

const initialStatusFilter: Record<AppointmentStatus, boolean> = {
    [AppointmentStatus.pending]: true, 
    [AppointmentStatus.complete]: true, 
    [AppointmentStatus.declined]: true, 
    [AppointmentStatus.accepted]: true, 
}


interface ListViewProps {
    selectedStore: StoreWithDetails;
    storeAppointments: Appointment[] | undefined;
}

const ListView: React.FC<ListViewProps> = ({
    selectedStore,
    storeAppointments,
}) => {
    const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
    const [sortingValue, setSortingValue] = useState(0);
    const [statusUpdates, setStatusUpdates] = useState<{[id: number]:AppointmentStatus}>({}); // contains all the appointments that have all their status updated
    const [sendUpdates, { isLoading: isUpdatingStatus} ] = useUpdateAppointmentsStatusMutation();

    const toggleStatusFilter = (e : boolean, status: AppointmentStatus) => {
        setStatusFilter(curr => ({...curr, [status]: e}));
    }

    useEffect(() => {
        setStatusUpdates({});
    }, [selectedStore])

    const saveStatusUpdates = async () => {
        // send updates to the database

        const payload: UpdateAppointmentStatusRequest[] = Object.entries(statusUpdates).map(update => ({ appointmentId: Number(update[0]), newStatus: update[1] }));
        try {
            await sendUpdates({id: selectedStore.store.id, data: payload }).unwrap();
            setStatusUpdates({});
            alert("Successfully updated the status");
        }catch (err){
            alert("Failed to update the status the status");
        }
    }

    const updateStatus = useCallback(
        (id: number, newStatus: AppointmentStatus) => {
            const isOriginalStatus = (storeAppointments && newStatus === storeAppointments.find(app => app.id === id)?.status)

            setStatusUpdates(curr => { 
                let copy = {...curr};
                if (isOriginalStatus && copy[id] !== undefined){
                    delete copy[id];
                }else {
                    copy = {...copy, [id]: newStatus};
                }
                return copy;
            });
        },
        [storeAppointments]
    );


    const filteredAppointments = useMemo(() => 
        storeAppointments?.filter(({ id, status }) => {
            const updatedStatus = statusUpdates[id];
            return updatedStatus !== undefined ? statusFilter[updatedStatus] : statusFilter[status];
        })
    , [storeAppointments, statusFilter, statusUpdates]);

    const sortedAppointments = useMemo(() => {
        const sorted = filteredAppointments ? [...filteredAppointments] : undefined;

        switch(sortingValue){
            case 1:
                sorted?.sort((a, b) => compareAsc(a.createdAt, b.createdAt));
                break;
            case 2:
                sorted?.sort((a, b) => compareDes(a.createdAt, b.createdAt));
                break;
            case 3:
                sorted?.sort((a, b) => compareAsc(a.start, b.start));
                break;
            case 4:
                sorted?.sort((a, b) => compareDes(a.start, b.start));
                break;
            default:
        }
        
        return sorted;
    }
    , [filteredAppointments, sortingValue]);

    const buttonsDisabled = Object.keys(statusUpdates).length === 0 || isUpdatingStatus;

        return (<div className="bg-white rounded-lg shadow p-5 overflow-auto h-full flex flex-col">
            <div className="flex flex-col lg:flex-row lg:justify-around -mx-5 border-b border-gray-200 shadow-md px-3 pb-3">
                <div className="lg:w-1/4 mb-1">
                    <h4 className="text-gray-600 font-bold">Filter</h4>
                    <div className="flex flex-wrap text-gray-500">
                        <label className="w-1/2">
                            <Checkbox
                                checked={statusFilter[AppointmentStatus.accepted]}
                                onChange={(e) => toggleStatusFilter(e, AppointmentStatus.accepted)}
                            />
                            <span className="ml-2">Accepted</span>
                        </label>
                        <label className="w-1/2">
                            <Checkbox
                                checked={statusFilter[AppointmentStatus.pending]}
                                onChange={(e) => toggleStatusFilter(e, AppointmentStatus.pending)}
                            />
                            <span className="ml-2">Pending</span>
                        </label>
                        <label className="w-1/2">
                            <Checkbox
                                checked={statusFilter[AppointmentStatus.declined]}
                                onChange={(e) => toggleStatusFilter(e, AppointmentStatus.declined)}
                            />
                            <span className="ml-2">Declined</span>
                        </label>
                        <label className="w-1/2">
                            <Checkbox
                                checked={statusFilter[AppointmentStatus.complete]}
                                onChange={(e) => toggleStatusFilter(e, AppointmentStatus.complete)}
                            />
                            <span className="ml-2">Completed</span>
                        </label>
                    </div>
                </div>
                <div className="lg:w-1/4 mb-1">
                    <h4 className="text-gray-600 font-bold">Sort</h4>
                    <div className="text-gray-500">
                        <Select 
                            options={sortingOptions}
                            value={sortingValue}
                            onChange={e => setSortingValue(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="lg:w-1/4 mb-1">
                    <button
                        className={`border-green-900 border disabled:opacity-50 ${!buttonsDisabled? 'hover:bg-green-100' : ''} text-green-900 rounded focus:outline-none py-1 px-2 mr-2`}
                        disabled={buttonsDisabled}
                        onClick={saveStatusUpdates}
                    >
                        Save Changes
                    </button>
                    <button
                        className={`border-red-900 border disabled:opacity-50 ${!buttonsDisabled? 'hover:bg-red-100' : ''} text-red-900 rounded focus:outline-none py-1 px-2`}
                        disabled={buttonsDisabled}
                        onClick={() => setStatusUpdates({})}
                    >
                        Reset Changes
                    </button>
                </div>
            </div>
            <div className="h-full overflow-auto flex flex-wrap justify-around py-5 px-1">
            {sortedAppointments && sortedAppointments.map(appointment => (
                    <AppointmentCard 
                        key={appointment.id}
                        appointment={appointment}
                        updatedStatus={statusUpdates[appointment.id]}
                        updateStatus={updateStatus}
                    />
                ))}

            </div>
        </div>);
}

export default memo(ListView);
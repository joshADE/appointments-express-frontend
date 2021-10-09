import React, { useEffect, useMemo, useState, memo } from 'react'
import { ClosedDaysTimes, EventDetails, Events } from 'react-week-schedulr';
import { Appointment, AppointmentStatus } from '../../../features/appointment/appointmentTypes';
import { StoreWithDetails } from '../../../features/store/storeTypes';
import { convertArrayAppointmentsToEvents, convertStoreClosedToSchedulerClosed, convertStoreHoursToSchedulerHours } from './ManageAppointment';
import Scheduler from '../../shared/Scheduler';
import AppointmentDetailsForm from '../../shared/AppointmentDetailsForm';

const generateEvent = (eventDetails: EventDetails): Events => {
    const id = String(Math.random())
    return { [id]: { ...eventDetails, title: 'newEvent ' + id } }
}

interface CalendarViewProps {
    selectedStore: StoreWithDetails;
    storeAppointments: Appointment[] | undefined;
}

const CalendarView: React.FC<CalendarViewProps> = ({
    selectedStore,
    storeAppointments,
}) => {

    const [dynamicEvents, setDynamicEvents] = useState<Events>({}) // events that can be moved/deleted
    const [staticEvents, setStaticEvents] = useState<Events>({}) // events that can't be move/deleted
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [statusUpdates, setStatusUpdates] = useState<{[id: string]:AppointmentStatus}>({}); // contains all the appointments that have all their status updated
    

    const updateAppointment = (values: {
        id: string | null;
        title: string | undefined;
        desc: string | undefined;
        start: Date;
        end: Date;
        status: AppointmentStatus | undefined;
    }) => {
        const { id, status } = values;

        if (id && status !== undefined){
            setStatusUpdates(curr => ({...curr, [id]: status }));
        }
    }

    const saveStatusUpdates = () => {
        // send updates to the database
        alert("Saving the updated to the database...");
        setStatusUpdates({});
        setSelectedAppointmentId(null);
    }

    useEffect(() => {
        setStatusUpdates({});
        setSelectedAppointmentId(null);
    }, [selectedStore])
    
    useEffect(() => {
      if (selectedStore && storeAppointments){
        setStaticEvents(convertArrayAppointmentsToEvents(storeAppointments))
        setDynamicEvents({});
      }else {
        setStaticEvents({});
        setDynamicEvents({});
      }
      
    }, [selectedStore, storeAppointments])

    const hours = useMemo(() => { 
        if (selectedStore)
          return convertStoreHoursToSchedulerHours(selectedStore.storeHours);
        else
          return {};
    }, [selectedStore])

    const closedDaysTimes = useMemo<ClosedDaysTimes>(() => { 
      if (selectedStore)
        return convertStoreClosedToSchedulerClosed(selectedStore.closedDaysTimes);
      else
        return [];
  }, [selectedStore])
        return (<>
            <div className={`${selectedAppointmentId !== null? 'h-3/6': 'h-5/6'} transition-all duration-500 ease-out overflow-auto bg-white rounded-lg shadow p-5 mb-2 relative`}>
                 <div className="bg-white flex justify-center lg:justify-end">
                    <button
                        disabled={Object.keys(statusUpdates).length === 0}
                        className="border-green-900 border disabled:opacity-75 bg-primary text-white rounded focus:outline-none py-3 px-6"
                        onClick={saveStatusUpdates}
                    >
                        Save status updates
                    </button>
                 </div>
                <Scheduler 
                  dynamicEvents={dynamicEvents}
                  onChangeDynamicEvents={setDynamicEvents}
                  staticEvents={staticEvents}
                  onChangeStaticEvents={setStaticEvents}
                  generateEvent={generateEvent}
                  newEventsAddedTo='none'
                  hours={hours}
                  closedDaysTimes={closedDaysTimes}
                  onEventClick={(index) => setSelectedAppointmentId(index[0])}
                  minTimeBlock={selectedStore.store.minTimeBlock}
                  maxTimeBlock={selectedStore.store.maxTimeBlock}
                />
                
            </div>
            <div className={`${selectedAppointmentId !== null? 'h-3/6': 'h-1/6'} transition-all duration-500 ease-out bg-white rounded-lg shadow p-5 overflow-auto`}>
                <AppointmentDetailsForm 
                  setSelectedAppointmentId={setSelectedAppointmentId}
                  appointments={storeAppointments}
                  selectedAppointmentId={selectedAppointmentId}
                  readonly
                  events={staticEvents}
                  updateAppointment={updateAppointment}
                  statusUpdates={statusUpdates}
                />
            </div>
    </>);
}

export default memo(CalendarView);
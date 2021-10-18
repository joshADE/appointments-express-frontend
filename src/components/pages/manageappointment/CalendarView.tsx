import React, { useEffect, useMemo, useState, memo } from 'react'
import { ClosedDaysTimes, EventDetails, Events } from 'react-week-schedulr';
import { Appointment, AppointmentStatus, UpdateAppointmentStatusRequest } from '../../../features/appointment/appointmentTypes';
import { StoreWithDetails } from '../../../features/store/storeTypes';
import { convertArrayAppointmentsToEvents, convertStoreClosedToSchedulerClosed, convertStoreHoursToSchedulerHours } from './ManageAppointment';
import Scheduler from '../../shared/Scheduler';
import AppointmentDetailsForm from '../../shared/AppointmentDetailsForm';
import { useUpdateAppointmentsStatusMutation } from '../../../app/services/appointments';

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
    const [sendUpdates, { isLoading: isUpdatingStatus} ] = useUpdateAppointmentsStatusMutation();


    const updateAppointment = (values: {
        id: string | null;
        title: string | undefined;
        desc: string | undefined;
        start: Date;
        end: Date;
        status: AppointmentStatus | undefined;
    }) => {
      // send updates to the database
        const { id, status } = values;

        if (id && status !== undefined){
            // setStatusUpdates(curr => ({...curr, [id]: status }));
            const payload: UpdateAppointmentStatusRequest[] = [{ appointmentId: Number(id), newStatus: status }]
            sendUpdates({id: selectedStore.store.id, data: payload })
            .then((res) => {
              setStatusUpdates({});
              setSelectedAppointmentId(null);
              alert("Successfully updated the status");
            })
            .catch((err) => {
              alert("Failed to update the status of the appointment");
            })
        }
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
                  disabledButtons={isUpdatingStatus}
                />
            </div>
    </>);
}

export default memo(CalendarView);
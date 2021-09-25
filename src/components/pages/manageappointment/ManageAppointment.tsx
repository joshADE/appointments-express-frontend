import React, { useEffect, useMemo, useState } from 'react'
import DashboardPageHeader from '../../shared/DashboardPageHeader';
import {
    EventDetails,
    Events,
    Hours,
    ClosedDaysTimes as SchedulerCDT
} from 'react-week-schedulr';

import 'react-week-schedulr/dist/index.css'
import Select from '../../shared/Select';
import { useSelectStore } from '../../../hooks/useSelectStore';
import Scheduler from '../../shared/Scheduler';
import { useGetAllStoreAppointmentsQuery } from '../../../app/services/appointments';
import { Appointment } from '../../../features/appointment/appointmentTypes';
import moment from 'moment';
import { SkewLoader } from 'react-spinners';
import { ClosedDaysTimes, StoreHours } from '../../../features/store/storeTypes';

const generateEvent = (eventDetails: EventDetails): Events => {
  const id = String(Math.random())
  return { [id]: { ...eventDetails, title: 'newEvent ' + id } }
}


export const convertArrayAppointmentsToEvents : (appointments: Appointment[]) => Events = (appointments) => {
  const result: Events = {};
  appointments.forEach(({ id, start, end, title, description }) => {
    const s = moment(start, "YYYY-MM-DD[T]HH:mm:ss").toDate();
    const e = moment(end, "YYYY-MM-DD[T]HH:mm:ss").toDate();
    result[String(id)] = { range: [s, e], title, desc: description };
  })
  return result;
}

export const convertStoreHoursToSchedulerHours : (hours: StoreHours[]) => Hours = (hours) => {
  const result : Hours = {};

  hours.forEach(({ dayOfWeek, isOpen, open, close}) => {
    const o = moment(open, "HH:mm:ss").toDate();
    const c = moment(close, "HH:mm:ss").toDate();
    let range: [Date, Date] = [o, c];
    if (!isOpen){
      range = [o, o];
    }
    result[dayOfWeek] = range;
  })

  return result;
}

export const convertStoreClosedToSchedulerClosed : (closedDaysTimes: ClosedDaysTimes[]) => SchedulerCDT = (closedDaysTimes) => {
  return closedDaysTimes.map(({ from, to }) => {
    const f = moment(from, "YYYY-MM-DD[T]HH:mm:ss").toDate();
    const t = moment(to, "YYYY-MM-DD[T]HH:mm:ss").toDate();
    return [f, t];
  })
}


const ManageAppointment: React.FC = () => {

    const { 
      selectOptions,
      selectedStoreIndex,
      setSelectedStoreIndex,
      selectedStore,
      storesWithDetails,
      rest: {
        isLoading: storesLoading,
        isFetching: storesFetching,
        error: storesError
      }
    } = useSelectStore(-1);

    const {
      data: storeAppointments,
      isLoading: appointmentsLoading,
      isFetching: appointmentsFetching,
      error: appointmentsError
    } = useGetAllStoreAppointmentsQuery(
      selectedStore ? selectedStore.store.id : -1,
      {
        skip: !selectedStore || !storesWithDetails,
      }
    )


    const [dynamicEvents, setDynamicEvents] = useState<Events>({}) // events that can be moved/deleted
    const [staticEvents, setStaticEvents] = useState<Events>({}) // events that can't be move/deleted

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

    const closedDaysTimes = useMemo<SchedulerCDT>(() => { 
      if (selectedStore)
        return convertStoreClosedToSchedulerClosed(selectedStore.closedDaysTimes);
      else
        return [];
  }, [selectedStore])

    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
        return (
        <div className="overflow-y-auto h-full w-11/12 font-roboto p-4 relative">
            {(storesLoading || storesFetching || appointmentsLoading || appointmentsFetching) && (
            <div className="absolute right-0 bottom-0">
              <SkewLoader
                color="#333"
                loading={storesLoading || storesFetching || appointmentsLoading || appointmentsFetching}
                size="20px"
              />
            </div>
            )}
            <div className="h-1/6 overflow-y-auto">
              <DashboardPageHeader
                  title="Appointments"
                  description="Here are all you scheduled appointments. You can see more details about the event by clicking. Make sure to select a store first."
              />
              {storesError || appointmentsError ? (
                <div className="h-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500">
                  Error fetching data from the server
                </div>
              ) : (
              <div className="bg-white rounded-lg shadow p-3">
                <Select
                  options={selectOptions}
                  onChange={(e) => setSelectedStoreIndex(Number(e.target.value))}
                  value={selectedStoreIndex}
                />
              </div>)}
            </div>
            <div className="flex flex-col h-5/6">
              {storesError || appointmentsError ? (
                <div className="h-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 whitespace-pre-wrap">
                  Error fetching data from the server:{" "}
                  <div className="text-left w-20 mx-auto">
                    {JSON.stringify({ ...storesError, ...appointmentsError }, null, 2)}
                  </div>
                  If the status is 401 try refreshing the page and relogging
                </div>
              ) : (
                <>
                <div className={`${selectedAppointmentId !== null? 'h-3/6': 'h-5/6'} transition-all duration-500 ease-out overflow-auto bg-white rounded-lg shadow p-5 mb-2`}>
                    {selectedStore ? 
                    <Scheduler 
                      dynamicEvents={dynamicEvents}
                      onChangeDynamicEvents={setDynamicEvents}
                      staticEvents={staticEvents}
                      onChangeStaticEvents={setStaticEvents}
                      generateEvent={generateEvent}
                      newEventsAddedTo='dynamic'
                      hours={hours}
                      closedDaysTimes={closedDaysTimes}
                      // onEventClick={(index) => setSelectedAppointmentId(index[0])}
                      minTimeBlock={selectedStore.store.minTimeBlock}
                      maxTimeBlock={selectedStore.store.maxTimeBlock}
                    /> : 
                    <div className="text-center bg-green-50 bg-opacity-90 text-xs text-gray-500 h-full">
                      Select a store to see the schedule
                    </div>}
                </div>
                <div className={`${selectedAppointmentId !== null? 'h-3/6': 'h-1/6'} transition-all duration-500 ease-out bg-white rounded-lg shadow p-5 overflow-auto`}>
                    <button onClick={() => {
                      if (!selectedAppointmentId) 
                        setSelectedAppointmentId('123'); 
                      else 
                        setSelectedAppointmentId(null);
                      }}>Click me</button>
                </div>
                </>
              )}
            </div>
        </div>
        );
}

export default ManageAppointment;
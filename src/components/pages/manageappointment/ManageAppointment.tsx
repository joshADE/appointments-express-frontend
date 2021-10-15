import React, { useState } from 'react'
import DashboardPageHeader from '../../shared/DashboardPageHeader';
import {
    Events,
    Hours,
    ClosedDaysTimes as SchedulerCDT
} from 'react-week-schedulr';

import 'react-week-schedulr/dist/index.css'
import Select from '../../shared/Select';
import { useSelectStore } from '../../../hooks/useSelectStore';
import { useGetAllStoreAppointmentsQuery } from '../../../app/services/appointments';
import { Appointment } from '../../../features/appointment/appointmentTypes';
import moment from 'moment';
import { SkewLoader } from 'react-spinners';
import { ClosedDaysTimes, StoreHours } from '../../../features/store/storeTypes';
import CalendarView from './CalendarView';
import ListView from './ListView';
import RadioButton from '../../shared/RadioButton';




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
    );

    const [viewType, setViewType] = useState('0');


    


        return (
        <div className="overflow-y-auto h-full w-11/12 font-montserrat p-4 relative flex flex-col">
            {(storesLoading || storesFetching || appointmentsLoading || appointmentsFetching) && (
            <div className="absolute right-0 bottom-0">
              <SkewLoader
                color="#333"
                loading={storesLoading || storesFetching || appointmentsLoading || appointmentsFetching}
                size="20px"
              />
            </div>
            )}
            
            <div className="mb-2">
              <DashboardPageHeader
                  title="Appointments"
                  description="Here are all you scheduled appointments. You can see more details about the event by clicking. Make sure to select a store first."
              />
            </div>
            
              {storesError || appointmentsError ? (
                <div className="h-16 mb-2 text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500">
                  Error fetching data from the server
                </div>
              ) : (
              <div className="flex flex-col lg:flex-row">
                <div className="bg-white rounded-lg shadow p-3 lg:w-1/2 mb-2 lg:mr-1">
                  <Select
                    options={selectOptions}
                    onChange={(e) => setSelectedStoreIndex(Number(e.target.value))}
                    value={selectedStoreIndex}
                  />
                </div>
                <div className="bg-white rounded-lg shadow p-3 lg:w-1/2 mb-2 lg:ml-1 text-gray-700">
                  <label className="mr-2"><RadioButton selected={viewType} name="viewType" value='0' onChange={setViewType} /> Calendar View</label>
                  <label><RadioButton selected={viewType} name="viewType" value='1' onChange={setViewType} /> List View</label>
                </div>
              </div>)}
            
            
            <div className="flex flex-col h-full overflow-auto">
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
                  {!selectedStore ? 
                    <div className="text-center bg-white rounded-lg shadow p-5 text-xs text-gray-500 h-full">
                      Select a store to see the schedule
                    </div>
                    :
                    viewType === '0'?
                    <CalendarView 
                      selectedStore={selectedStore}
                      storeAppointments={storeAppointments}
                    />
                    :
                    <ListView 
                      selectedStore={selectedStore}
                      storeAppointments={storeAppointments}
                    />
                  }
                </>
              )}
            </div>
        </div>
        );
}

export default ManageAppointment;
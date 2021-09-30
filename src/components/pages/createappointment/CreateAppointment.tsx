import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SkewLoader } from 'react-spinners';
import { ClosedDaysTimes, EventDetails, Events, Hours } from 'react-week-schedulr';
import { useGetAllStoreAppointmentsQuery, useGetStoreAndTimesQuery } from '../../../app/services/appointments';
import Scheduler from '../../shared/Scheduler';
import { convertStoreClosedToSchedulerClosed, convertStoreHoursToSchedulerHours } from '../manageappointment/ManageAppointment';
import Instructions from './Instructions';

const generateEvent = (eventDetails: EventDetails): Events => {
    const id = String(-1)
    return { [id]: { ...eventDetails, title: 'newEvent ' + id } }
}
  

const CreateAppointment: React.FC = () => {
    const { id } = useParams<{id: string}>();
    const numberId = Number(id);
    const { 
        data: storeAndTimes,
        isLoading: storeAndTimesLoading,
        isFetching: storeAndTimesFetching,
        error: storeAndTimesError
    } = useGetStoreAndTimesQuery(numberId, { skip: isNaN(numberId) });
    const { 
        data: appointments,
        isLoading: appointmentsLoading,
        isFetching: appointmentsFetching,
        error: appointmentsError
    } = useGetAllStoreAppointmentsQuery(numberId, { skip: isNaN(numberId) });

    const hours = useMemo<Hours>(() => { 
        if (storeAndTimes)
          return convertStoreHoursToSchedulerHours(storeAndTimes.storeHours);
        else
          return {};
    }, [storeAndTimes])

    const closedDaysTimes = useMemo<ClosedDaysTimes>(() => { 
      if (storeAndTimes)
        return convertStoreClosedToSchedulerClosed(storeAndTimes.closedDaysTimes);
      else
        return [];
  }, [storeAndTimes])

    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [dynamicEvents, setDynamicEvents] = useState<Events>({}) // events that can be moved/deleted
    const [staticEvents, setStaticEvents] = useState<Events>({}) // events that can't be move/deleted

    

        return (
        <div className="overflow-y-auto h-screen font-roboto p-4 bg-gray-100">
            {(
                storeAndTimesLoading || 
                storeAndTimesFetching || 
                appointmentsLoading || 
                appointmentsFetching
            ) ? 
            <div className="flex justify-center items-center">
                <SkewLoader
                    color="#333"
                    loading={storeAndTimesLoading || storeAndTimesFetching || appointmentsLoading || appointmentsFetching}
                    size="70px"
                />
            </div>: 
            (storeAndTimesError || appointmentsError) ? 
            (
                <div className="h-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 whitespace-pre-wrap">
                  Error fetching data from the server:{" "}
                  <div className="text-left w-20 mx-auto">
                    {JSON.stringify({ ...storeAndTimesError, ...appointmentsError }, null, 2)}
                  </div>
                    {(storeAndTimesError as FetchBaseQueryError).status === 404 && <span>It looks like that store doesn't exist. Try a different store.</span>}
                </div>
            ): 
            (<div className="h-full w-full flex justify-center items-center">
                {!storeAndTimes || !appointments ? 
                    <div className="h-full w-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 whitespace-pre-wrap">
                        That store might not exist. Try a different store
                    </div>: 
                    <div className="h-full w-full flex flex-col md:grid md:grid-cols-8 md:grid-rows-6 gap-4">
                        <div className="md:col-span-4 md:row-span-1 font-oswald">
                            <h1 className="text-2xl">Create Appointment</h1>
                            <h2 className="text-base text-gray-500">For: {storeAndTimes.store.name}</h2>
                        </div>
                        <div className="md:col-span-4 md:row-span-1 md:justify-self-end md:self-center bg-white rounded-lg shadow p-5 font-montserrat">
                            <button 
                                className="border-green-900 border disabled:opacity-50 bg-green-600 text-white rounded focus:outline-none py-3 px-6 mr-5"
                                disabled={dynamicEvents['-1'] === undefined}
                            >
                                Accept
                            </button>
                            <Link to="/" className="border-gray-700 border-2 hover:bg-white bg-gray-300 text-gray-700 rounded focus:outline-none py-3 px-6">
                                Go back
                            </Link>
                        </div>
                        <div className="md:col-span-2 md:row-span-5 bg-white rounded-lg shadow p-5">
                            <Instructions />
                        </div>
                        <div className="md:col-span-6 md:row-span-5 h-screen md:h-auto flex flex-col">
                            <div className={`${selectedAppointmentId !== null? 'h-3/6': 'h-5/6'} transition-all duration-500 ease-out overflow-auto bg-white rounded-lg shadow p-5 mb-2`}>
                                <Scheduler 
                                dynamicEvents={dynamicEvents}
                                onChangeDynamicEvents={setDynamicEvents}
                                staticEvents={staticEvents}
                                onChangeStaticEvents={setStaticEvents}
                                generateEvent={generateEvent}
                                newEventsAddedTo='dynamic'
                                hours={hours}
                                closedDaysTimes={closedDaysTimes}
                                minTimeBlock={storeAndTimes.store.minTimeBlock}
                                maxTimeBlock={storeAndTimes.store.maxTimeBlock}
                                />
                            </div>
                            <div className={`${selectedAppointmentId !== null? 'h-3/6': 'h-1/6'} transition-all duration-500 ease-out bg-white rounded-lg shadow p-5 overflow-auto`}>
                                <button onClick={() => {
                                if (!selectedAppointmentId) 
                                    setSelectedAppointmentId('123'); 
                                else 
                                    setSelectedAppointmentId(null);
                                }}>Click me</button>
                            </div>
                        </div>
                    </div>}
            </div>)}
        </div>);
}

export default CreateAppointment;
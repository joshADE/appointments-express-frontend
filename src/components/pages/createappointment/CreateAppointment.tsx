import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { SkewLoader } from 'react-spinners';
import { ClosedDaysTimes, DefaultEventRootComponent, EventDetails, EventRootProps, Events, Hours } from 'react-week-schedulr';
import { useCreateAppointmentMutation, useGetAllStoreAppointmentsQuery, useGetStoreAndTimesQuery } from '../../../app/services/appointments';
import { Appointment, AppointmentStatus } from '../../../features/appointment/appointmentTypes';
import AppointmentDetailsForm from '../../shared/AppointmentDetailsForm';
import Modal from '../../shared/Modal';
import Scheduler from '../../shared/Scheduler';
import { convertArrayAppointmentsToEvents, convertStoreClosedToSchedulerClosed, convertStoreHoursToSchedulerHours } from '../manageappointment/ManageAppointment';
import Instructions from './Instructions';
import ModalContentForm from './ModalContentForm';


const EventRoot = React.forwardRef<any, EventRootProps>(function EventRoot(
    { handleDelete, disableDelete, type, ...props },
    ref
  ) {
    return (
      
        <DefaultEventRootComponent
          handleDelete={handleDelete}
          disableDelete={disableDelete}
          type={type}
          {...props}
          className={`${props.className} ${type === 'static' ? 'opacity-75': ''}`}
          ref={ref}
        />
    )
  })

const generateEvent = (eventDetails: EventDetails): Events => {
    const id = String(-1)
    return { [id]: { ...eventDetails, title: 'New Appointment', desc: "" } }
}
  

const CreateAppointment: React.FC = () => {
    const { id } = useParams<{id: string}>();
    const history =  useHistory();
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

    const [createAppointment, { isLoading: isCreatingAppointment }] = useCreateAppointmentMutation();



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
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (appointments){
            setStaticEvents(convertArrayAppointmentsToEvents(appointments));
        }else{
            setStaticEvents({});
        }
    }, [appointments])

    const updateAppointmentDetails = (values: {
        id: string | null;
        title: string | undefined;
        desc: string | undefined;
        start: Date;
        end: Date;
        status: AppointmentStatus | undefined;
    }) => {
        const { id, title, desc  } = values;
        // only updating the event/appointment with the id of -1
        if (id === '-1'){
            setDynamicEvents((curr) => ({...curr, [id]: {...curr[id], desc, title  }}));
            alert("Appointment details updated")
        }else {
            alert("Cannot update the details for that appointment");
        }
    }

    const openSaveNewAppointmentModal =  () => {
        setModalOpen(true);
    }
    
    const saveAndSendAppointment = (values: { email: string; firstName: string; lastName: string; }) => {
        const { email, firstName, lastName } = values;
        const { title, desc, range } = dynamicEvents['-1'];
        const newAppointment: Partial<Appointment> = { 
            description: desc, 
            title, 
            status: AppointmentStatus.pending, 
            storeId: numberId, 
            start: moment(range[0]).format("YYYY-MM-DD[T]HH:mm:ss"),
            end: moment(range[1]).format("YYYY-MM-DD[T]HH:mm:ss"),
        }
        const domain = window.location.href.replace(window.location.pathname, "");
        createAppointment({ appointment: newAppointment, domain, email, firstName, lastName })
        .then((result) => {
            alert("Successfully created appointment. Your email should be in your mailbox. Redirecting to homepage")
            setModalOpen(false);
            history.push("/");
        })
        .catch((err) => {
            alert("Failed to create the appointment");
        });
        
        
    }
    

    const allEvents = useMemo<Events>(() => ({...staticEvents, ...dynamicEvents}), [staticEvents, dynamicEvents]);

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
                    storeAndTimes.store.isQuickProfile ?
                    <div className="h-full w-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 whitespace-pre-wrap">
                        That store is a Quick Profile and cannot have appointments scheduled.
                    </div>:
                    <>
                    
                    
                    <div className="h-full w-full flex flex-col md:grid md:grid-cols-8 md:grid-rows-6 gap-4">
                        

                        <div className="md:col-span-4 md:row-span-1 font-oswald">
                            <h1 className="text-2xl">Create Appointment</h1>
                            <h2 className="text-base text-gray-500">For: {storeAndTimes.store.name}</h2>
                        </div>
                        <div className="md:col-span-4 md:row-span-1 md:justify-self-end md:self-center bg-white rounded-lg shadow p-5 font-montserrat">
                            <button 
                                className="border-green-900 border disabled:opacity-50 bg-primary text-white rounded focus:outline-none py-3 px-6 mr-5"
                                disabled={dynamicEvents['-1'] === undefined}
                                onClick={openSaveNewAppointmentModal}
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
                                onEventClick={(index) => setSelectedAppointmentId(index[0])}
                                eventRootComponent={EventRoot}
                                />
                            </div>
                            <div className={`${selectedAppointmentId !== null? 'h-3/6': 'h-1/6'} transition-all duration-500 ease-out bg-white rounded-lg shadow p-5 overflow-auto`}>
                                <AppointmentDetailsForm
                                    appointments={appointments} 
                                    updateAppointment={updateAppointmentDetails}
                                    events={allEvents}
                                    selectedAppointmentId={selectedAppointmentId}
                                    setSelectedAppointmentId={setSelectedAppointmentId}
                                    hiddenDetails={selectedAppointmentId !== null && staticEvents[selectedAppointmentId] !== undefined}
                                />
                            </div>
                        </div>
                    </div>
                    {modalOpen && 
                    <Modal setModalOpen={setModalOpen} title="Enter your email:" bodyText="An email will be sent to you to allow you to view the appointment status.">
                        <ModalContentForm 
                            saveAndSendAppointment={saveAndSendAppointment}
                        />
                        {isCreatingAppointment && 
                        <SkewLoader
                            color="#333"
                            loading={isCreatingAppointment}
                            size="20px"
                        />
                        }
                    </Modal>}
                    
                    </>}
            </div>)}
        </div>);
}

export default CreateAppointment;
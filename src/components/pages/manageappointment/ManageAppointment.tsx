import React, { useState } from 'react'
import DashboardPageHeader from '../../shared/DashboardPageHeader';
import {
    WeekScheduler,
    EventDetails,
    Events,
    Hours,
    ClosedDaysTimes
} from 'react-week-schedulr';

import 'react-week-schedulr/dist/index.css'
import Select from '../../shared/Select';
import { useSelectStore } from '../../../hooks/useSelectStore';

const generateEvent = (eventDetails: EventDetails): Events => {
  const id = String(Math.random())
  return { [id]: { ...eventDetails, title: 'newEvent ' + id } }
}

const initialDynamicEvents: Events = {
  '1': { range: [new Date(2021, 8, 22, 12), new Date(2021, 8, 22, 13)] },
  '2': {
    range: [new Date(2021, 8, 23, 14), new Date(2021, 8, 24, 15)],
    title: 'work time'
  }
}

const initialStaticEvents: Events = {
  '3': {
    range: [new Date(2021, 8, 23, 3), new Date(2021, 8, 23, 5)],
    title: 'break time static'
  },
  '4': {
    range: [new Date(2021, 8, 23, 6), new Date(2021, 8, 23, 8)],
    title: 'work time static'
  }
}

const hours: Hours = {
  2: [new Date(2021, 7, 23, 3), new Date(2021, 7, 23, 16)]
}

const closedDaysTimes: ClosedDaysTimes = [
  [new Date(2021, 8, 20, 3), new Date(2021, 8, 20, 16)]
]

const originDate = new Date(2021, 8, 19)


const ManageAppointment: React.FC = () => {

    const { 
      selectOptions,
      selectedStoreIndex,
      setSelectedStoreIndex,
    } = useSelectStore(-1);


    const [events, setEvents] = useState(initialDynamicEvents) // events that can be moved/deleted
    const [staticEvents, setStaticEvents] = useState<Events>(initialStaticEvents) // events that can't be move/deleted
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>('null');
        return (
        <div className="overflow-y-auto h-full w-11/12 font-roboto p-4">
            <div className="h-1/6 overflow-y-auto">
              <DashboardPageHeader
                  title="Appointments"
                  description="Here are all you scheduled appointments. You can see more details about the event by clicking. Make sure to select a store first."
              />
              <div className="bg-white rounded-lg shadow p-3">
                <Select
                  options={selectOptions}
                  onChange={(e) => setSelectedStoreIndex(Number(e.target.value))}
                  value={selectedStoreIndex}
                />
              </div>
            </div>
            <div className="flex flex-col h-5/6">
                <div className={`${selectedAppointmentId !== null? 'h-3/6': 'h-5/6'} transition-all duration-500 ease-out overflow-auto bg-white rounded-lg shadow p-5 mb-2`}>
                    <WeekScheduler 
                        // cellWidth={150}
                        // width="1400px"
                        cellHeight={100}
                        height='auto'
                        dynamicEvents={events}
                        onChangeDynamicEvents={setEvents}
                        staticEvents={staticEvents}
                        onChangeStaticEvents={setStaticEvents}
                        newEventsAddedTo='dynamic'
                        generateEvent={generateEvent} // generates the id for a new event
                        cellClickPrecision={60}
                        hours={hours}
                        closedDaysTimes={closedDaysTimes}
                        // eventsOverlap
                        // maxVerticalPrecision={420}  // max time in minutes an event can span
                        verticalPrecision={5} // min time in minutes an event can span
                        visualGridVerticalPrecision={120} // grid incriments in minutes
                        originDate={originDate}
                        onEventClick={(index) => setSelectedAppointmentId(index[0])}
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
        </div>
        );
}

export default ManageAppointment;
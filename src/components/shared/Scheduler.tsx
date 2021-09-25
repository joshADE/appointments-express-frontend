import moment from 'moment';
import React, { memo, useMemo, useState } from 'react'
import {
    clampWrapInclusive,
    WeekScheduler,
    EventDetails,
    Events,
    Hours,
    ClosedDaysTimes
} from 'react-week-schedulr';

interface SchedulerProps {
    dynamicEvents: Events;
    onChangeDynamicEvents: (newEvents: Events) => void;
    staticEvents: Events;
    onChangeStaticEvents: (newEvents: Events) => void;
    newEventsAddedTo: "dynamic" | "static" | "none";
    generateEvent: (eventDetails: EventDetails) => Events;
    minTimeBlock: number;
    maxTimeBlock:number;
    hours?: Hours;
    closedDaysTimes?: ClosedDaysTimes;
    onEventClick?: (index: [string, number] | [null, null]) => void;
    originDate?: Date;
}

const weeks = [0, 1, 2, 3, 4]

const Scheduler: React.FC<SchedulerProps> = ({
    dynamicEvents,
    onChangeDynamicEvents,
    staticEvents,
    onChangeStaticEvents,
    newEventsAddedTo,
    generateEvent,
    minTimeBlock,
    maxTimeBlock,
    hours,
    closedDaysTimes,
    onEventClick,
    originDate = new Date(),
}) => {
    const [currentYear, setCurrentYear] = useState(originDate.getFullYear())
    const [currentMonth, setCurrentMonth] = useState(originDate.getMonth())
    const [currentWeek, setCurrentWeek] = useState(
      Math.ceil(
        (originDate.getDate() + new Date(currentYear, currentMonth, 1).getDay()) /
          7
      ) - 1
    )

    const addMonth = (amount: 1 | -1) => {
        if (currentMonth === 11 && amount === 1)
          setCurrentYear((current) => current + 1)
        if (currentMonth === 0 && amount === -1)
          setCurrentYear((current) => current - 1)
        setCurrentMonth((current) => clampWrapInclusive(current + amount, 0, 11))
        setCurrentWeek(0)
    }

    const originDay = useMemo(() => {
        const startDayOfMonth = moment(new Date(currentYear, currentMonth, 1))
        return startDayOfMonth.add(currentWeek, 'w').toDate()
    }, [currentYear, currentMonth, currentWeek])



        return (<div className="font-roboto">
            <div className="text-center font-oswald text-xl font-bold">
                <button className="rounded-md border-none bg-transparent cursor-pointer outline-none" onClick={() => addMonth(-1)}>
                {' '}
                {'<'}{' '}
                </button>
                <span className="mx-6">
                {moment(new Date(currentYear, currentMonth)).format("MMM' YYYY")}
                </span>
                <button className="rounded-md border-none bg-transparent cursor-pointer outline-none" onClick={() => addMonth(1)}>
                {' '}
                {'>'}{' '}
                </button>
            </div>
            <div className="flex w-auto justify-center">
                {weeks.map((element, index) => (
                <button
                    key={element}
                    onClick={() => setCurrentWeek(index)}
                    className={`week-indicator rounded-full w-2 h-2 bg-black border-none cursor-pointer mx-1 relative ${
                    currentWeek === index ? 'ring-green-500 ring-opacity-70 ring-offset-1 ring-2' : ''
                    }`}
                />
                ))}
            </div>
            <WeekScheduler 
                // cellWidth={150}
                // width="1400px"
                cellHeight={240}
                height='auto'
                dynamicEvents={dynamicEvents}
                onChangeDynamicEvents={onChangeDynamicEvents}
                staticEvents={staticEvents}
                onChangeStaticEvents={onChangeStaticEvents}
                newEventsAddedTo={newEventsAddedTo}
                generateEvent={generateEvent} // generates the id for a new event
                cellClickPrecision={minTimeBlock}
                hours={hours}
                closedDaysTimes={closedDaysTimes}
                // eventsOverlap
                maxVerticalPrecision={maxTimeBlock}  // max time in minutes an event can span
                verticalPrecision={minTimeBlock} // min time in minutes an event can span
                visualGridVerticalPrecision={120} // grid incriments in minutes
                originDate={originDay}
                onEventClick={onEventClick}
            />
        </div>);
}

export default memo(Scheduler)
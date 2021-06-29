import React from 'react'
import { ClosedDaysTimes, RepeatInterval } from '../../../features/store/storeTypes';

interface ClosedDaysTimesListProps {
    closed: Partial<ClosedDaysTimes>[];
}

const intervals : { [label: string]: RepeatInterval } = {
    'Every Day Of The Week': RepeatInterval.everyDayOfWeek,
    'Current Day Of The Week': RepeatInterval.currentDayOfWeek,
    'Current Day Of The Month': RepeatInterval.currentDayOfMonth,
    'Current Day Of The Year': RepeatInterval.currentDayOfYear
};


const ClosedDaysTimesList: React.FC<ClosedDaysTimesListProps> = ({
    closed
}) => {
        return (<div className="">
            <ul className="overflow-y-auto ">
                {closed.map((cdt, index) => {
                    return (
                        <li
                            key={cdt.id !== undefined? cdt.id : index}
                            className="border border-gray-700 mb-1"
                        >
                            <div>
                                <label htmlFor="fromField">From: </label>
                                <input 
                                    id="fromField" 
                                    type="text"
                                    value={cdt.from}
                                />
                            </div>
                            <div>
                                <label htmlFor="toField">To: </label>
                                <input 
                                    id="toField" 
                                    type="text"
                                    value={cdt.to}
                                />
                            </div>
                            <div>
                                <label htmlFor="repeatField">Repeat: </label>
                                <input 
                                    id="repeatField" 
                                    type="checkbox"
                                    checked={cdt.repeat}
                                />
                            </div>
                            <div>
                                <label htmlFor="intervalField">Repeat Interval: </label>
                                <select
                                    id="intervalField"
                                    value={cdt.repeatInterval}
                                    disabled={!cdt.repeat}
                                    className="border-b border-black"
                                >
                                    {Object.entries(intervals).map(interval => <option key={interval[1]} value={interval[1]}>{interval[0]}</option>)}
                                </select>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <button className="border w-full border-black">New closed day/time</button>
        </div>);
}

export default ClosedDaysTimesList
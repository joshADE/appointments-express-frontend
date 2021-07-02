import React, { useState, useEffect, useCallback } from 'react'
import { StoreWithDetails, Store, StoreHours, ClosedDaysTimes, RepeatInterval } from '../../../features/store/storeTypes'
import HoursTable from './HoursTable';
import InfoForm from './InfoForm';
import moment from 'moment';
import ClosedDaysTimesList from './ClosedDaysTimesList';

interface StoreDetailsFormProp {
    isQuickProfile: boolean;
    storeDetails?: StoreWithDetails;
    clearStoreDetails: () => void;
}

// default values for this components state
const defaultStoreInfo: Partial<Store> = {
    location: '',
    isQuickProfile: false,
    minTimeBlock: 5,
    maxTimeBlock: 30,
    name: ''
}

const defaultStoreHours: Partial<StoreHours>[] = [
    { dayOfWeek: 0, isOpen: false, open: "09:00:00", close: "17:00:00" },
    { dayOfWeek: 1, isOpen: true, open: "09:00:00", close: "17:00:00" },
    { dayOfWeek: 2, isOpen: true, open: "09:00:00", close: "17:00:00" },
    { dayOfWeek: 3, isOpen: true, open: "09:00:00", close: "17:00:00" },
    { dayOfWeek: 4, isOpen: true, open: "09:00:00", close: "17:00:00" },
    { dayOfWeek: 5, isOpen: true, open: "09:00:00", close: "17:00:00" },
    { dayOfWeek: 6, isOpen: false, open: "09:00:00", close: "17:00:00" }
]

const defaultClosed: Partial<ClosedDaysTimes>[] = [
    { from: moment(new Date(2021, 5, 28, 11, 0,0)).format("YYYY-MM-DD[T]HH:mm:ss"), to: moment(new Date(2021, 5, 28, 11, 0,0)).add(2, 'hours').format("YYYY-MM-DD[T]HH:mm:ss"), repeat: false, repeatInterval: RepeatInterval.everyDayOfWeek }
]

const timeBlockOptions = [
    {label:'5', value: 5}, 
    {label:'10', value: 10}, 
    {label:'15', value: 15}, 
    {label:'30', value: 30}, 
    {label:'60', value: 60}
]

const convertArrayHoursToObject = (arrayHours: Partial<StoreHours>[]) => {
    const objectHours : {[dayOfWeek:number]:Partial<StoreHours>} = {};
    arrayHours.forEach(day => {
        if (day.dayOfWeek !== undefined)
            objectHours[day.dayOfWeek] = day;
    }); 
    return objectHours;
}

// const convertObjectHoursToArray = (objectHours: {[dayOfWeek:number]:Partial<StoreHours>}) => {
//     const arrayHours : Partial<StoreHours>[] = [];
//      Object.values(objectHours).forEach(entry => {
//         arrayHours.push(entry);
//     }); 
//     return arrayHours;
// }

const StoreDetailsForm: React.FC<StoreDetailsFormProp> = ({
    isQuickProfile,
    storeDetails,
    clearStoreDetails
}) => {
    const [info, setInfo] = useState(storeDetails?storeDetails.store:defaultStoreInfo);
    const [hours, setHours] = useState(storeDetails?convertArrayHoursToObject(storeDetails.storeHours):convertArrayHoursToObject(defaultStoreHours));
    // closed = closed days and times
    const [closed, setClosed] = useState(storeDetails?storeDetails.closedDaysTimes:defaultClosed)
    useEffect(() => {
        if (storeDetails){
            setInfo(storeDetails.store);
            setHours(convertArrayHoursToObject(storeDetails.storeHours));
            setClosed(storeDetails.closedDaysTimes);
        }else {
            setInfo(defaultStoreInfo);
            setHours(convertArrayHoursToObject(defaultStoreHours));
            setClosed(defaultClosed);
        }
    }, [storeDetails])

    // callbacks to changes the hours state
    const onIncrementOrDecrement = useCallback((dayOfWeek: number, isOpenTime: boolean, amount: number) => {
        if (isOpenTime)
            setHours(currentHours => 
                currentHours[dayOfWeek] && currentHours[dayOfWeek].open ? 
                Object.assign({}, currentHours, 
                    {[dayOfWeek]: { ...currentHours[dayOfWeek], open: moment(currentHours[dayOfWeek].open, 'HH:mm:ss').add(amount, 'minute').format('HH:mm:ss')}}):
                currentHours);
        else
            setHours(currentHours => 
                currentHours[dayOfWeek] && currentHours[dayOfWeek].close ? 
                Object.assign({}, currentHours, 
                    {[dayOfWeek]: { ...currentHours[dayOfWeek], close: moment(currentHours[dayOfWeek].close, 'HH:mm:ss').add(amount, 'minute').format('HH:mm:ss')}}):
                currentHours);                   
    },[]);

    const onChangeOpenOrClose = useCallback((dayOfWeek: number, value: boolean) => {
        if (hours[dayOfWeek] && hours[dayOfWeek].isOpen !== undefined){
            setHours(
                {...hours, [dayOfWeek]:{...hours[dayOfWeek],isOpen: value}}
            );
        }
    }, [hours]);

    // callbacks to change the closed days and time state (closed)
    const onChangeFromOrTo = useCallback((index: number, isFrom: boolean, newVale: moment.Moment) => {
        setClosed(closed => closed.map((cdt, i) => {
            if (i === index){
                if (isFrom){
                    return {...cdt, from: newVale.format("YYYY-MM-DD[T]HH:mm:ss") };
                } else {
                    return {...cdt, to: newVale.format("YYYY-MM-DD[T]HH:mm:ss") };
                }
            }else{
                return cdt;
            }
        }))
    }, []);

    const onChangeRepeat = useCallback((index: number, newValue: boolean) => {
        setClosed(closed => closed.map((cdt, i) => {
            if (i === index){
                return {...cdt, repeat: newValue };
            }else{
                return cdt;
            }
        }))
    }, []);

    const onChangeRepeatInterval = useCallback((index: number, newValue: number) => {
        setClosed(closed => closed.map((cdt, i) => {
            if (i === index){
                return {...cdt, repeatInterval: newValue };
            }else{
                return cdt;
            }
        }))
    }, []);
    return (
        <div className="font-roboto h-full flex pb-5">
            <div className="w-3/4 h-full">
                <h3 className="font-bold text-2xl border-b-2 border-gray-900">{isQuickProfile ? (storeDetails ? "Quick Profile" : "Create Quick Profile") : (storeDetails ? "Edit " + storeDetails.store.name : "Create new store")}</h3>
                <div className="h-full flex flex-col md:flex-row md:flex-wrap overflow-auto">
                    <div className="md:w-56 mr-4 relative">
                        <h4 className="font-bold text-lg border-b border-gray-900">Details</h4>
                        <form

                        >
                            <InfoForm 
                                id="name"
                                label="Name"
                                name="name"
                                type="text"
                                value={info.name}
                                onChange={e => setInfo({...info, name: e.target.value})}
                                isChecked
                            />
                            <InfoForm 
                                id="location"
                                label="Location"
                                name="location"
                                type="text"
                                value={info.location}
                                onChange={e => setInfo({...info, location: e.target.value})}
                                isChecked
                            />
                            <InfoForm 
                                id="minTimeBlock"
                                label="Min. Time Block"
                                name="minTimeBlock"
                                type="select"
                                value={info.minTimeBlock}
                                onChange={e => { if (info.maxTimeBlock && +e.target.value > info.maxTimeBlock) setInfo({...info, minTimeBlock: +e.target.value, maxTimeBlock: +e.target.value}); else setInfo({...info, minTimeBlock: +e.target.value})}}
                                isChecked
                                options={timeBlockOptions}
                            />
                            <InfoForm 
                                id="maxTimeBlock"
                                label="Max. Time Block"
                                name="maxTimeBlock"
                                type="select"
                                value={info.maxTimeBlock}
                                onChange={e => { if(info.minTimeBlock && +e.target.value >= info.minTimeBlock) setInfo({...info, maxTimeBlock: +e.target.value}); else alert('Max time block cannot be less than min time block')}}
                                isChecked
                                options={timeBlockOptions}
                            />
                        
                        </form>
                    </div>
                    <div className="md:w-max mr-4 relative">
                        <h4 className="font-bold text-lg border-b border-gray-900">Hours</h4>
                        
                        <form

                        >
                            <HoursTable 
                                hours={hours}
                                onIncrementOrDecrement={onIncrementOrDecrement}
                                onChangeOpenOrClose={onChangeOpenOrClose}
                            />
                        </form>
                    </div>
                    <div className="md:w-max mr-4 relative">
                        <h4 className="font-bold text-lg border-b border-gray-900 truncate">Closed Days / Times</h4>
                         
                        <form

                        >
                            <ClosedDaysTimesList 
                                closed={closed}
                                onChangeFromOrTo={onChangeFromOrTo}
                                onChangeRepeat={onChangeRepeat}
                                onChangeRepeatInterval={onChangeRepeatInterval}
                            />
                        </form>
                    </div>
                </div>
            </div>
            <div className="w-1/4 h-full flex flex-col justify-center items-center">
                {(!isQuickProfile && storeDetails) && 
                <button
                    className="font-bold text-sm p-1 text-gray-700 bg-gray-300"
                    onClick={clearStoreDetails}
                >Stop Editing</button>}
                {(info.id === undefined) && 
                <button
                className="font-bold text-sm p-1 text-gray-700 bg-gray-300"
                // onClick={clearStoreDetails}
                >Create {isQuickProfile && 'Quick Profile'}</button>}
            </div>
        </div>
    )
}

export default StoreDetailsForm

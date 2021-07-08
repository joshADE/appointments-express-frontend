import React, { useState, useEffect, useCallback } from 'react'
import { StoreWithDetails, Store, StoreHours, ClosedDaysTimes, RepeatInterval, CreateStoreRequest, UpdateClosedRequest } from '../../../features/store/storeTypes'
import { useAppDispatch } from "../../../app/hooks";
import {
    createUserStore,
    editUserStoreInfo,
    editUserStoreHours,
    editUserStoreClosed
  } from "../../../features/store/storeSlice";
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


const convertArrayHoursToObject = (arrayHours: Partial<StoreHours>[]) => {
    const objectHours : {[dayOfWeek:number]:Partial<StoreHours>} = {};
    arrayHours.forEach(day => {
        if (day.dayOfWeek !== undefined)
            objectHours[day.dayOfWeek] = day;
    }); 
    return objectHours;
}

const convertObjectHoursToArray = (objectHours: {[dayOfWeek:number]:Partial<StoreHours>}) => {
    const arrayHours : Partial<StoreHours>[] = [];
     Object.values(objectHours).forEach(entry => {
        arrayHours.push(entry);
    }); 
    return arrayHours;
}

const StoreDetailsForm: React.FC<StoreDetailsFormProp> = ({
    isQuickProfile,
    storeDetails,
    clearStoreDetails
}) => {
    const [info, setInfo] = useState(storeDetails?storeDetails.store:defaultStoreInfo);
    const [hours, setHours] = useState(storeDetails?convertArrayHoursToObject(storeDetails.storeHours):convertArrayHoursToObject(defaultStoreHours));
    // closed = closed days and times
    const [closed, setClosed] = useState(storeDetails?storeDetails.closedDaysTimes:defaultClosed)
    // keeps track of the deleted closed days and times that have an id so that they can be removed from database
    const [deletedClosed, setDeletedClosed] = useState<Partial<ClosedDaysTimes>[]>([]);
    const [submitButton, setSubmitButton] = useState('');
    const dispatch = useAppDispatch();
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
        setDeletedClosed([]);
    }, [storeDetails])

    useEffect(() => console.log(deletedClosed), [deletedClosed]);

    // functions to send updated data to the server
    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(submitButton);
        if (submitButton === 'createstore'){
            const requestObject : CreateStoreRequest = { store: info, storeHours: convertObjectHoursToArray(hours), closedDaysTimes: closed };
            
            requestObject.store.isQuickProfile = isQuickProfile;
            
            dispatch(
            createUserStore(
                requestObject,
                () => { window.alert("Successfully added store"); clearStoreDetails(); },
                () => window.alert("Failed to add store")
            )
            );
        }

        if (submitButton === 'editinfo' && info.id){
            const payload : Partial<Store> = {};
            // only edit the fields below for the store info
            payload.name = info.name;
            payload.location = info.location;
            payload.minTimeBlock = info.minTimeBlock;
            payload.maxTimeBlock = info.maxTimeBlock;
            dispatch(editUserStoreInfo(info.id, payload, () => alert("success"), () => alert("failure")));
        }

        if (submitButton === 'edithours' && info.id){
            const arrayHours = convertObjectHoursToArray(hours);
            if (arrayHours.every(times => times.storeId === info.id))
                dispatch(editUserStoreHours(info.id, arrayHours, () => alert("success"), () => alert("failure")));
        }

        if (submitButton === 'editclosed' && info.id){
            const toAdd = closed.filter(cdt => cdt.id === undefined);
            const toUpdate = closed.filter(cdt => cdt.id !== undefined);
            const closedRequest : UpdateClosedRequest = {toAdd, toUpdate, toRemove: deletedClosed}

            
            dispatch(
              editUserStoreClosed(
                info.id,
                closedRequest,
                () => { setDeletedClosed([]); alert("success")},
                () => alert("failure")
              )
            );
        }


    }


    // callbacks to change the info state

    const onChangeInfoPropertyByName = useCallback((property: keyof typeof info, newValue: string | number) => {
        setInfo(currentInfo => ({...currentInfo, [property]: newValue}));
    }, []);

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
        setHours(currentHours =>
            currentHours[dayOfWeek] && currentHours[dayOfWeek].isOpen !== undefined ?
            ({...currentHours, [dayOfWeek]:{...currentHours[dayOfWeek],isOpen: value}}):
            currentHours
        );
    }, []);

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

    const addClosed = useCallback(() => {
        setClosed(closed => closed.concat(...defaultClosed));
    },[]);

    const deleteClosed = useCallback((index: number) => {
        if (index < 0 || index >= closed.length)
            return;
        const cdtToDelete = closed[index];

        if (cdtToDelete.id !== undefined){
            setDeletedClosed(deletedClosed => deletedClosed.concat(cdtToDelete));
        }

        setClosed(closed => closed.filter((cdt, i) => i !== index));
        
    }, [closed]);
    return (
        <div className="font-roboto h-full pb-5">
            <form className="w-full h-full flex" onSubmit={handleSubmit}>
            <div className="w-3/4 h-full">
                <h3 className="font-bold text-2xl border-b-2 border-gray-900">{isQuickProfile ? (storeDetails ? "Quick Profile" : "Create Quick Profile") : (storeDetails ? "Edit " + storeDetails.store.name : "Create new store")}</h3>
                <div className="h-full flex flex-col md:flex-row md:flex-wrap overflow-auto">
                    <div className="md:w-56 mr-4 relative">
                        <h4 className="font-bold text-lg border-b border-gray-900">Details</h4>
                        <div>
                            <InfoForm 
                                info={info}
                                onChangeInfoPropertyByName={onChangeInfoPropertyByName}
                            />
                        </div>
                        {(storeDetails?.store.id !== undefined) && ((storeDetails.role.name === 'Owner') ?
                        <button
                            type="submit"
                            className="font-bold text-sm p-1 text-gray-700 bg-gray-300 mt-1"
                            onClick={() => setSubmitButton('editinfo')}
                        >Save</button>: <div className="text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500">Must be owner to edit the details</div>)}
                    </div>
                    <div className="md:w-max mr-4 relative">
                        <h4 className="font-bold text-lg border-b border-gray-900">Hours</h4>
                        
                        <div>
                            <HoursTable 
                                hours={hours}
                                onIncrementOrDecrement={onIncrementOrDecrement}
                                onChangeOpenOrClose={onChangeOpenOrClose}
                            />
                        </div>
                        {(storeDetails?.store.id !== undefined) &&
                        <button
                            type="submit"
                            className="font-bold text-sm p-1 text-gray-700 bg-gray-300 mt-1"
                            onClick={() => setSubmitButton('edithours')}
                        >Save</button>}
                    </div>
                    <div className="md:w-max mr-4 relative">
                        <h4 className="font-bold text-lg border-b border-gray-900 truncate">Closed Days / Times</h4>
                         
                        <div className="flex items-start">
                            <ClosedDaysTimesList 
                                closed={closed}
                                onChangeFromOrTo={onChangeFromOrTo}
                                onChangeRepeat={onChangeRepeat}
                                onChangeRepeatInterval={onChangeRepeatInterval}
                                addClosed={addClosed}
                                deleteClosed={deleteClosed}
                            />
                            {(storeDetails?.store.id !== undefined) &&
                            <button
                                type="submit"
                                className="font-bold text-sm p-1 text-gray-700 bg-gray-300"
                                onClick={() => setSubmitButton('editclosed')}
                            >Save</button>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-1/4 h-full flex flex-col justify-center items-center">
                {(!isQuickProfile && storeDetails) && 
                <button
                    type="button"
                    className="font-bold text-sm p-1 text-gray-700 bg-gray-300"
                    onClick={clearStoreDetails}
                >Stop Editing</button>}
                {(storeDetails?.store.id === undefined) && 
                <button
                    type="submit"
                    className="font-bold text-sm p-1 text-gray-700 bg-gray-300"
                    onClick={() => setSubmitButton('createstore')}
                >Create {isQuickProfile && 'Quick Profile'}</button>}
            </div>
            </form>
        </div>
    )
}

export default StoreDetailsForm

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
import { Button } from '../../shared/Button';
import { Overrides } from './ManageStore';

interface StoreDetailsFormProp {
    isQuickProfile: boolean;
    storeDetails?: StoreWithDetails;
    clearStoreDetails: () => void;
    tranferOverrides: (newOverrides: Overrides) => void;
    overrides?: Overrides; 
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
export type OverridePropertiesKeys = keyof Omit<Store, 'id' | 'createdAt' | 'isQuickProfile'> | 'hours' | 'closed';
export type OverrideProperties = Record<OverridePropertiesKeys, boolean>


const initialOverrides : OverrideProperties = {
    name: false,
    location: false,
    minTimeBlock: false,
    maxTimeBlock: false,
    hours: false,
    closed: false
}; 

const StoreDetailsForm: React.FC<StoreDetailsFormProp> = ({
    isQuickProfile,
    storeDetails,
    clearStoreDetails,
    tranferOverrides,
    overrides
}) => {
    const [info, setInfo] = useState(storeDetails?storeDetails.store:defaultStoreInfo);
    const [hours, setHours] = useState(storeDetails?convertArrayHoursToObject(storeDetails.storeHours):convertArrayHoursToObject(defaultStoreHours));
    // closed = closed days and times
    const [closed, setClosed] = useState(storeDetails?storeDetails.closedDaysTimes:defaultClosed)
    // keeps track of the deleted closed days and times that have an id so that they can be removed from database
    const [deletedClosed, setDeletedClosed] = useState<Partial<ClosedDaysTimes>[]>([]);

    const [overrideProperties, setOverrideProperties] = useState(initialOverrides);
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
    // useEffect(() => console.log(overrideProperties), [overrideProperties]);


    useEffect(() => {
        if (overrides){
            // merge this component state with the ovverides properties if they exist
            setInfo(currentinfo => ({...currentinfo, ...overrides.store, id: currentinfo.id, createdAt: currentinfo.createdAt, isQuickProfile: currentinfo.isQuickProfile }));
            setHours(currenthours => Object.keys(currenthours).map(dayOfWeek => ({...currenthours[+dayOfWeek], ...overrides.storeHours[+dayOfWeek], dayOfWeek: +dayOfWeek, storeId: currenthours[+dayOfWeek].storeId})));
            // for the closed days and times we will just add the closed days and time that recieve from the overrides (without the id/storeId)
            // this is so that we don't have to edit the deletedClosed array making the app much more complicated
            setClosed(currentclosed => currentclosed.concat(overrides.closedDaysTimes.map(override => ({ from: override.from, to: override.to, repeat: override.repeat, repeatInterval: override.repeatInterval }))));
        }
    }, [overrides])


    const handleTransferOverrides = () => {
        const tranferInfo: Partial<Store> = {};
        let tranferHours: {[dayOfWeek:number]:Partial<StoreHours>} = {};
        let tranferClosed: Partial<ClosedDaysTimes>[] = [];
        if (overrideProperties.name)
            tranferInfo.name = info.name;
        if (overrideProperties.location)
            tranferInfo.location = info.location;
        if (overrideProperties.minTimeBlock)
            tranferInfo.minTimeBlock = info.minTimeBlock;
        if (overrideProperties.maxTimeBlock)
            tranferInfo.maxTimeBlock = info.maxTimeBlock;

        if (overrideProperties.hours)
            tranferHours = hours;
        
        if (overrideProperties.closed)
            tranferClosed = closed;

        tranferOverrides({ store: tranferInfo, storeHours: tranferHours, closedDaysTimes: tranferClosed });
    }


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

    // callbacks to change the overrideProperties state

    const onChangeOverridePropertyByKey = useCallback((property: OverridePropertiesKeys, newValue: boolean) => {
        setOverrideProperties(currentProperties => ({...currentProperties, [property]: newValue}));
    }, []);


    // callbacks to change the info state

    const onChangeInfoPropertyByName = useCallback((property: keyof typeof info, newValue: string | number) => {
        setInfo(currentInfo => ({...currentInfo, [property]: newValue}));
    }, []);

    // callbacks to changes the hours state
    const onChangeHours = useCallback((dayOfWeek: number, isOpenTime: boolean, newTime: string) => {
        if (isOpenTime)
            setHours(currentHours => 
                currentHours[dayOfWeek] && currentHours[dayOfWeek].open ? 
                Object.assign({}, currentHours, 
                    {[dayOfWeek]: { ...currentHours[dayOfWeek], open: newTime}}):
                currentHours);
        else
            setHours(currentHours => 
                currentHours[dayOfWeek] && currentHours[dayOfWeek].close ? 
                Object.assign({}, currentHours, 
                    {[dayOfWeek]: { ...currentHours[dayOfWeek], close: newTime}}):
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
            <form className="w-full h-full flex flex-col md:flex-row" onSubmit={handleSubmit}>
            <div className="md:w-3/4 h-full">
                <h3 className="font-bold text-2xl border-b-2 border-gray-900">{isQuickProfile ? (storeDetails ? "Quick Profile" : "Create Quick Profile") : (storeDetails ? "Edit " + storeDetails.store.name : "Create new store")}</h3>
                <div className="h-full flex flex-col md:flex-row md:flex-wrap overflow-auto">
                    <div className="md:w-56 mr-4 relative">
                        <h4 className="font-bold text-lg border-b border-gray-900">Details</h4>
                        <div>
                            <InfoForm 
                                info={info}
                                onChangeInfoPropertyByName={onChangeInfoPropertyByName}
                                showOverrideOption={isQuickProfile && storeDetails !== undefined}
                                overrideProperties={overrideProperties}
                                onChangeOverridePropertyByKey={onChangeOverridePropertyByKey}
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
                        
                        <div className="overflow-x-auto">
                            <HoursTable 
                                hours={hours}
                                onChangeHours={onChangeHours}
                                onChangeOpenOrClose={onChangeOpenOrClose}
                            />
                            {(isQuickProfile && storeDetails !== undefined) && 
                            <div className="inline-block">
                                {" "}
                                {'<'} <input type="checkbox" checked={overrideProperties.hours} onChange={e => onChangeOverridePropertyByKey('hours', e.target.checked)} />
                            </div>}
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
                            {(isQuickProfile && storeDetails !== undefined) && 
                            <div className="inline-block">
                                {" "}
                                 <input 
                                    type="checkbox" 
                                    checked={overrideProperties.closed} 
                                    onChange={e => {onChangeOverridePropertyByKey('closed', e.target.checked); alert('When copying over the closed days/time it will add the closed days/time rather than replace them')}} 
                                />
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:w-1/4 md:h-full flex flex-col items-start justify-center md:items-center">
                {(!isQuickProfile && storeDetails) && 
                <Button
                    type="button"
                    className="h-12"
                    onClick={clearStoreDetails}
                >Stop Editing</Button>}
                {(storeDetails?.store.id === undefined) && 
                <Button
                    type="submit"
                    className="h-12"
                    onClick={() => setSubmitButton('createstore')}
                >Create {isQuickProfile && 'Quick Profile'}</Button>}
                {(isQuickProfile && storeDetails) && 
                <Button
                    type="button"
                    className="h-12"
                    onClick={handleTransferOverrides}
                >Transfer selected fields</Button>}
            </div>
            </form>
        </div>
    )
}

export default StoreDetailsForm

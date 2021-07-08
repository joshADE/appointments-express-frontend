import React, { memo } from 'react'
import { Store } from '../../../features/store/storeTypes'
import InfoFormElement from './InfoFormElement'

interface InfoFormProps {
    info: Partial<Store>;
    onChangeInfoPropertyByName: (property: keyof Store, newValue: string | number) => void;
}

const timeBlockOptions = [
    {label:'5', value: 5}, 
    {label:'10', value: 10}, 
    {label:'15', value: 15}, 
    {label:'30', value: 30}, 
    {label:'60', value: 60}
]

const InfoForm: React.FC<InfoFormProps> = ({
    info,
    onChangeInfoPropertyByName
}) => {

    const changeMinTimeBlock = (newValue: number) => {
        if (info.maxTimeBlock !== undefined && newValue > info.maxTimeBlock){
            onChangeInfoPropertyByName('minTimeBlock', newValue);
            onChangeInfoPropertyByName('maxTimeBlock', newValue); 
        }else{ 
            onChangeInfoPropertyByName('minTimeBlock', newValue);
        }
    }

    const changeMaxTimeBlock = (newValue: number) => {
        if(info.minTimeBlock !== undefined && newValue >= info.minTimeBlock) 
            onChangeInfoPropertyByName('maxTimeBlock', newValue);  
        else 
            alert('Max time block cannot be less than min time block');
    }

    console.log('Rerendered InfoForm');
    return (
        <>
            <InfoFormElement 
                id="name"
                label="Name"
                name="name"
                type="text"
                value={info.name}
                onChange={e => onChangeInfoPropertyByName('name', e.target.value)}
                isRequired
            />
            <InfoFormElement 
                id="location"
                label="Location"
                name="location"
                type="text"
                value={info.location}
                onChange={e => onChangeInfoPropertyByName('location', e.target.value)}
                isRequired
            />
            <InfoFormElement 
                id="minTimeBlock"
                label="Min. Time Block"
                name="minTimeBlock"
                type="select"
                value={info.minTimeBlock}
                onChange={e => changeMinTimeBlock(+e.target.value)}
                options={timeBlockOptions}
            />
            <InfoFormElement 
                id="maxTimeBlock"
                label="Max. Time Block"
                name="maxTimeBlock"
                type="select"
                value={info.maxTimeBlock}
                onChange={e => changeMaxTimeBlock(+e.target.value)}
                options={timeBlockOptions}
            />
        </>
    )
}

export default memo(InfoForm)

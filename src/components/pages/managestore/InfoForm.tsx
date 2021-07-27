import React, { memo } from 'react'
import { Store } from '../../../features/store/storeTypes'
import InfoFormElement from './InfoFormElement'
import { OverrideProperties, OverridePropertiesKeys } from './StoreDetailsForm'

interface InfoFormProps {
    info: Partial<Store>;
    onChangeInfoPropertyByName: (property: keyof Store, newValue: string | number) => void;
    showOverrideOption: boolean;
    overrideProperties: OverrideProperties;
    onChangeOverridePropertyByKey: (property: OverridePropertiesKeys, newValue: boolean) => void;
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
    onChangeInfoPropertyByName,
    showOverrideOption,
    overrideProperties,
    onChangeOverridePropertyByKey
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
                showOverrideOption={showOverrideOption}
                overrideChecked={overrideProperties.name}
                onOverrideCheckedChanged={e => onChangeOverridePropertyByKey('name', e)}
            />
            <InfoFormElement 
                id="location"
                label="Location"
                name="location"
                type="text"
                value={info.location}
                onChange={e => onChangeInfoPropertyByName('location', e.target.value)}
                isRequired
                showOverrideOption={showOverrideOption}
                overrideChecked={overrideProperties.location}
                onOverrideCheckedChanged={e => onChangeOverridePropertyByKey('location', e)}
            />
            <InfoFormElement 
                id="minTimeBlock"
                label="Min. Time Block"
                name="minTimeBlock"
                type="select"
                value={info.minTimeBlock}
                onChange={e => changeMinTimeBlock(+e.target.value)}
                options={timeBlockOptions}
                showOverrideOption={showOverrideOption}
                overrideChecked={overrideProperties.minTimeBlock}
                onOverrideCheckedChanged={e => onChangeOverridePropertyByKey('minTimeBlock', e)}
            />
            <InfoFormElement 
                id="maxTimeBlock"
                label="Max. Time Block"
                name="maxTimeBlock"
                type="select"
                value={info.maxTimeBlock}
                onChange={e => changeMaxTimeBlock(+e.target.value)}
                options={timeBlockOptions}
                showOverrideOption={showOverrideOption}
                overrideChecked={overrideProperties.maxTimeBlock}
                onOverrideCheckedChanged={e => onChangeOverridePropertyByKey('maxTimeBlock', e)}
            />
        </>
    )
}

export default memo(InfoForm)

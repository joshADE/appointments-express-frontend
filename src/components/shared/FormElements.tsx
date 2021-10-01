import React from 'react'
import { FieldHookConfig, useField } from 'formik'
import ErrorNotice from './ErrorNotice';

interface FormTextInputProps {
    label: string;
    id?: string;
    disabled?: boolean;
    props: FieldHookConfig<string>
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
    label,
    id,
    disabled,
    props
}) => {
    const [field, meta] = useField(props);
    return (<div className="w-3/4 mb-10 mx-auto">
        <label className="block text-sm text-gray-400 mb-5" htmlFor={id || field.name}>{label}</label>
        <input className="border-b text-lg text-gray-700 border-gray-700 disabled:opacity-75 focus:outline-none w-full" {...field} placeholder={props.placeholder} type={props.type} disabled={disabled} />
        {(meta.touched && meta.error) && <ErrorNotice message={meta.error} />}
    </div>);
}

interface FormSelectProps<T> {
    label: string;
    id?: string;
    disabled?: boolean;
    options: { label:string; value: T }[];
    props: FieldHookConfig<string>
}

export const FormSelect: React.FC<FormSelectProps<any>> = ({
    label,
    id,
    disabled,
    options,
    props
}) => {
    const [field, meta] = useField(props);
    return (<div className="w-3/4 mb-10 mx-auto">
        <label className="block text-sm text-gray-400 mb-5" htmlFor={id || field.name}>{label}</label>
        <select className="border-b text-lg text-gray-700 border-gray-700 disabled:opacity-75 focus:outline-none w-full" {...field} placeholder={props.placeholder} disabled={disabled}>
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        {(meta.touched && meta.error) && <ErrorNotice message={meta.error} />}
    </div>);
}
import React from 'react'
import { FieldHookConfig, useField } from 'formik'
import ErrorNotice from './ErrorNotice';

interface FormTextInputProps {
    label: string;
    id?: string;
    props: FieldHookConfig<string>
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
    label,
    id,
    props
}) => {
    const [field, meta] = useField(props);
    return (<div className="w-3/4 mb-10 mx-auto">
        <label className="block text-sm text-gray-400 mb-5" htmlFor={id || field.name}>{label}</label>
        <input className="border-b text-lg text-gray-700 border-gray-700 focus:outline-none w-full" {...field} placeholder={props.placeholder} type={props.type} />
        {(meta.touched && meta.error) && <ErrorNotice message={meta.error} />}
    </div>);
}
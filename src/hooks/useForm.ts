import React, { useState } from "react";

const useForm: <T>(
  initialValues: T,
  validate: Function
) => {
  values: T;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  errors: { [name: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [name: string]: string }>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
} = (initialFieldValues, validate) => {
  const [values, setValues] = useState(initialFieldValues);

  const [errors, setErrors] = useState<{ [name: string]: string }>({});

  const handleInputChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const fieldValue = { [name]: value };
    setValues({
      ...values,
      ...fieldValue,
    });
    validate(fieldValue);
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
  };
};
 
export default useForm;
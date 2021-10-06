import { Form, Formik } from 'formik';
import * as yup from 'yup';
import React from 'react'
import { RiMailSendLine } from 'react-icons/ri';
import { FormTextInput } from '../../shared/FormElements';

interface ModalContentFormProps {
    saveAndSendAppointment: (values: { email: string; firstName: string; lastName: string; }) => void
}

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
}

const ModalContentForm: React.FC<ModalContentFormProps> = ({
    saveAndSendAppointment
}) => {

    return (
        <div className="text-gray-500 flex flex-col justify-center items-center">

        <Formik
            initialValues={initialValues}
            validationSchema={yup.object({
              firstName: yup
                .string()
                .min(2, "first name must be at least 2 characters")
                .required(),
              lastName: yup
                .string()
                .min(2, "last name must be at least 2 characters")
                .required(),
              email: yup
                .string()
                .email()
                .required(),
            })}
            onSubmit={async (values, actions) => {
                saveAndSendAppointment(values);
                actions.resetForm();
            }}
          >
              <Form>
                  <FormTextInput
                    label="First Name"
                    props={{
                      name: "firstName",
                      type: "text",
                      placeholder: "John",
                    }}
                  />
                  <FormTextInput
                    label="Last Name"
                    props={{
                      name: "lastName",
                      type: "text",
                      placeholder: "Doe",
                    }}
                  />
                  <FormTextInput
                    label="Email"
                    props={{
                      name: "email",
                      type: "email",
                      placeholder: "johndoe@email.com",
                    }}
                  />
                <button type="submit" className=" w-full border border-gray-500 hover:bg-gray-500 hover:text-white rounded-md my-2" >
                    <RiMailSendLine className="inline-block mx-1" /> 
                    <span className="inline-block mx-1">Send</span>
                </button>
                  
              </Form>
            
          </Formik>
        
    </div>);
}

export default ModalContentForm;
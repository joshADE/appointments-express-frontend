import React, { memo } from 'react'
import { Appointment, AppointmentStatus } from '../../features/appointment/appointmentTypes';
import * as CgIcons from 'react-icons/cg'
import { Events } from 'react-week-schedulr';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { FormSelect, FormTextInput } from './FormElements';
import { Button } from './Button';

const statusOptions = [
    { label: 'Pending', value: AppointmentStatus.pending },
    { label: 'Complete', value: AppointmentStatus.complete },
    { label: 'Declined', value: AppointmentStatus.declined },
]

interface AppointmentDetailsFormProps {
    appointments: Appointment[] | undefined;
    updateAppointment: (values: { id: string | null; title: string | undefined; desc: string | undefined; start: Date; end: Date; status: AppointmentStatus | undefined; }) => void;
    events: Events;
    readonly?: boolean;
    statusVisible?: boolean;
    setSelectedAppointmentId: (value: React.SetStateAction<string | null>) => void;
    selectedAppointmentId: string | null;
    hiddenDetails?: boolean;
}

const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
    appointments,
    updateAppointment,
    readonly,
    statusVisible,
    hiddenDetails,
    setSelectedAppointmentId,
    selectedAppointmentId,
    events,
}) => {
    
        const appointmentEventDetails = selectedAppointmentId ? events[selectedAppointmentId] : undefined;
        const appointment = selectedAppointmentId? appointments?.find(app => app.id === Number(selectedAppointmentId)) : undefined;
        const status = appointment ? appointment.status : undefined;
        return (
        <div className="h-full overflow-y-auto relative">
            {appointmentEventDetails !== undefined &&
            <button 
                className="absolute top-0 right-0 rounded-xl bg-gray-200 p-2 focus:outline-none hover:bg-gray-400 hover:text-white" 
                onClick={() => setSelectedAppointmentId(null)}
            ><CgIcons.CgClose /></button>}
            <h3 className="font-oswald text-base text-center">Appointment Details</h3>

            {appointmentEventDetails !== undefined ?
            <Formik
            enableReinitialize
            initialValues={{ title: appointmentEventDetails.title, desc: appointmentEventDetails.desc, start: appointmentEventDetails.range[0], end: appointmentEventDetails.range[1], status }}
            validationSchema={yup.object({
              title: yup
                .string()
                .required("title is required")
                .min(2, "title must be at least 2 characters"),
              desc: yup
                .string(),
              start: yup
                .date(),
              end: yup
                .date(),
            })}
            onSubmit={(values, actions) => {
              
                const { title, desc, start, end, status } =
                    values;
                updateAppointment({ id: selectedAppointmentId, title, desc, start, end, status });
                
            }}
          >
            {(props) => (
              <Form>
                <div className="grid grid-cols-1 lg:grid-cols-2 pt-5">
                  <FormTextInput
                    label="Title"
                    props={{
                      name: "title",
                      type: "text",
                    }}
                  />
                  <FormTextInput
                    label="Description"
                    props={{
                      name: "desc",
                      type: "text",
                    }}
                  />
                  <FormTextInput
                    label="Start Date / Time"
                    disabled
                    props={{ name: "start", type: "text" }}
                  />
                  <FormTextInput
                    label="End Date / Time"
                    disabled
                    props={{ name: "end", type: "text" }}
                  />
                {status !== undefined && 
                <FormSelect
                    label="Status"
                    props={{ name: "status" }}
                    options={statusOptions}
                  />}
                  
                  <div className="lg:col-span-2 flex justify-center items-center py-3 flex-col lg:flex-row">
                    <Button
                      type="submit"
                      className="mr-2 mb-2"
                    >
                      Save the details
                    </Button>
                    <Button
                      type="button"
                      bare
                      className="mr-2 mb-2"
                      onClick={() => props.resetForm()}
                    >
                      Reset Changes
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
            :
            <div className="text-center text-gray-500">
                Must select an appointment on the scheduler first to see the details
            </div>}
        </div>);
}

export default memo(AppointmentDetailsForm)
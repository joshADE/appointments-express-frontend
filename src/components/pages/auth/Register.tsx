import React, { useState } from 'react'
import { PuffLoader } from 'react-spinners';
import { Link } from 'react-router-dom'
import { UserRegisterData } from '../../../features/user/userTypes'
import { useGetUsersQuery, useRegisterMutation, useLoginMutation } from '../../../app/services/appointments'
import { css } from '@emotion/react';
import { Left } from './Left';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { FormTextInput } from "../../shared/FormElements";
import { Button } from "../../shared/Button";
import AvatarPhotoUploader, { PreviewFile } from '../../shared/AvatarPhotoUploader';
import DefaultProfilePhoto from '../../../assets/profile-picture.jpg'

interface RegisterProps {
  isLoading: boolean;
}

const initialValues = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    passwordConfirm: '',
    email: ''
}

const override = css`
    display: inline-block;
    top: 4px;
`;

const Register: React.FC<RegisterProps> = ({ isLoading }) => {
    const { isFetching: allUsersFetching, data: allUsers } = useGetUsersQuery();
    const [register, { isLoading: registerLoading }] = useRegisterMutation();
    const [login, { isLoading: loginLoading }] = useLoginMutation();
    const [photo, setPhoto] = useState<PreviewFile>()
    const [photoWithoutPreview, setPhotoWithoutPreview] = useState<File | null>(null);





    return (
      <section className="w-screen h-screen overflow-auto flex flex-col lg:flex-row">
        <Left />
        <div className="w-full lg:w-1/2 h-3/4 lg:h-full p-10 font-roboto lg:overflow-auto">
          <h1 className="text-center font-oswald text-4xl mb-10">Register</h1>
          <p className="text-sm text-center text-gray-500 mb-10">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600">
              Login
            </Link>
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={yup.object({
              firstName: yup
                .string()
                .required("first name is required")
                .min(2, "first name must be at least 2 characters"),
              lastName: yup
                .string()
                .required("last name is required")
                .min(2, "last name must be at least 2 characters"),
              username: yup
                .string()
                .required()
                .min(2)
                .not(
                  allUsers? allUsers.map((u) => u.username): [],
                  "username is already taken"
                ),
              password: yup.string().required().min(6),
              passwordConfirm: yup
                .string()
                .oneOf([yup.ref("password"), null], "passwords must match"),
              email: yup
                .string()
                .email()
                .required()
                .not(
                  allUsers? allUsers.map((u) => u.email): [],
                  "email is already taken"
                ),
            })}
            onSubmit={async (values, actions) => {
              const { email, firstName, lastName, password, username } = values;
              const formData = new FormData();
              
              const payload: UserRegisterData = {
                email,
                firstName,
                lastName,
                password,
                username,
                avatar: photoWithoutPreview
              };
              Object.entries(payload).forEach(entry => {
                formData.append(entry[0], entry[1]);
              })
              try { 
                await register(formData).unwrap();
                await login({ username, password }).unwrap();
                // authentication management is handled in the auth slice
                // error management is also handled there aswell
                actions.resetForm();
              }catch (err) {
                console.log(err)
              }
                  
            }}
          >
            <Form>
              <AvatarPhotoUploader 
                name="photo"
                handleFile={(p, pWP) => { setPhoto(p); setPhotoWithoutPreview(pWP)}}
                defaultImg={DefaultProfilePhoto}
                file={photo}
                className="mx-auto w-60 h-60"
              />
              <FormTextInput
                label="First Name"
                props={{ name: "firstName", type: "text", placeholder: "John" }}
              />
              <FormTextInput
                label="Last Name"
                props={{ name: "lastName", type: "text", placeholder: "Doe" }}
              />
              <FormTextInput
                label="Username"
                props={{ name: "username", type: "text", placeholder: "jdoe" }}
              />
              <FormTextInput
                label="Password"
                props={{ name: "password", type: "password" }}
              />
              <FormTextInput
                label="Confirm Password"
                props={{ name: "passwordConfirm", type: "password" }}
              />
              <FormTextInput
                label="Email"
                props={{
                  name: "email",
                  type: "email",
                  placeholder: "jdoe@email.com",
                }}
              />

              <Button
                type="submit"
                disabled={isLoading || allUsersFetching || registerLoading || loginLoading}
                className="mx-auto block"
              >
                <div className="flex justify-center items-center">
                  <span className="mr-2">Register</span>
                  <PuffLoader
                    color="#369952"
                    loading={isLoading || allUsersFetching || registerLoading || loginLoading}
                    size="24px"
                    css={override}
                  />
                </div>
              </Button>
            </Form>
          </Formik>
        </div>
      </section>
    );
}

export default Register

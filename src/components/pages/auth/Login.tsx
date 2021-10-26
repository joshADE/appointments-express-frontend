import React from "react";
import { PuffLoader } from "react-spinners";
import { useLoginMutation } from '../../../app/services/appointments'
import { css } from "@emotion/react";
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom'
import * as yup from 'yup';
import { FormTextInput } from "../../shared/FormElements";
import { Button } from "../../shared/Button";
import { Left } from "./Left";

interface LoginProps {
  isLoading: boolean;
}

const initialValues = {
  username: "",
  password: "",
};

const override = css`
  display: inline-block;
  top: 4px;
`;

const Login: React.FC<LoginProps> = ({ isLoading }) => {
  const [login, { isLoading: loginLoading }] = useLoginMutation();



  return (
    <section className="w-screen h-screen overflow-auto flex flex-col lg:flex-row">
      <Left />
      <div className="w-full lg:w-1/2 h-3/4 lg:h-full p-10 font-roboto">
        <h1 className="text-center font-oswald text-4xl mb-10">Login</h1>
        <p className="text-sm text-center text-gray-500 mb-10">Don't have an account? <Link to="/register" className="text-green-600">Sign Up</Link></p>
        <Formik
          initialValues={initialValues}
          validationSchema={yup.object({
            username: yup.string()
              .min(2, 'Must be 2 characters or more')
              .required('Required'),
            password: yup.string()
              .required('Required')
          })}
          onSubmit={async (values, actions) => {
            try { 
              
              await login(values).unwrap();
              // authentication management is handled in the auth slice
              // error management is also handled there aswell
              actions.resetForm();
            }catch (err) {
              console.log(err)
              const error: any = err;
              if (error?.data?.errors){
                alert(error.data.errors)
              }else{
                alert("Error: There was a problem in the login process. Try again later.")
              }
            }
          }}
        >
          <Form>
          
            <FormTextInput 
              label="Username"
              props={{ name: 'username', type: 'text', placeholder: 'jdoe'}}
            />
            <FormTextInput 
              label="Password"
              props={{ name: 'password', type: 'password'}}
            />
          
            <Button
              type="submit"
              disabled={isLoading || loginLoading}
              className="mx-auto block"
            >
              <div className="flex justify-center items-center">
                <span className="mr-2">Login</span>
                <PuffLoader
                  color="#369952"
                  loading={isLoading || loginLoading}
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
};

export default Login;

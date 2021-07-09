import React, { useState, useEffect } from 'react'
import { PuffLoader } from 'react-spinners';
import { useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import useForm from '../../../hooks/useForm';
import { register, selectUserState } from '../../../features/user/userSlice'
import ErrorNotice from '../../shared/ErrorNotice';
import { css } from '@emotion/react';

interface RegisterProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialValues = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: ''
}

const override = css`
    display: inline-block;
    top: 4px;
`;

const Register: React.FC<RegisterProps> = ({ isAuthenticated, isLoading }) => {
    const { allUsers } = useAppSelector(selectUserState);
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const history = useHistory();
    const dispatch = useAppDispatch();

    // useEffect(() => {
    //     // race condition to set isLoading to false (enabling the user to register) between this dispatch and the main App.tsx dispatch of loadUser
    //     // instead dispatch fetch all users only after the loadUsers is finished as a callback in App.tsx
    //     dispatch(fetchAllUser());
    // }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated)
          history.push('/dashboard');
    }, [isAuthenticated, history]);



    const validate : (fieldValues: typeof initialValues) => boolean | undefined = (fieldValues = values) => {
        let temp = {} as typeof initialValues;
        if ('username' in fieldValues)
            temp.username = allUsers.every(user => user.username !== fieldValues.username) ? "" : "Username already taken";
        if ('email' in fieldValues)
            temp.email = allUsers.every(user => user.email !== fieldValues.email) ? "" : "Email already taken";
        if ('password' in fieldValues)
            temp.password = passwordConfirm === fieldValues.password ? "" : "Passwords do not match";
        setErrors({
            ...temp
        })
        if (fieldValues === values)
            return Object.values(temp).every(x => x === "");
    }

    const {
        values, 
        setValues,
        errors,
        setErrors,
        handleInputChange
    } = useForm(initialValues, validate);


    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate(values)) {
          dispatch(
            register(
              values,
              () => {
                setValues(initialValues);
                history.push("/dashboard");
              },
              () => window.alert("Failed to register")
            )
          );
        }
    } 

    return (
      <div>
        <h1>Register for an account</h1>
        <form className="" autoComplete="off" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              onChange={handleInputChange}
              required
              value={values.firstName}
            />
            {errors.firstName && (
              <ErrorNotice
                message={errors.firstName}
              />
            )}
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              onChange={handleInputChange}
              required
              value={values.lastName}
            />
            {errors.lastName && (
              <ErrorNotice
                message={errors.lastName}
              />
            )}
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={handleInputChange}
              required
              value={values.username}
            />
            {errors.username && (
              <ErrorNotice
                message={errors.username}
              />
            )}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleInputChange}
              required
              value={values.password}
            />
            {errors.password && (
              <ErrorNotice
                message={errors.password}
              />
            )}
          </div>
          <div>
            <label htmlFor="passwordConfirm">Confirm Password:</label>
            <input
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              value={passwordConfirm}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
              required
              value={values.email}
            />
            {errors.email && (
              <ErrorNotice
                message={errors.email}
              />
            )}
          </div>

          <button
            className="border-2 rounded-md px-3 py-1 text-white bg-green-500 hover:bg-green-900 disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            <span
                className="mr-2"
            >Register</span>
            <PuffLoader color="#ffffff" loading={isLoading} size="20px" css={override} />
          </button>
        </form>
      </div>
    );
}

export default Register

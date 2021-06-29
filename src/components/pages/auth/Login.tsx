import React, { useEffect } from "react";
import { PuffLoader } from "react-spinners";
import { useHistory } from "react-router-dom";
import useForm from "../../../hooks/useForm";
import { login } from "../../../features/user/userSlice";
import { useAppDispatch } from "../../../app/hooks";
import ErrorNotice from "./ErrorNotice";
import { css } from "@emotion/react";

interface LoginProps {
  isAuthenticated: boolean;
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

const Login: React.FC<LoginProps> = ({ isAuthenticated, isLoading }) => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) history.push("/dashboard");
  }, [isAuthenticated, history]);

  const validate: (fieldValues: typeof initialValues) => boolean | undefined = (
    fieldValues = values
  ) => {
    let temp = {} as typeof initialValues;
    // login validation logic here
    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    initialValues,
    validate
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate(values)) {
      dispatch(
        login(
          values,
          () => {
            setValues(initialValues);
            history.push("/dashboard");
          },
          () => window.alert("Failed to login")
        )
      );
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form className="" autoComplete="off" onSubmit={handleSubmit}>
        
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
              clearError={() => setErrors({ ...errors, username: "" })}
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
              clearError={() => setErrors({ ...errors, password: "" })}
            />
          )}
        </div>
        
        <button
          className="border-2 rounded-md px-3 py-1 text-white bg-green-500 hover:bg-green-900 disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          <span className="mr-2">Login</span>
          <PuffLoader
            color="#ffffff"
            loading={isLoading}
            size="20px"
            css={override}
          />
        </button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  useGetUsersQuery,
  useEditAvatarMutation,
  useEditAccountMutation,
  useDeleteAccountMutation,
} from "../../../app/services/appointments";
import AvatarPhotoUploader, {
  PreviewFile,
} from "../../shared/AvatarPhotoUploader";
import DashboardPageHeader from "../../shared/DashboardPageHeader";
import { useAppSelector } from "../../../app/hooks";
import DefaultProfilePhoto from "../../../assets/profile-picture.jpg";
import { FormTextInput } from "../../shared/FormElements";
import { Button } from "../../shared/Button";
import {
  UserEditAvatarData,
  UserEditAccountData,
} from "../../../features/user/userTypes";

const initialValues = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  passwordConfirm: "",
  email: "",
};

const ManageAccount: React.FC = () => {
  const { isFetching: allUsersFetching, data: allUsers } = useGetUsersQuery();
  const [editAvatar, { isLoading: isEditingAvatar }] = useEditAvatarMutation();
  const [editAccount, { isLoading: isEditingAccount }] =
    useEditAccountMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
  const { user } = useAppSelector((state) => state.auth);
  const [photo, setPhoto] = useState<PreviewFile>();
  const [photoWithoutPreview, setPhotoWithoutPreview] = useState<File | null>(
    null
  );

  const handleSavePhoto = async () => {
    if (photoWithoutPreview === null) return;
    const formData = new FormData();

    const payload: UserEditAvatarData = {
      avatar: photoWithoutPreview,
    };
    Object.entries(payload).forEach((entry) => {
      formData.append(entry[0], entry[1]!);
    });
    try {
      await editAvatar(formData).unwrap();
      alert("Successfully edited photo");
    } catch (err) {
      alert("Failed to edit photo");
    }
  };

  const handleDeletePhoto = async () => {
    const formData = new FormData();
    // 'avatar' formData will be null when sent to the database

    try {
      await editAvatar(formData).unwrap();
      alert("Successfully deleted photo");
    } catch (err) {
      alert("Failed to delete photo");
    }
  };

  const handleDeleteAccount = async () => {
    const response = window.confirm("Are you sure you want to delete your account?");
    if (!response) return;

    try {
      await deleteAccount().unwrap();
      alert("Successfully deleted account. Logging out...");
      // logging out is handled in the auth slice
    } catch (err) { 
      alert("Failed to delete account");
    }
  }
  return (
    <div className="overflow-y-auto h-full w-11/12 font-roboto p-4">
      <DashboardPageHeader title="Account Details" />

      {user ? (
        <div className="mt-5 bg-white rounded-lg shadow p-5">
          <div className="my-5">
            <AvatarPhotoUploader
              name="photo"
              handleFile={(p, pWP) => {
                setPhoto(p);
                setPhotoWithoutPreview(pWP);
              }}
              defaultImg={user.avatarUrl ? user.avatarUrl : DefaultProfilePhoto}
              file={photo}
              className="mx-auto w-36 h-36 rounded-full"
            />
            <div className="flex justify-center items-center py-3 flex-col lg:flex-row">
              <Button
                type="button"
                outline
                className="mr-2 mb-2"
                onClick={handleSavePhoto}
                disabled={isEditingAvatar}
              >
                Save Photo
              </Button>
              <Button
                type="button"
                bare
                className="mr-2 mb-2"
                onClick={handleDeletePhoto}
                disabled={isEditingAvatar}
              >
                Delete Photo
              </Button>
            </div>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={yup.object({
              firstName: yup
                .string()
                .min(2, "first name must be at least 2 characters"),
              lastName: yup
                .string()
                .min(2, "last name must be at least 2 characters"),
              username: yup
                .string()
                .transform((curr) => (curr as string).toLowerCase())
                .min(2)
                .not(
                  allUsers ? allUsers.map((u) => u.username) : [],
                  "username is already taken"
                ),
              password: yup.string().min(6),
              passwordConfirm: yup
                .string()
                .oneOf([yup.ref("password"), null], "passwords must match"),
              email: yup
                .string()
                .transform((curr) => (curr as string).toLowerCase())
                .email()
                .not(
                  allUsers ? allUsers.map((u) => u.email) : [],
                  "email is already taken"
                ),
            })}
            onSubmit={async (values, actions) => {
              try {
                const { firstName, lastName, email, password, username } =
                  values;
                const payload: UserEditAccountData = {};
                if (firstName) {
                  payload.firstName = firstName;
                }
                if (lastName) {
                  payload.lastName = lastName;
                }
                if (email) {
                  payload.email = email;
                }
                if (password) {
                  payload.password = password;
                }
                if (username) {
                  payload.username = username;
                }

                await editAccount(payload).unwrap();
                alert("Successfully edited account");
                actions.resetForm();
              } catch (err) {
                let message = "Failed to edit account. ";
                if (err.data?.errors){
                  message = message + err.data.errors;
                }
                alert(message);
              }
            }}
          >
            {(props) => (
              <Form>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <FormTextInput
                    label="New First Name"
                    props={{
                      name: "firstName",
                      type: "text",
                      placeholder: user.firstName,
                    }}
                  />
                  <FormTextInput
                    label="New Last Name"
                    props={{
                      name: "lastName",
                      type: "text",
                      placeholder: user.lastName,
                    }}
                  />
                  <FormTextInput
                    label="New Password"
                    props={{ name: "password", type: "password" }}
                  />
                  <FormTextInput
                    label="Confirm New Password"
                    props={{ name: "passwordConfirm", type: "password" }}
                  />
                  <FormTextInput
                    label="New Username"
                    props={{
                      name: "username",
                      type: "text",
                      placeholder: user.username,
                    }}
                  />
                  <FormTextInput
                    label="New Email"
                    props={{
                      name: "email",
                      type: "email",
                      placeholder: user.email,
                    }}
                  />
                  <div className="lg:col-span-2 flex justify-center items-center py-3 flex-col lg:flex-row">
                    <Button
                      type="submit"
                      disabled={allUsersFetching || isEditingAccount}
                      className="mr-2 mb-2"
                    >
                      Save new details
                    </Button>
                    <Button
                      type="button"
                      disabled={allUsersFetching || isEditingAccount}
                      bare
                      className="mr-2 mb-2"
                      onClick={() => props.resetForm()}
                    >
                      Reset Changes
                    </Button>
                    <button
                      type="button"
                      disabled={isDeletingAccount}
                      className="mr-2 mb-2 font-bold text-sm p-1 disabled:opacity-80 focus:outline-none w-32 h-10 border border-red-500 text-red-500 bg-red-100 hover:text-red-700"
                      onClick={handleDeleteAccount}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="text-center p-5 text-xs text-gray-500">
          Error loading user data
        </div>
      )}
    </div>
  );
};

export default ManageAccount;

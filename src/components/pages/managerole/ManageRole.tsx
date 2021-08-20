import React, { useState } from "react";
import { SkewLoader } from "react-spinners";
import {
  useGetAllUserStoresQuery,
  useGetUsersAndRolesByStoreIdQuery,
  useUnappointRoleMutation,
} from "../../../app/services/appointments";
import DashboardPageHeader from "../../shared/DashboardPageHeader";
import PersonList from "../../shared/PersonList";
import Select from "../../shared/Select";
import AppointRoleForm from "./AppointRoleForm";
import { useAppSelector } from "../../../app/hooks";
import * as CgIcons from "react-icons/cg";

const ManageRole: React.FC = () => {
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(-1);
  const {
    data: storesWithDetails,
    isFetching: isFetchingStores,
    isLoading: isLoadingStores,
    error: storeError,
  } = useGetAllUserStoresQuery();

  const [unappoint, { isLoading: isUnappointing }] = useUnappointRoleMutation();

  const storesWithoutQP = storesWithDetails
    ? storesWithDetails.filter(({ store }) => !store.isQuickProfile)
    : [];
  const selectedStore =
    selectedStoreIndex > -1 ? storesWithoutQP[selectedStoreIndex] : undefined;
  const {
    data: usersAndRoles,
    isFetching: isFetchingRoles,
    isLoading: isLoadingRoles,
    error: roleError,
  } = useGetUsersAndRolesByStoreIdQuery(
    selectedStore ? selectedStore.store.id : -1,
    {
      skip: !selectedStore || !storesWithDetails,
    }
  );

  const selectOptions = storesWithoutQP.map(({ store }, index) => ({
    label: store.name,
    value: index,
  }));
  selectOptions.unshift({ label: "Choose a store", value: -1 });

  const managers = usersAndRoles?.filter(({ role }) => role.name === "Manager");
  const owner = usersAndRoles?.filter(({ role }) => role.name === "Owner");

  const currentUser = useAppSelector((state) => state.auth.user);
  const currentRole = selectedStore
    ? usersAndRoles?.find(
        ({ user, store }) =>
          store?.id === selectedStore.store.id && user.id === currentUser?.id
      )?.role.name
    : undefined;
  const currentUserIsOwner = currentRole === "Owner";

  const unAppointPerson = async (
    role: string,
    storeId: number,
    username: string
  ) => {
    try {
      await unappoint({ role, storeId, username }).unwrap();
      alert("Succesfully unappointed");
    } catch (err) {
      alert("Failed to perform action");
    }
  };

  return (
    <div className="overflow-y-auto h-full w-11/12 font-roboto p-4">
        <DashboardPageHeader
          title="Roles"
          description="Here you can see the roles for a particaluar store and assign roles to other users."
        />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 md:grid-rows-6">
      <div className="md:col-span-4">
        {(isFetchingStores || isFetchingRoles) && (
          <SkewLoader
            color="#333"
            loading={isFetchingStores || isFetchingRoles}
            size="20px"
          />
        )}
      </div>
      {isLoadingStores || isLoadingRoles ? (
        <div className="md:col-span-4 flex justify-center items-center">
          <SkewLoader
            color="#333"
            loading={isLoadingStores || isLoadingRoles}
            size="36px"
          />
        </div>
      ) : storeError || roleError ? (
        <div className="md:col-span-4 row-span-3 text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 whitespace-pre-wrap">
          Error fetching data from the server:{" "}
          <div className="text-left w-20 mx-auto">
            {JSON.stringify({ ...storeError, ...roleError }, null, 2)}
          </div>
          If the status is 401 try refreshing the page and relogging
        </div>
      ) : (
        <>
          <div className="md:col-span-4 p-6">
            <Select
              options={selectOptions}
              onChange={(e) => setSelectedStoreIndex(Number(e.target.value))}
              value={selectedStoreIndex}
            />
          </div>

          <div className="md:col-span-2  md:row-span-3">
            <div className="border border-gray-500 rounded p-5 h-full">
              <h2 className="font-extrabold text-xl pb-3">
                {selectedStore
                  ? selectedStore.store.name
                  : "Select a store to see the roles"}
              </h2>
              <h3 className="font-bold text-base">Owner</h3>
              {selectedStore && owner && <PersonList people={owner} />}
              <h3 className="font-bold text-base">Managers</h3>
              {selectedStore && managers && (
                <PersonList
                  people={managers}
                  render={(urs) => (
                    <div className="border border-white text-white p-1 rounded-sm w-min">
                      {" "}
                      {currentUserIsOwner ? (
                        <button
                        className="text-lg p-1 hover:bg-white hover:text-black"
                          disabled={isUnappointing}
                          onClick={() =>
                            unAppointPerson(
                              urs.role.name,
                              urs.store.id,
                              urs.user.username
                            )
                          }
                        >
                          <CgIcons.CgUserRemove />
                        </button>
                      ) : (
                        <span>Only owner can unappoint</span>
                      )}
                    </div>
                  )}
                />
              )}
            </div>
          </div>

          <div className="md:col-span-2  md:row-span-3">
            {selectedStore ? (
              <AppointRoleForm
                selectedStore={selectedStore}
                currentUserIsOwner={currentUserIsOwner}
              />
            ) : (
              <div className="h-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 border border-gray-500">
                Must select a store to appoint roles
              </div>
            )}
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default ManageRole;

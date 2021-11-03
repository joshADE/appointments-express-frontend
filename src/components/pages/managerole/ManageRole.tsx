import React from "react";
import { SkewLoader } from "react-spinners";
import {
  useGetUsersAndRolesByStoreIdQuery,
} from "../../../app/services/appointments";
import DashboardPageHeader from "../../shared/DashboardPageHeader";
import Select from "../../shared/Select";
import AppointRoleForm from "./AppointRoleForm";
import { useAppSelector } from "../../../app/hooks";
import { useSelectStore } from "../../../hooks/useSelectStore";
import RoleDetails from "./RoleDetails";

const ManageRole: React.FC = () => {
  const { 
    selectOptions,
    selectedStoreIndex,
    setSelectedStoreIndex,
    selectedStore,
    storesWithDetails,
    rest: {
      isLoading: isLoadingStores,
      isFetching: isFetchingStores,
      error: storeError
    }
  } = useSelectStore(-1);




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



  const currentUser = useAppSelector((state) => state.auth.user);
  const currentRole = selectedStore
    ? usersAndRoles?.find(
        ({ user, store }) =>
          store?.id === selectedStore.store.id && user.id === currentUser?.id
      )?.role.name
    : undefined;
  const currentUserIsOwner = currentRole === "Owner";



  return (
    <div className="overflow-y-scroll h-full w-11/12 font-montserrat p-4 relative">
        <DashboardPageHeader
          title="Roles"
          description="Here you can see the roles for a particaluar store and assign roles to other users."
        />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 md:grid-rows-6 mt-2">
      <div className="absolute right-0 bottom-0">
        {(isFetchingStores || isFetchingRoles) && (
          <SkewLoader
            color="#333"
            loading={isFetchingStores || isFetchingRoles}
            size="20px"
          />
        )}
      </div>
      {storeError || roleError ? (
        <div className="md:col-span-4 row-span-3 text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 whitespace-pre-wrap">
          Error fetching data from the server:{" "}
          <div className="text-left w-20 mx-auto">
            {JSON.stringify({ ...storeError, ...roleError }, null, 2)}
          </div>
          If the status is 401 try refreshing the page and relogging
        </div>
      ) : (
        <>
          <div className="md:col-span-4 bg-white rounded-lg shadow p-5">
            <Select
              options={selectOptions}
              onChange={(e) => setSelectedStoreIndex(Number(e.target.value))}
              value={selectedStoreIndex}
            />
          </div>

          <div className="md:col-span-2  md:row-span-3 bg-white rounded-lg shadow p-5">
              <RoleDetails
                usersAndRoles={usersAndRoles}
                selectedStore={selectedStore}
                currentUserIsOwner={currentUserIsOwner}
                isLoading={isLoadingStores || isLoadingRoles}
              />
          </div>

          <div className="md:col-span-2  md:row-span-3 bg-white rounded-lg shadow p-5">
            
            <AppointRoleForm
              selectedStore={selectedStore}
              currentUserIsOwner={currentUserIsOwner}
              isLoading={isLoadingStores || isLoadingRoles}
              isFetching={isFetchingStores || isFetchingRoles}
            />
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default ManageRole;

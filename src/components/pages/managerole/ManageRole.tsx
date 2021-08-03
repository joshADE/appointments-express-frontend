import React, { useState } from "react";
import {
  useGetAllUserStoresQuery,
  useGetUsersAndRolesByStoreIdQuery,
} from "../../../app/services/appointments";
import DashboardPageHeader from "../../shared/DashboardPageHeader";
import Select from "../../shared/Select";

const ManageRole: React.FC = () => {
  const [selectedStoreId, setSelectedStoreId] = useState(-1);
  const {
    data: storesWithDetails,
    isFetching: isFetchingStores,
    isLoading: isLoadingStores,
    error: storeError,
  } = useGetAllUserStoresQuery();
  const {
    data: usersAndRoles,
    isFetching: isFetchingRoles,
    isLoading: isLoadingRoles,
    error: roleError,
  } = useGetUsersAndRolesByStoreIdQuery(selectedStoreId, {
    skip: selectedStoreId < 0,
  });

  const selectOptions = storesWithDetails? 
  storesWithDetails.filter(({ store }) => !store.isQuickProfile).map(({ store }) => ({label: store.name, value: store.id})) : [];

  selectOptions.unshift({label: "Choose a store", value: -1});

  return (
    <div className="overflow-y-auto h-full w-11/12 font-roboto p-4 grid gap-4 grid-cols-1 md:grid-cols-4">
      <div className="md:col-span-3">
        <DashboardPageHeader
          title="Roles"
          description="Here you can see the roles for a particaluar store and assign roles to other users."
        />
      </div>
      <div className="md:col-span-1">

          <Select 
            options={selectOptions}
            onChange={e => setSelectedStoreId(Number(e.target.value))}
          />
      </div>
    </div>
  );
};

export default ManageRole;

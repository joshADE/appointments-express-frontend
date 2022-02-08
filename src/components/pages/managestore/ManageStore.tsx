import React, { useEffect, useState } from "react";
import DashboardPageHeader from "../../shared/DashboardPageHeader";
import { useGetAllUserStoresQuery, useDeleteStoreMutation } from "../../../app/services/appointments";
import {
  Store,
  StoreHours,
  ClosedDaysTimes,
} from "../../../features/store/storeTypes";
import StoreDetailsForm from "./StoreDetailsForm";

import GridLayout from "../GridLayout";
import StoreList from "./StoreList";

export interface Overrides {
  store: Partial<Store>;
  storeHours: { [dayOfWeek: number]: Partial<StoreHours> };
  closedDaysTimes: Partial<ClosedDaysTimes>[];
}

const ManageStore: React.FC = () => {
  const [layoutRefresh, setLayoutRefresh] = useState(0);
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();

  const { data: stores, error, isLoading, isFetching } = useGetAllUserStoresQuery();

  const [selectedStoreIndex, setSelectedStoreIndex] = useState(-1);
  // overrides are any property that will override the default state in the StoreDetailsForm  when a button is clicked
  const [overrides, setOverrides] = useState<Overrides | undefined>();

  let indexOfQuickProfile = stores
    ? stores.findIndex(
        (storeWithDetail) => storeWithDetail.store.isQuickProfile
      )
    : -1;
  const storesWithoutQP = stores
    ? stores.filter((_, i) => i !== indexOfQuickProfile)
    : [];

  const selectedStore =
    selectedStoreIndex >= 0 ? storesWithoutQP[selectedStoreIndex] : undefined;
  const clearStoreDetails = () => {
    setSelectedStoreIndex(-1);
  };

  // transfer overrides transfers the state overrides from one StoreDetailForm child component to the other
  const tranferOverrides = (newOverrides: Overrides) => {
    setOverrides(newOverrides);
  };

  
    const handleDeleteStore = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        e.stopPropagation(); // the delete button is inside the select store button, so don't propagate the click event to the select button
        try {
          const store = await deleteStore(id).unwrap();
          alert(`Successfully deleted store: ${store.name}`);
          clearStoreDetails();
        }catch {
          alert("Failed to delete store");
        }
    }

  useEffect(() => {
    setLayoutRefresh(prev => prev + 1);
  }, [selectedStoreIndex, stores])



  return (
    <div className="overflow-y-auto h-full w-11/12 font-montserrat p-4">
        <DashboardPageHeader
          title="Manage Store and Times"
          description="Here you can open a store, manage existing stores, edit your quick store profile, set day and times for a particular store."
        />
        <GridLayout
          className="gap-4 grid-cols-1 lg:grid-cols-4"
          childrenDataFetching={isDeleting || isFetching}
          childrenDataLoading={(!isFetching && isLoading)}
          errors={[error]}
          layoutRefreshTriger={layoutRefresh}
        >
          {() => ([ 
            ({
              key: "currentStore",
              node:
              <StoreDetailsForm
                isQuickProfile={false}
                storeDetails={selectedStore}
                clearStoreDetails={clearStoreDetails}
                tranferOverrides={tranferOverrides}
                overrides={overrides}
                setLayoutRefresh={setLayoutRefresh}
              />,
              className: "lg:col-span-3",
              resize: { height: true },
            }),
            {
              key: "storeList",
              node: 
              <StoreList 
                selectedStore={selectedStore}
                handleDeleteStore={handleDeleteStore}
                setSelectedStoreIndex={setSelectedStoreIndex}
                storesWithoutQP={storesWithoutQP}
                isDeleting={isDeleting}
              />,
              className: "lg:col-span-1 md:row-span-3",
              // resize: { height: true }
            },
            {
              key: "quickProfileSrore",
              node: 
              <StoreDetailsForm
                isQuickProfile
                storeDetails={
                  stores && indexOfQuickProfile >= 0
                    ? stores[indexOfQuickProfile]
                    : undefined
                }
                clearStoreDetails={clearStoreDetails}
                tranferOverrides={tranferOverrides}
                setLayoutRefresh={setLayoutRefresh}
              />,
              className: "lg:col-span-3",
              resize: { height: true },
            }
          ])}
        </GridLayout>

    </div>
  );
};

export default ManageStore;

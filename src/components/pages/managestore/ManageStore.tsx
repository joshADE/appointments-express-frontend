import React, { useState } from "react";
import DashboardPageHeader from "../../shared/DashboardPageHeader";
import { useGetAllUserStoresQuery, useDeleteStoreMutation } from "../../../app/services/appointments";
import {
  Store,
  StoreHours,
  ClosedDaysTimes,
} from "../../../features/store/storeTypes";
import StoreDetailsForm from "./StoreDetailsForm";
import * as VscIcons from "react-icons/vsc";
import * as BsIcons from "react-icons/bs";
import * as RiIcons from "react-icons/ri";
import { SkewLoader } from "react-spinners";

export interface Overrides {
  store: Partial<Store>;
  storeHours: { [dayOfWeek: number]: Partial<StoreHours> };
  closedDaysTimes: Partial<ClosedDaysTimes>[];
}

const ManageStore: React.FC = () => {
  const { data: stores, error, isLoading, isFetching } = useGetAllUserStoresQuery();
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();
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

  return (
    <div className="overflow-y-auto h-full w-11/12 font-roboto p-4">
        <DashboardPageHeader
          title="Manage Store and Times"
          description="Here you can open a store, manage existing stores, edit your quick store profile, set day and times for a particular store."
        />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 border rounded-lg border-gray-500 p-5 mt-5">
      <div className="md:col-span-4">
        {isFetching && <SkewLoader color="#333" loading={isFetching} size="20px" />}
      </div>
      {isLoading ? (
        <div className="md:col-span-4 flex justify-center items-center">
          <SkewLoader color="#333" loading={isLoading} size="36px" />
        </div>
      ) : error ? (
        <div className="md:col-span-4 row-span-3 text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 whitespace-pre-wrap">
          Error fetching data from the server: <div className="text-left w-20 mx-auto">{JSON.stringify(error, null,  2)}</div>
          If the status is 401 try refreshing the page and relogging
        </div>
      ) : (
        <>
          <div className="md:col-span-3">
            <StoreDetailsForm
              isQuickProfile
              storeDetails={
                stores && indexOfQuickProfile >= 0
                  ? stores[indexOfQuickProfile]
                  : undefined
              }
              clearStoreDetails={clearStoreDetails}
              tranferOverrides={tranferOverrides}
            />
          </div>
          <div className="md:col-span-1 md:row-span-3">
            <div className="max-w-xs">
              <div className="font-thin border-b-4 border-black pb-4 mb-4">
                <h3 className="text-lg">Stores</h3>
                <div className="text-xs text-gray-400">
                  {storesWithoutQP.length} Total -{" "}
                  {
                    new Set(
                      storesWithoutQP.map((store) => store.store.location)
                    ).size
                  }{" "}
                  Unique Location(s)
                </div>
                <div className="text-xs text-gray-400">
                  Select the store to edit
                </div>
              </div>
              <ul>
                {storesWithoutQP.map((storeDetails, index) => {
                  const { store, role } = storeDetails;
                  return (
                    <li
                      key={store.id}
                      className="border-b-2 border-gray-300 pb-2 pt-2"
                    >
                      <button
                        className={`text-left w-full px-1 flex justify-between focus:outline-none hover:bg-green-50 ${
                          selectedStore?.store.id === store.id
                            ? "bg-gray-100"
                            : ""
                        }`}
                        onClick={() => setSelectedStoreIndex(index)}
                      >
                        <div>
                          <h6 className="font-semibold text-sm">{store.name}</h6>
                          <div className="font-normal text-xs text-gray-400">
                            <div>
                              <VscIcons.VscLocation className="inline text-lg" />{" "}
                              {store.location}
                            </div>
                            <div>
                              <BsIcons.BsPerson className="inline text-lg" />{" "}
                              {role.name}
                            </div>
                          </div>
                        </div>
                        {role.name === 'Owner' &&
                        <div className="flex flex-col justify-center items-center">
                          <button className="font-normal text-gray-500 hover:text-gray-900 focus:outline-none" disabled={isDeleting} onClick={(e) => handleDeleteStore(e, store.id)}><RiIcons.RiDeleteBin6Line /></button>
                        </div>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="md:col-span-3">
            <StoreDetailsForm
              isQuickProfile={false}
              storeDetails={selectedStore}
              clearStoreDetails={clearStoreDetails}
              tranferOverrides={tranferOverrides}
              overrides={overrides}
            />
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default ManageStore;

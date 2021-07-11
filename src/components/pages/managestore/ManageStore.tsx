import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DashboardPageHeader from "../../shared/DashboardPageHeader";
import {
  selectStoreState,
  fetchAllUserStore,
} from "../../../features/store/storeSlice";
import { StoreWithDetails } from "../../../features/store/storeTypes";
import StoreDetailsForm from "./StoreDetailsForm";
import * as VscIcons from 'react-icons/vsc';
import * as BsIcons from 'react-icons/bs';

const ManageStore: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stores } = useAppSelector(selectStoreState);
  const [selectedStore, setSelectedStore] = useState<StoreWithDetails | undefined>()

  let indexOfQuickProfile = stores.findIndex(storeWithDetail => storeWithDetail.store.isQuickProfile);
  const storesWithoutQP = stores.filter((_, i) => i !== indexOfQuickProfile);

  const clearStoreDetails = () => {
    setSelectedStore(undefined);
  }

  useEffect(() => {
    dispatch(fetchAllUserStore());
  }, [dispatch]);
  return (
    <div className="overflow-y-auto h-full w-11/12 font-roboto p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-4 md:grid-rows-4">
      <div className="md:col-span-4">
        <DashboardPageHeader
          title="Manage Store and Times"
          description="Here you can open a store, manage existing stores, edit your quick store profile, set day and times for a particular store."
        />
      </div>
      <div className="md:col-span-3">
        <StoreDetailsForm
          isQuickProfile
          storeDetails={stores[indexOfQuickProfile]}
          clearStoreDetails={clearStoreDetails}
        />
      </div>
      <div className="md:col-span-1 md:row-span-3">
        <div className="max-w-xs">
          <div className="font-thin border-b-4 border-black pb-4 mb-4">
            <h3 className="text-lg">Stores</h3>
            <div className="text-xs text-gray-400">
              {storesWithoutQP.length} Total -{" "}
              {new Set(storesWithoutQP.map((store) => store.store.location)).size} Unique
              Location(s)
            </div>
            <div className="text-xs text-gray-400">Select the store to edit</div>
          </div>
          <ul>
            {storesWithoutQP.map((storeDetails) => {
              const { store, role } = storeDetails;
              return (
                <li
                  key={store.id}
                  className="border-b-2 border-gray-300 pb-2 pt-2"
                >
                  <button
                    className={`text-left w-full pl-1 pr-1 focus:outline-none hover:bg-green-50 ${selectedStore?.store.id === store.id ? 'bg-gray-100' : ''}`}
                    onClick={() => setSelectedStore(storeDetails)}
                  >
                    <h6 className="font-semibold text-sm">{store.name}</h6>
                    <div className="font-normal text-xs text-gray-400">
                      <div><VscIcons.VscLocation className="inline text-lg" /> {store.location}</div>
                      <div><BsIcons.BsPerson className="inline text-lg" /> {role.name}</div>
                    </div>
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
        />
      </div>
    </div>
  );
};

export default ManageStore;

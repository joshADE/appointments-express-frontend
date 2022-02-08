import React from 'react'
import * as VscIcons from 'react-icons/vsc';
import * as BsIcons from 'react-icons/bs';
import * as RiIcons from 'react-icons/ri';
import { StoreWithDetails } from '../../../features/store/storeTypes';
interface StoreListProps {
    storesWithoutQP: StoreWithDetails[];
    selectedStore?: StoreWithDetails;
    setSelectedStoreIndex: React.Dispatch<React.SetStateAction<number>>;
    handleDeleteStore: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => Promise<void>;
    isDeleting: boolean;
}

const StoreList = ({
    storesWithoutQP,
    selectedStore,
    setSelectedStoreIndex,
    handleDeleteStore,
    isDeleting,
}:StoreListProps) => {
    
        return (
            <div className="max-w-xs">
              <div className="font-thin border-b-4 border-black pb-4 mb-4">
                <h3 className="text-lg font-extrabold font-open-sans">Stores</h3>
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
        );
}

export default StoreList;
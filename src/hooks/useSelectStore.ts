import { useState, useMemo } from "react";
import { useGetAllUserStoresQuery } from "../app/services/appointments";

export const useSelectStore = (initialSelectedStoreIndex: number) => {
    const [selectedStoreIndex, setSelectedStoreIndex] = useState(initialSelectedStoreIndex);
    const {
      data: storesWithDetails,
      ...rest
    } = useGetAllUserStoresQuery();
  
    const storesWithoutQP = useMemo(() => storesWithDetails
    ? storesWithDetails.filter(({ store }) => !store.isQuickProfile)
    : []
    , [storesWithDetails]);
  const selectedStore = useMemo(() => 
    selectedStoreIndex > -1 ? storesWithoutQP[selectedStoreIndex] 
    : undefined
    , [storesWithoutQP, selectedStoreIndex]);
  
    const selectOptions = storesWithoutQP.map(({ store }, index) => ({
      label: store.name,
      value: index,
    }));
    selectOptions.unshift({ label: "Choose a store", value: -1 });

    return {
        selectedStoreIndex,
        storesWithDetails,
        storesWithoutQP,
        selectedStore,
        selectOptions,
        setSelectedStoreIndex,
        rest
    }
}
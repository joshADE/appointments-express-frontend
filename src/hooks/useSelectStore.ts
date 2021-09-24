import { useState } from "react";
import { useGetAllUserStoresQuery } from "../app/services/appointments";

export const useSelectStore = (initialSelectedStoreIndex: number) => {
    const [selectedStoreIndex, setSelectedStoreIndex] = useState(initialSelectedStoreIndex);
    const {
      data: storesWithDetails,
      ...rest
    } = useGetAllUserStoresQuery();
  
    const storesWithoutQP = storesWithDetails
    ? storesWithDetails.filter(({ store }) => !store.isQuickProfile)
    : [];
  const selectedStore =
    selectedStoreIndex > -1 ? storesWithoutQP[selectedStoreIndex] : undefined;
  
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
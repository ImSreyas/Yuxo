import { create } from "zustand";

const useNewBusAddedStore = create((set) => ({
  busAdded: true,
  setBusAdded: (isBusAdded: boolean) => set({ busAdded: isBusAdded }),
}));

export default useNewBusAddedStore;

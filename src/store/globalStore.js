import { create } from 'zustand';

const useGlobalStore = create((set) => ({
  searchQuery: '',
  setSearchQuery: (value) => set({ searchQuery: value }),

  
//   isLoading: false,
//   setIsLoading: (value) => set({ isLoading: value }),

//   // contoh state global lain
//   sidebarOpen: true,
//   toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
}));

export default useGlobalStore;

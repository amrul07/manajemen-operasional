import { create } from 'zustand';

const useGlobalStore = create((set) => ({
  searchQuery: '', // value fitur search
  setSearchQuery: (value) => set({ searchQuery: value }),
  user: '', // value user yg login
  setUser: (value) => set({ user: value })
}));

export default useGlobalStore;

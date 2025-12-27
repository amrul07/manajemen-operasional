import { create } from 'zustand';

const useGlobalStore = create((set) => ({
  searchQuery: '', // value fitur search
  setSearchQuery: (value) => set({ searchQuery: value }),

  // 👤 Ambil role langsung dari localStorage saat store dibuat
  role: localStorage.getItem('role'), // contoh: "pimpinan", "staff", dll
  // role: 'Karyawan Biasa', // contoh: "pimpinan", "staff", dll

  // ✅ Simpan role
  setRole: (role) => {
    localStorage.setItem('role', role);
    set({ role });
  },

  // 🚪 Hapus role (dipanggil saat logout / token invalid)
  clearRole: () => {
    localStorage.removeItem('role');
    set({ role: null });
  }
}));

export default useGlobalStore;

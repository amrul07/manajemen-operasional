import { createTheme } from "@mui/material/styles";
// style pagination
const themePagination = createTheme({
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#9CA3AF", // Warna teks pada tombol
          // backgroundColor: "blue", // Warna latar belakang tombol
          fontFamily: `'Poppins', sans-serif`,
          fontSize: "14px",
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#1e88e5",
            color: "white", // Warna latar belakang tombol terpilih saat dihover
          },
          "&.Mui-selected": {
            color: "white", // Warna teks pada tombol terpilih
            backgroundColor: "#1e88e5", // Warna latar belakang tombol terpilih
            fontFamily: `'Poppins', sans-serif`,
            fontSize: "14px",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#1e88e5",
              opacity: 0.8, // Warna latar belakang tombol terpilih saat dihover
            },
          },
        },
      },
    },
  },
});

export { themePagination };

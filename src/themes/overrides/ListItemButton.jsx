// ==============================|| OVERRIDES - LIST ITEM BUTTON ||============================== //

export default function ListItemButton(theme) {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: theme.vars.palette.text.primary,
          paddingTop: '10px',
          paddingBottom: '10px',

          '&.Mui-selected': {
            color: theme.vars.palette.primary.dark, // warna text menu yang sedang dibuka
            backgroundColor: theme.vars.palette.primary.light, // warna background menu yg sedang d buka
            '&:hover': {
              backgroundColor: theme.vars.palette.primary.light // warna menu ketika d hover 
            },
            '& .MuiListItemIcon-root': {
              color: theme.vars.palette.primary.dark, // warna icon menu yg sedang d buka
              backgroundColor: theme.vars.palette.primary.light // warna background icon menu yg sedang d buka
            }
          },

          '&:hover': {
            backgroundColor: theme.vars.palette.primary.light, // warna menu lain yg di hover
            color: theme.vars.palette.primary.dark, //warna text menu lain yg d hover
            '& .MuiListItemIcon-root': {
              color: theme.vars.palette.primary.dark, // warna icon selain menu yg sedang d buka
              backgroundColor: theme.vars.palette.primary.light // warna background icon selain menu yg d buka
            }
          }
        }
      }
    }
  };
}

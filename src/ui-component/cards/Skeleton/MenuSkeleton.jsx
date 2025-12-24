// material-ui
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';

// ==============================|| SKELETON - TOTAL INCOME DARK/LIGHT CARD ||============================== //

export default function MenuSkeleton() {
  return (
    <Card sx={{ p: 2 }}>
      <List sx={{ py: 0, mt: 1 }}>
        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
          <Skeleton variant="text" width={80} height={30} />
        </ListItem>
        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
          <ListItemText sx={{ py: 0 }} primary={<Skeleton sx={{ borderRadius: '8px' }} variant="rectangular" height={40} />} />
        </ListItem>
        <ListItem alignItems="center" disableGutters sx={{ py: 0, mt: 1 }}>
          <Skeleton variant="text" width={'100%'} height={2} />
        </ListItem>
        <ListItem alignItems="center" disableGutters sx={{ py: 0, mt: 2 }}>
          <Skeleton variant="text" width={80} height={30} />
        </ListItem>
        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
          <ListItemText sx={{ py: 0 }} primary={<Skeleton sx={{ borderRadius: '8px' }} variant="rectangular" height={40} />} />
        </ListItem>
        <ListItem alignItems="center" disableGutters sx={{ py: 0, mt: 1 }}>
          <ListItemText sx={{ py: 0 }} primary={<Skeleton sx={{ borderRadius: '8px' }} variant="rectangular" height={40} />} />
        </ListItem>
        <ListItem alignItems="center" disableGutters sx={{ py: 0, mt: 1 }}>
          <ListItemText sx={{ py: 0 }} primary={<Skeleton sx={{ borderRadius: '8px' }} variant="rectangular" height={40} />} />
        </ListItem>
        <ListItem alignItems="center" disableGutters sx={{ py: 0, mt: 1 }}>
          <ListItemText sx={{ py: 0 }} primary={<Skeleton sx={{ borderRadius: '8px' }} variant="rectangular" height={40} />} />
        </ListItem>
        <ListItem alignItems="center" disableGutters sx={{ py: 0, mt: 1 }}>
          <ListItemText sx={{ py: 0 }} primary={<Skeleton sx={{ borderRadius: '8px' }} variant="rectangular" height={40} />} />
        </ListItem>
        <ListItem alignItems="center" disableGutters sx={{ py: 0, mt: 1 }}>
          <ListItemText sx={{ py: 0 }} primary={<Skeleton sx={{ borderRadius: '8px' }} variant="rectangular" height={40} />} />
        </ListItem>
      </List>
    </Card>
  );
}

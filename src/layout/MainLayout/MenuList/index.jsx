import { memo, useMemo, useState } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import menuItems from '../../../menu-items';

import { useGetMenuMaster } from '../../../api/menu';
import useGlobalStore from '../../../store/globalStore';
import MenuSkeleton from '../../../ui-component/cards/Skeleton/MenuSkeleton';

// ==============================|| SIDEBAR MENU LIST ||============================== //

function MenuList() {
  const user = useGlobalStore((state) => state.user);
  // const role = user?.jabatan;
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [selectedID, setSelectedID] = useState('');

  const lastItem = null;

  let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  // filter menu berdasarkan role
  const filteredMenuItems = useMemo(() => {
    return menuItems.items
      .filter((item) => !item.roles || item.roles.includes(user))
      .map((item) => ({
        ...item,
        children: item.children ? item.children.filter((child) => !child.roles || child.roles.includes(user)) : []
      }))
      .filter((item) => !item.children || item.children.length > 0);
  }, [user]);

  const navItems = filteredMenuItems.map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <List key={item.id}>
              <NavItem item={item} level={1} isParents setSelectedID={() => setSelectedID('')} />
              {index !== 0 && <Divider sx={{ py: 0.5 }} />}
            </List>
          );
        }

        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            selectedID={selectedID}
            item={item}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" align="center" sx={{ color: 'error.main' }}>
            Menu Items Error
          </Typography>
        );
    }
  });

  // 🔥 GUARD LOADING
  if (!user) {
    return <MenuSkeleton />;
  }

  return <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>;
}

export default memo(MenuList);

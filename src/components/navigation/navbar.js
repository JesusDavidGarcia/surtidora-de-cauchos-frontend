import React, { useState } from 'react';

import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

//Selfmade
import ProfilePopover from '../popovers/profile';
import ActiveLastBreadcrumb from './breadcrum';
import IconButton from '@mui/material/Button';

//Icons
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import { useWidth } from '../../utils/widthSelector';

export default function Navbar(props) {
  const navbarName =
    JSON.parse(localStorage.getItem('userInfo')) === null
      ? 'Preztel'
      : JSON.parse(localStorage.getItem('userInfo')).fullName;

  const { notificationsLength, handleToggle, openNC } = props;

  const breakpoint = useWidth();

  //Profile popover management
  const [anchorProfile, setAnchorProfile] = useState(null);
  const handleProfilePopoverOpen = (event) => {
    setAnchorProfile(event.currentTarget);
  };

  const handleProfilePopoverClose = () => {
    setAnchorProfile(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <ProfilePopover open={anchorProfile} handleClose={handleProfilePopoverClose} />
      <Toolbar>
        <Grid container justifyContent={'space-between'}>
          <Grid item container md={8} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <ActiveLastBreadcrumb />
          </Grid>
          <Grid
            item
            container
            alignItems={'center'}
            justifyContent={breakpoint === 'xs' ? 'flex-start' : 'flex-end'}
            xs={6}
            md={2}
          >
            <IconButton
              size="small"
              onClick={handleToggle}
              variant={openNC ? 'contained' : 'outlined'}
              color="secondary"
            >
              <Badge badgeContent={notificationsLength} color="error">
                <NotificationsActiveIcon sx={{ color: 'white' }} />
              </Badge>
            </IconButton>
          </Grid>
          <Grid item container alignItems={'center'} justifyContent={'flex-end'} xs={6} md={2}>
            <Button variant="outlined" color="inherit" onClick={handleProfilePopoverOpen}>
              {navbarName}
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

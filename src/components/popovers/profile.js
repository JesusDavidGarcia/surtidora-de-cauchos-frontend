import React from 'react';

//React router
import { useNavigate } from 'react-router-dom';

//MUI
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';

export default function ProfilePopover(props) {
  const navigate = useNavigate();
  const { open } = props;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    props.handleClose();
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    props.handleClose();
  };

  return (
    <Popover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={Boolean(open)}
      anchorEl={open}
      onClose={props.handleClose}
    >
      <List dense>
        <ListItemButton onClick={handleChangePassword}>
          <ListItemText primary={'Cambiar contraseña'} />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemText primary={'Cerrar sesión'} />
        </ListItemButton>
      </List>
    </Popover>
  );
}

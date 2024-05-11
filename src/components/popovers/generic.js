import React from 'react';

//MUI
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';

export default function UserPopover(props) {
  const { showSupplyTicketHistory } = props;
  const { showCreateTicketOption } = props;
  const { showCloseTicketOption } = props;
  const { showCloseRentalOption } = props;

  const { showDetailsOption } = props;
  const { showHistoryOption } = props;
  const { showUpdateOption } = props;

  const { showDeleteOption } = props;
  const { showRenameOption } = props;
  const { showRentOption } = props;

  const { open } = props;

  const handleOpenDialog = (action) => () => {
    switch (action) {
      case 'rent':
        props.setRentDialog(true);
        break;

      case 'close-rent':
        props.setCloseRentalDialog(true);
        break;

      case 'supply-ticket':
        props.setSupplyTicketDialog(true);
        break;

      case 'close-ticket':
        props.setCloseTicketDialog(true);
        break;

      case 'history':
        props.setHistoryDialog(true);
        break;

      case 'update':
        props.setUpdateDialog(true);
        break;

      case 'rename':
        props.setRenameDialog(true);
        break;

      case 'create-ticket':
        props.setMaintenanceDialog(true);
        break;

      case 'details':
        props.setDetailsDialog(true);
        break;

      default:
        props.setDeleteDialog(true);
        break;
    }
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
        {showDetailsOption ? (
          <ListItemButton onClick={handleOpenDialog('details')}>
            <ListItemText primary={'Ver detalles'} />
          </ListItemButton>
        ) : null}
        {showHistoryOption ? (
          <ListItemButton onClick={handleOpenDialog('history')}>
            <ListItemText primary={'Ver historial de alquiler'} />
          </ListItemButton>
        ) : null}

        {showCloseTicketOption ? (
          <ListItemButton onClick={handleOpenDialog('close-ticket')}>
            <ListItemText primary={'Cerrar ticket'} />
          </ListItemButton>
        ) : null}

        {showCloseRentalOption ? (
          <ListItemButton onClick={handleOpenDialog('close-rent')}>
            <ListItemText primary={'Cerrar alquiler'} />
          </ListItemButton>
        ) : null}

        {showRentOption ? (
          <ListItemButton onClick={handleOpenDialog('rent')}>
            <ListItemText primary={'Alquilar'} />
          </ListItemButton>
        ) : null}

        {showCreateTicketOption ? (
          <ListItemButton onClick={handleOpenDialog('create-ticket')}>
            <ListItemText primary={'Crear ticket de mantenimiento'} />
          </ListItemButton>
        ) : null}

        {showSupplyTicketHistory ? (
          <ListItemButton onClick={handleOpenDialog('supply-ticket')}>
            <ListItemText primary={'Ver historial de uso'} />
          </ListItemButton>
        ) : null}

        {showUpdateOption ? (
          <ListItemButton onClick={handleOpenDialog('update')}>
            <ListItemText primary={'Editar'} />
          </ListItemButton>
        ) : null}

        {showRenameOption ? (
          <ListItemButton onClick={handleOpenDialog('rename')}>
            <ListItemText primary={'Renombrar'} />
          </ListItemButton>
        ) : null}

        {showDeleteOption ? (
          <ListItemButton onClick={handleOpenDialog('delete')}>
            <ListItemText primary={'Eliminar'} />
          </ListItemButton>
        ) : null}
      </List>
    </Popover>
  );
}

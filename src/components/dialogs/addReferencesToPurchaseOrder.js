import React, { useState } from 'react';

import DialogContentText from '@mui/material/DialogContentText';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
/* import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
 */ import DialogTitle from '@mui/material/DialogTitle';
/* import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider'; */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

/* import List from '@mui/material/List';

import CancelIcon from '@mui/icons-material/Cancel';
import InboxIcon from '@mui/icons-material/Inbox'; */

import ReferenceQuantityInput from '../../components/input/referenceQuantity';

import $ from 'jquery';
import mainURL from '../../config/environment';

const emptyModel = {
  rubberReferenceId: '',
  quantity: 0,
};

export default function AddReferenceToPurchaseOrder(props) {
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);
  const { orderNumber, id, usedReferences } = props;

  const handleAdd = (item) => {
    console.log(item);
    setModel(item);
  };

  /* const handleDelete = (index) => () => {
    let a = [...model.references];
    a.splice(index, 1);

    setModel({ ...model, references: a });
  };
 */
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;

    $.ajax({
      method: 'PUT',
      url: `${mainURL}purchase-order/${id}/add-reference`,
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: JSON.stringify(model),
    })
      .done((res) => {
        setLoading(false);
        //props.handleShowNotification("success", "Empaque agregado con éxito");
        handleClear();
      })
      .fail((res) => {
        setLoading(false);
        //props.handleShowNotification("error", res.responseText);
        handleClear();
      });
  };

  const handleClear = () => {
    props.handleClose();
    setModel(emptyModel);
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{'Añadir referencias'}</DialogTitle>
      <DialogContent sx={{ minWidth: '40rem' }}>
        <DialogContentText>
          {`Añadir referencias a la orden de compra #${orderNumber}`}
        </DialogContentText>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ReferenceQuantityInput
                handleAdd={handleAdd}
                usedReferences={usedReferences}
                autoSelect
                includeSecondary
              />
            </Grid>
          </Grid>
        </Box>
        {/*   {model.references.length > 0 ? (
          <Grid item container xs={12}>
            <List sx={{ width: '100%' }}>
              {model.references.map((reference, index) => (
                <ListItem
                  disablePadding
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={handleDelete(index)}>
                      <CancelIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={reference.referenceName}
                    secondary={
                      <Typography variant="body2">
                        {`Cantidad recibida: ${reference.quantity}`}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              <Divider />
            </List>
          </Grid>
        ) : null} */}
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <Grid container justifyContent={'center'}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container justifyContent={'flex-end'}>
            <Button type="submit" onClick={handleClear}>
              Cerrar
            </Button>
            <Button type="submit" disabled={model === emptyModel} onClick={handleSubmit}>
              Agregar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

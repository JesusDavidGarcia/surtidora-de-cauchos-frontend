import React, { useState, useEffect } from 'react';

//Material UI

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';

//JQuery
import mainURL from '../../config/environment';
import $ from 'jquery';
import { List, ListItem, ListItemText } from '@mui/material';

export default function MaterialStatusDialog(props) {
  const [materials, setMaterials] = useState([]);

  const { refresh } = props;

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;
    $.ajax({
      method: 'GET',
      url: mainURL + 'raw-material/get-all',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }).done((res) => {
      const aux = res.filter((m) => m.id > 0);
      if (isSubscribed) setMaterials(aux);
    });
    return () => (isSubscribed = false);
  }, [refresh]);
  //Submit

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle id="alert-dialog-title">{'Materia prima disponible'}</DialogTitle>
      <DialogContent>
        <List>
          {materials.map((m, key) => (
            <ListItem key={key}>
              <ListItemText primary={m.name} secondary={m.currentWeight} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent={'flex-end'}>
          <Button onClick={props.handleClose} color="primary">
            {'Cerrar'}
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

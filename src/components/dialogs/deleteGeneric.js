import React, { useState } from 'react';

//Material UI
import DialogContentText from '@mui/material/DialogContentText';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';

//JQuery
import mainURL from '../../config/environment';
import $ from 'jquery';

export default function DeleteGenericDialog(props) {
  const [isLoading, setLoading] = useState(false);

  const { successMessage } = props;
  const { errorMessage } = props;
  const { deleteURL } = props;
  const { refresh } = props;
  const { title } = props;
  const { name } = props;

  //Submit
  const handleSubmit = () => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    $.ajax({
      method: 'DELETE',
      url: mainURL + deleteURL,
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .done((res) => {
        props.handleShowNotification('success', successMessage);
        handleClear();
      })
      .fail((res) => {
        props.handleShowNotification('error', errorMessage);
        handleClear();
      });
  };

  const handleClear = () => {
    props.setRefresh(!refresh);
    props.handleClose();
    setLoading(false);
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{`Está seguro que desea eliminar ${name}`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <Grid container justifyContent={'center'}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container justifyContent={'flex-end'}>
            <Button onClick={props.handleClose} color="primary">
              {'Cancelar'}
            </Button>
            <Button onClick={handleSubmit} color="primary" autoFocus>
              {'Aceptar'}
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

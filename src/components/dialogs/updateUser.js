import React, { useState, useEffect } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

//Icons
import $ from 'jquery';
import mainURL from '../../config/environment';

const emptyModel = {
  fullName: '',
  email: '',
  phoneNumber: '',
};

export default function UpdateUserDialog(props) {
  const [isFormComplete, setFormComplete] = useState(false);
  const [isEmailValid, setEmailValid] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);

  const { refresh } = props;
  const { userId } = props;

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    let value = target.value;

    switch (name) {
      case 'email':
        value = value.toLowerCase();
        const isEmailValid = Boolean(value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));
        if (isEmailValid) {
          setEmailValid(true);
        } else {
          setEmailValid(false);
        }
        setModel({
          ...model,
          [name]: value,
        });
        break;

      default:
        setModel({
          ...model,
          [name]: value,
        });
        break;
    }

    if (model.fullName !== '' && isEmailValid !== '' && model.password !== '') {
      setFormComplete(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    if (isEmailValid) {
      $.ajax({
        method: 'PUT',
        url: `${mainURL}user/${userId}`,
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        data: JSON.stringify(model),
      })
        .done((res) => {
          props.handleShowNotification('success', 'Usuario actualizado con éxito');
          handleClear();
        })
        .fail((res) => {
          if (res.status === 409) {
            props.handleShowNotification('error', 'Correo electrónico ya registrado');
            handleClear();
          } else {
            props.handleShowNotification('error', res.responseText);
            handleClear();
          }
        });
    } else {
      setLoading(false);
      props.handleShowNotification('warning', 'Correo electrónico no válido');
    }
  };

  const handleClear = () => {
    props.setRefresh(!refresh);
    setModel(emptyModel);
    props.handleClose();
    setLoading(false);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const host = JSON.parse(localStorage.getItem('userInfo')).hostName;
    if (userId !== 0) {
      $.ajax({
        method: 'GET',
        url: mainURL + `user/${userId}`,
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token,
          hostname: host,
        },
      }).done((res) => {
        setModel(res);
      });
    }
  }, [userId, refresh]);

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{'Editar usuario'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label={'Nombre completo'}
            onChange={handleChange}
            value={model.fullName}
            variant="standard"
            name="fullName"
            margin="dense"
            type="text"
            fullWidth
            autoFocus
            required
          />
          <TextField
            label={'Correo electrónico'}
            onChange={handleChange}
            error={!isEmailValid}
            value={model.email}
            variant="standard"
            margin="dense"
            name="email"
            type="email"
            fullWidth
            required
          />
          <TextField
            value={model.phoneNumber}
            onChange={handleChange}
            label={'Teléfono'}
            name="phoneNumber"
            variant="standard"
            margin="dense"
            type="text"
            fullWidth
          />
        </Box>
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
            <Button type="submit" disabled={!isFormComplete} onClick={handleSubmit}>
              Actualizar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

import React, { useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import $ from 'jquery';
import mainURL from '../../config/environment';
import SelectPackaging from '../input/selectPackaging';

const emptyModel = {
  name: '',
  email: '',
  nit: '',
  address: '',
  city: '',
  phoneNumber: '',
  packagingId: '',
};

export default function CreateClientDialog(props) {
  const [isFormComplete, setFormComplete] = useState(false);
  const [isEmailValid, setEmailValid] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);
  const { refresh } = props;

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

    if (model.name !== '' && isEmailValid !== '' && isEmailValid) {
      setFormComplete(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    if (isEmailValid) {
      $.ajax({
        method: 'POST',
        url: mainURL + 'client',
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        data: JSON.stringify(model),
      })
        .done((res) => {
          setLoading(false);
          props.handleShowNotification('success', 'Cliente agregado con éxito');
          handleClear();
        })
        .fail((res) => {
          setLoading(false);
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
    props.handleClose();
    setModel(emptyModel);
    setFormComplete(false);
    props.setRefresh(!refresh);
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{'Crear cliente'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <FormControl fullWidth required>
                <TextField
                  label={'Nombre'}
                  onChange={handleChange}
                  value={model.name}
                  variant="standard"
                  name="name"
                  margin="dense"
                  type="text"
                  fullWidth
                  autoFocus
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  label={'NIT'}
                  onChange={handleChange}
                  value={model.nit}
                  variant="standard"
                  name="nit"
                  margin="dense"
                  type="text"
                  fullWidth
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <TextField
                  label={'Dirección'}
                  onChange={handleChange}
                  value={model.address}
                  variant="standard"
                  name="address"
                  margin="dense"
                  type="text"
                  fullWidth
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
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
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl fullWidth>
                <TextField
                  label={'Correo electrónico'}
                  onChange={handleChange}
                  value={model.email}
                  variant="standard"
                  margin="dense"
                  name="email"
                  type="email"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  value={model.city}
                  onChange={handleChange}
                  label={'Ciudad'}
                  name="city"
                  variant="standard"
                  margin="dense"
                  type="text"
                  fullWidth
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <SelectPackaging
                required
                name="packagingId"
                handleChange={handleChange}
                value={model.packagingId}
                title="Seleccione el empaque"
              />
            </Grid>
          </Grid>
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
              Agregar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

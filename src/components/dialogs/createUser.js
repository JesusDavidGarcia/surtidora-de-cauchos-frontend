import React, { useState } from 'react';

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
  confirmPassword: '',
};

export default function CreateUserDialog(props) {
  const [isPasswordValid, setPasswordValid] = useState(true);
  const [isFormComplete, setFormComplete] = useState(false);
  //const [showPassword, setShowPassword] = useState(false);
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

      case 'password':
        const isPasswordValid = Boolean(value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/i));
        if (isPasswordValid) {
          setPasswordValid(true);
        } else {
          setPasswordValid(false);
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

    if (model.fullName !== '' && isEmailValid !== '' && isPasswordValid) {
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
        url: mainURL + 'user',
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        data: JSON.stringify(model),
      })
        .done((res) => {
          props.handleShowNotification('success', 'Usuario agregado con éxito');
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
    setFormComplete(false);
    setModel(emptyModel);
    props.handleClose();
    setLoading(false);
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{'Crear usuario'}</DialogTitle>
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
          {/*  <FormControl fullWidth required>
            <InputLabel variant="standard">{"Contraseña"}</InputLabel>
            <Input
              type={showPassword ? "text" : "password"}
              value={model.password}
              onChange={handleChange}
              label={"Contraseña"}
              variant="standard"
              name="password"
              margin="dense"
              fullWidth
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {!isPasswordValid ? (
              <FormHelperText>
                {
                  "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número"
                }
              </FormHelperText>
            ) : null}
          </FormControl> */}
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

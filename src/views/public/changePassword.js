import React, { useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
//import Alert from "@mui/material/Alert";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Copyright from '../../components/copyright';

//React router dom
import { useNavigate } from 'react-router-dom';

import mainURL from '../../config/environment';
import $ from 'jquery';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  //Data management
  const [model, setModel] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
  });

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    /*   if (name === "newPassword") {
      const isPasswordValid = Boolean(
        value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/i)
      );
      if (isPasswordValid) {
        setPasswordValid(true);
      } else {
        setPasswordValid(false);
      }
    } */

    setModel({
      ...model,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();

    $.ajax({
      method: 'POST',
      url: mainURL + 'login/change-password',
      contentType: 'application/json',
      data: JSON.stringify(model),
    })
      .done((res) => {
        setLoading(false);
        localStorage.setItem('userInfo', JSON.stringify(res));
        navigate('/login');
      })
      .fail((res) => {
        setLoading(false);
        alert(res.responseText);
      });
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(assets/bg-black.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <img src="assets/logo.png" width={'80%'} alt="logo" />

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '80%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="oldPassword"
              label="Contraseña actual"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="newPassword"
              label="Nueva contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />

            {isLoading ? (
              <CircularProgress />
            ) : (
              <React.Fragment>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Cambiar contraseña
                </Button>{' '}
                <Button fullWidth variant="outlined" onClick={() => navigate('')}>
                  Volver a inicio de sesión
                </Button>
              </React.Fragment>
            )}
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

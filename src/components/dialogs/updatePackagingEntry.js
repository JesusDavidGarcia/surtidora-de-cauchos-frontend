import React, { useState, useEffect } from 'react';

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

//MUI-LAB
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';

import $ from 'jquery';
import mainURL from '../../config/environment';
import SelectPackaging from '../input/selectPackaging';

const emptyModel = {
  rubberReferenceId: '',
  packagingId: '',
  quantity: 0,
  packagingDate: Date.now(),
};

export default function UpdateSharpeningEntry(props) {
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);
  const { refresh, entryId } = props;

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    let value = target.value;

    setModel({
      ...model,
      [name]: value,
    });
  };

  const handleDateChange = (event) => {
    const date = event;
    setModel({
      ...model,
      sharpeningDate: date,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;

    $.ajax({
      method: 'PUT',
      url: `${mainURL}packaging-entry/${entryId}`,
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: JSON.stringify(model),
    })
      .done((res) => {
        setLoading(false);
        props.handleShowNotification('success', 'Registro actualizado con éxito');
        handleClear();
      })
      .fail((res) => {
        setLoading(false);
        if (res.status === 409) {
          handleClear();
        } else {
          props.handleShowNotification('error', res.responseText);
          handleClear();
        }
      });
  };

  const handleClear = () => {
    props.handleClose();
    setModel(emptyModel);

    props.setRefresh(!refresh);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const host = JSON.parse(localStorage.getItem('userInfo')).hostName;
    if (entryId !== '') {
      $.ajax({
        method: 'GET',
        url: `${mainURL}packaging-entry/${entryId}`,
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token,
          hostname: host,
        },
      }).done((res) => {
        setModel({ ...res, packagingDate: new Date(res.packagingDate) });
      });
    }
  }, [entryId, refresh]);

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{'Actualizar ingreso'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={'Fecha de empacado'}
                    value={model.packagingDate}
                    onChange={handleDateChange}
                    format="dd/MM/yyyy"
                    renderInput={(params) => <TextField variant="standard" />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            {/*  <Grid item xs={12} md={12}>
              <SelectReference
                handleChange={handleReferenceChange}
                value={selectedReference}
              />
            </Grid> */}
            <Grid item xs={12} md={8}>
              <SelectPackaging
                handleChange={handleChange}
                value={model.packagingId}
                name="packagingId"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  label={'Cantidad'}
                  onChange={handleChange}
                  value={model.quantity}
                  variant="standard"
                  name="quantity"
                  margin="dense"
                  type="number"
                  inputProps={{ step: '0.25' }}
                  fullWidth
                  required
                />
              </FormControl>
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
            <Button type="submit" onClick={handleSubmit}>
              Actualizar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

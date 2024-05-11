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

import $ from 'jquery';
import mainURL from '../../config/environment';
import SelectRawMaterial from '../input/selectRawMaterial';
import SelectProvider from '../input/selectProvider';

//MUI-LAB
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { Typography } from '@mui/material';

const emptyModel = {
  rawMaterialId: '',
  weight: '',
  providerId: '',
  expirationDate: '',
  invoiceNumber: '',
  invoiceValue: '',
};

export default function UpdateRawMaterialEntryDialog(props) {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;

    const formatted = {
      ...model,
      expirationDate: new Date(model.expirationDate).toISOString(),
    };
    console.log(formatted);
    $.ajax({
      method: 'PUT',
      url: `${mainURL}raw-material-entry-order/${entryId}`,
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: JSON.stringify(formatted),
    })
      .done((res) => {
        setLoading(false);
        props.handleShowNotification('success', 'Inventario actualizado con éxito');
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

  const handleDateChange = (event) => {
    const date = event;
    setModel({
      ...model,
      expirationDate: date,
    });
  };

  const handleClear = () => {
    props.handleClose();
    setModel(emptyModel);
    props.setRefresh(!refresh);
  };

  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const host = JSON.parse(localStorage.getItem('userInfo')).hostName;
    if (entryId !== '') {
      $.ajax({
        method: 'GET',
        url: `${mainURL}raw-material-entry-order/${entryId}`,
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token,
          hostname: host,
        },
      }).done((res) => {
        setModel(res);
      });
    }
  }, [entryId, refresh]);

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{'Actualizar ingreso de materia prima'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <SelectRawMaterial
                handleChange={handleChange}
                name="rawMaterialId"
                value={model.rawMaterialId}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  label={'Cantidad (Kg)'}
                  onChange={handleChange}
                  value={model.weight}
                  variant="standard"
                  name="weight"
                  margin="dense"
                  type="number"
                  fullWidth
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectProvider
                handleChange={handleChange}
                name="providerId"
                value={model.providerId}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={'Fecha de vencimiento'}
                    value={new Date(model.expirationDate)}
                    onChange={handleDateChange}
                    disablePast
                    format="dd/MM/yyyy"
                    renderInput={(params) => <TextField variant="filled" {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  label={'Factura'}
                  onChange={handleChange}
                  value={model.invoiceNumber}
                  variant="standard"
                  name="invoiceNumber"
                  margin="dense"
                  type="text"
                  fullWidth
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  label={'Valor de la factura'}
                  onChange={handleChange}
                  value={model.invoiceValue}
                  variant="standard"
                  name="invoiceValue"
                  margin="dense"
                  type="number"
                  fullWidth
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} textAlign={'center'} alignSelf={'end'}>
              <Typography>{`$ ${numberWithCommas(model.invoiceValue)}`}</Typography>
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

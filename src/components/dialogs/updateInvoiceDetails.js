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

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';

import $ from 'jquery';
import mainURL from '../../config/environment';
import SelectStamp from '../input/selectStamp';

const emptyModel = {
  invoiceDate: new Date(),
  invoicePrice: '',
  invoiceNumber: '',
  invoiceDiscount: '',
  invoiceStamp: '',
};

export default function UpdateInvoiceDetailsDialog(props) {
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);
  const { refresh, orderId, data } = props;

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

    $.ajax({
      method: 'PUT',
      url: `${mainURL}purchase-order/${orderId}/invoice-details`,
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: JSON.stringify(model),
    })
      .done((res) => {
        setLoading(false);
        // props.handleShowNotification('success', 'Inventario actualizado con éxito');
        handleClear();
      })
      .fail((res) => {
        setLoading(false);
      });
  };

  const handleClear = () => {
    props.handleClose();
    setModel(emptyModel);
    props.setRefresh(!refresh);
  };

  const handleDateChange = (event) => {
    setModel({
      ...model,
      invoiceDate: event,
    });
  };

  useEffect(() => {
    if (data)
      setModel({
        invoicePrice: data.invoicePrice === 0 ? '' : data.invoicePrice,
        invoiceNumber: data.invoiceNumber === null ? '' : data.invoiceNumber,
        invoiceDiscount: data.invoiceDiscount === 0 ? '' : data.invoiceDiscount,
        invoiceStamp: data.invoiceStamp === null ? '' : data.invoiceStamp,
        invoiceDate:
          data.invoiceDate === '0001-01-01T00:00:00' ? new Date() : new Date(data.invoiceDate),
      });
  }, [data]);

  /* useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const host = JSON.parse(localStorage.getItem('userInfo')).hostName;
    if (orderId !== '') {
      $.ajax({
        method: 'GET',
        url: `${mainURL}production-entry/${orderId}`,
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token,
          hostname: host,
        },
      }).done((res) => {
        console.log(res);
        setModel(res);
      });
    }
  }, [orderId, refresh]); */

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{'Datos de facturación'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={'Fecha'}
                    value={model.invoiceDate}
                    onChange={handleDateChange}
                    format="dd/MM/yyyy"
                    textField={(params) => <TextField variant="standard" />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label={'Número de factura'}
                  onChange={handleChange}
                  value={model.invoiceNumber}
                  variant="standard"
                  name="invoiceNumber"
                  margin="dense"
                  type="text"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label={'Valor'}
                  onChange={handleChange}
                  value={model.invoicePrice}
                  variant="standard"
                  name="invoicePrice"
                  margin="dense"
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label={'Descuento'}
                  onChange={handleChange}
                  value={model.invoiceDiscount}
                  variant="standard"
                  name="invoiceDiscount"
                  margin="dense"
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectStamp
                handleChange={handleChange}
                name={'invoiceStamp'}
                value={model.invoiceStamp}
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
            <Button type="submit" onClick={handleSubmit}>
              Actualizar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

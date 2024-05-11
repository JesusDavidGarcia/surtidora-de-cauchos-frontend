import React, { useEffect, useState } from 'react';

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

import SelectReference from '../input/selectReference';

import $ from 'jquery';
import mainURL from '../../config/environment';

//MUI-LAB
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import SelectPackaging from '../input/selectPackaging';

const emptyModel = {
  rubberReferenceId: '',
  packagingId: '',
  quantity: 0,
  packagingDate: Date.now(),
};

export default function CreatePackagingEntry(props) {
  const [selectedReference, setSelectedReference] = useState(null);
  //const [isFormComplete, setFormComplete] = useState(false);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);
  const { refresh } = props;

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

  const handleReferenceChange = (newReference) => {
    if (newReference !== null) {
      setModel({
        ...model,
        rubberReferenceId: newReference.id,
      });
      setSelectedReference(newReference);
    } else {
      setModel(emptyModel);
      setSelectedReference(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;

    const formatted = {
      ...model,
      packagingDate: new Date(model.packagingDate).toISOString(),
    };
    $.ajax({
      method: 'POST',
      url: `${mainURL}packaging-entry`,
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

  const handleClear = () => {
    props.handleClose();
    setModel(emptyModel);
    setSelectedReference(null);
    props.setRefresh(!refresh);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const host = JSON.parse(localStorage.getItem('userInfo')).hostName;
    if (model.rubberReferenceId !== '' && props.open) {
      $.ajax({
        method: 'GET',
        url: `${mainURL}rubber-reference/${model.rubberReferenceId}`,
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token,
          hostname: host,
        },
      }).done((res) => {
        setMaxQuantity(res.currentQuantity);
      });
    }
  }, [model.rubberReferenceId, props.open]);

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{'Registrar ingreso'}</DialogTitle>
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
            <Grid item xs={12} md={12}>
              <SelectReference
                handleChange={handleReferenceChange}
                value={selectedReference}
                includeSecondary
              />
            </Grid>
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
                  inputProps={{ step: '0.25', max: maxQuantity }}
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
            <Button type="submit" disabled={model.quantity === 0} onClick={handleSubmit}>
              Agregar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

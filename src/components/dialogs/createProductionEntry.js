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

import SelectReference from '../input/selectReference';

import $ from 'jquery';
import mainURL from '../../config/environment';

//MUI-LAB
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';

//import SelectAvailableSharpeners from "../input/selectSharpener";
import SelectOperator from '../input/selectOperator';
import { FormHelperText } from '@mui/material';

const emptyModel = {
  rubberReferenceId: '',
  sharpenerId: '',
  operatorId: '',
  produced: 0,
  wasted: 0,

  productionDate: Date.now(),
};

export default function CreateProviderDialog(props) {
  //const [selectedSharpener, setSelectedSharpener] = useState(null);
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

    /*  switch (name) {
      case "produced":
        if (value <= model.maxQuantity) {
          setModel({
            ...model,
            [name]: value,
          });
        }
        break;

      case "wasted":
        if (value <= model.maxQuantity - model.produced) {
          setModel({
            ...model,
            [name]: value,
          });
        }
        break;

      default:
        setModel({
          ...model,
          [name]: value,
        });
        break;
    } */

    setModel({
      ...model,
      [name]: value,
    });

    /* if (model.produced > 0 || name === 'produced') {
      setFormComplete(true);
    } */
  };

  const handleDateChange = (event) => {
    const date = event;
    setModel({
      ...model,
      productionDate: date,
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
      //setSelectedSharpener(null);
    }
  };

  /*  const handleSharpenerChange = (newReference) => {
    if (newReference !== null) {
      setModel({
        ...model,
        sharpenerId: newReference.sharpenerId,
        maxQuantity: newReference.quantity,
      });
      console.log(newReference);
      setSelectedSharpener(newReference);
    } else {
      setModel(emptyModel);
      setSelectedSharpener(null);
    }
  }; */

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;
    if (model.rubberReferenceId !== '' && model.sharpenerId !== '') {
      $.ajax({
        method: 'GET',
        url: `${mainURL}operator-sharpening/${model.rubberReferenceId}/${model.sharpenerId}/validate`,
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .done((res) => {
          if (isSubscribed) {
            console.log(res);
            if (res) setMaxQuantity(res.quantity + 1);
            else setMaxQuantity(0);
          }
        })
        .fail((res) => {
          if (res.status === 404) setMaxQuantity(0);
        });
    }
    return () => (isSubscribed = false);
  }, [model.rubberReferenceId, model.sharpenerId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;

    const formatted = {
      ...model,
      productionDate: new Date(model.productionDate).toISOString(),
    };

    $.ajax({
      method: 'POST',
      url: `${mainURL}production-entry`,
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
    //setFormComplete(false);
    setSelectedReference(null);
    //setSelectedSharpener(null);
    props.setRefresh(!refresh);
  };

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
                    label={'Fecha de producción'}
                    value={model.productionDate}
                    onChange={handleDateChange}
                    format="dd/MM/yyyy"
                    textField={(params) => <TextField variant="standard" />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectReference handleChange={handleReferenceChange} value={selectedReference} />
            </Grid>
            {/*  <Grid item xs={12} md={6}>
              <SelectAvailableSharpeners
                reference={
                  model.rubberReferenceId === ""
                    ? null
                    : model.rubberReferenceId
                }
                handleChange={handleSharpenerChange}
                value={selectedSharpener}
                required
              />
            </Grid> */}

            <Grid item xs={12} md={6}>
              <SelectOperator
                handleChange={handleChange}
                value={model.sharpenerId}
                title="Refilador"
                name="sharpenerId"
                area="refilado"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <SelectOperator
                handleChange={handleChange}
                value={model.operatorId}
                name="operatorId"
                area="manufactura"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  label={'Producido'}
                  onChange={handleChange}
                  value={model.produced}
                  variant="standard"
                  name="produced"
                  margin="dense"
                  type="number"
                  inputProps={{ step: '0.25', max: maxQuantity }}
                  fullWidth
                  required
                />
                <FormHelperText>{`La cantidad máxima permitida es ${maxQuantity}`}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  label={'Desechado'}
                  onChange={handleChange}
                  value={model.wasted}
                  variant="standard"
                  name="wasted"
                  margin="dense"
                  type="number"
                  inputProps={{
                    step: '0.25',
                  }}
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
            <Button
              type="submit"
              disabled={model.produced > maxQuantity || model.produced === 0}
              onClick={handleSubmit}
            >
              Agregar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

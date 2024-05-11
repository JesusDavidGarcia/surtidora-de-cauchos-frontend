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
import SelectRawMaterial from '../input/selectRawMaterial';
import SelectReference from '../input/selectReference';
import { Checkbox, FormControlLabel } from '@mui/material';

const emptyModel = {
  reference: '',
  application: '',
  rawWeight: 0,
  packedWeight: 0,
  currentQuantity: 0,
  sharpeningQuantity: 0,
  packagingQuantity: 0,
  sharpeningPrice: 0,
  minimum: 0,
  maximum: 0,
  rawMaterialId: 0,
  comments: '',
  primaryReferenceId: '',
};

export default function CreateProviderDialog(props) {
  const [isFormComplete, setFormComplete] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);
  const { refresh } = props;

  const [isSecondaryReference, setSecondaryReference] = useState(false);
  const [selectedReference, setSelectedReference] = useState(null);

  const handleReferenceChange = (newReference) => {
    if (newReference !== null) {
      setSelectedReference(newReference);
      setModel({
        ...model,
        id: newReference.id,
        referenceName: `${newReference.reference} ${newReference.application}`,
      });
    } else {
      setSelectedReference(null);
      setSecondaryReference(false);
    }
  };

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    let value = target.value;

    setModel({
      ...model,
      [name]: value,
    });

    if (model.reference) {
      setFormComplete(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;

    const sendModel = {
      ...model,
      primaryReferenceId: isSecondaryReference ? selectedReference.id : null,
    };

    $.ajax({
      method: 'POST',
      url: mainURL + 'rubber-reference',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: JSON.stringify(sendModel),
    })
      .done((res) => {
        setLoading(false);
        props.handleShowNotification('success', 'Referencia agregado con éxito');
        handleClear();
      })
      .fail((res) => {
        setLoading(false);

        props.handleShowNotification('error', res.responseText);
        handleClear();
      });
  };

  const handleClear = () => {
    props.handleClose();
    setModel(emptyModel);
    setFormComplete(false);
    props.setRefresh(!refresh);
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{'Crear referencia'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <TextField
                  label={'Referencia'}
                  onChange={handleChange}
                  value={model.reference}
                  variant="standard"
                  name="reference"
                  margin="dense"
                  type="text"
                  fullWidth
                  autoFocus
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <TextField
                  value={model.application}
                  onChange={handleChange}
                  label={'Aplicación'}
                  name="application"
                  variant="standard"
                  margin="dense"
                  type="text"
                  fullWidth
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <SelectRawMaterial
                handleChange={handleChange}
                value={model.rawMaterialId}
                name="rawMaterialId"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  value={model.rawWeight}
                  onChange={handleChange}
                  label={'Consumo de material (gr)'}
                  name="rawWeight"
                  variant="standard"
                  margin="dense"
                  type="number"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  value={model.packedWeight}
                  onChange={handleChange}
                  label={'Peso de embalaje (Kg)'}
                  name="packedWeight"
                  variant="standard"
                  margin="dense"
                  type="number"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  value={model.minimum}
                  onChange={handleChange}
                  label={'Cantidad mínima'}
                  name="minimum"
                  variant="standard"
                  margin="dense"
                  type="number"
                  inputProps={{ step: '0.25' }}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  value={model.maximum}
                  onChange={handleChange}
                  label={'Cantidad máxima'}
                  name="maximum"
                  variant="standard"
                  margin="dense"
                  type="number"
                  inputProps={{ step: '0.25' }}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  value={model.currentQuantity}
                  onChange={handleChange}
                  label={'Cantidad actual'}
                  name="currentQuantity"
                  variant="standard"
                  margin="dense"
                  type="number"
                  inputProps={{ step: '0.25' }}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  value={model.sharpeningQuantity}
                  onChange={handleChange}
                  label={'Cantidad en refilado'}
                  name="sharpeningQuantity"
                  variant="standard"
                  margin="dense"
                  type="number"
                  inputProps={{ step: '0.25' }}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  value={model.sharpeningPrice}
                  onChange={handleChange}
                  label={'Precio de refilado'}
                  name="sharpeningPrice"
                  variant="standard"
                  margin="dense"
                  type="number"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  value={model.packagingQuantity}
                  onChange={handleChange}
                  label={'Cantidad en empacada'}
                  name="packagingQuantity"
                  variant="standard"
                  margin="dense"
                  type="number"
                  inputProps={{ step: '1' }}
                  fullWidth
                />
              </FormControl>
            </Grid>
            {!isSecondaryReference ? (
              <Grid item xs={12}>
                <FormControlLabel
                  label="Es una referencia secundaria?"
                  control={
                    <Checkbox
                      checked={isSecondaryReference}
                      onChange={(e) => setSecondaryReference(e.target.checked)}
                    />
                  }
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <SelectReference
                  handleChange={handleReferenceChange}
                  title="Referencia primaria"
                  value={selectedReference}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <TextField
                  value={model.comments}
                  onChange={handleChange}
                  label={'Comentarios adicionales'}
                  name="comments"
                  multiline
                  rows={3}
                  margin="dense"
                  type="number"
                  fullWidth
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
            <Button type="submit" disabled={!isFormComplete} onClick={handleSubmit}>
              Agregar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

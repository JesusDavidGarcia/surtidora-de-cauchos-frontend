import React, { useState, useEffect } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';

import { IconButton } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

import $ from 'jquery';
import mainURL from '../../config/environment';

const emptyModel = {
  name: '',
  rubberReferenceId: '',
  quantity: '',
};

const useReferences = (refresh, includeSecondary) => {
  const [references, setReferences] = useState([]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;
    const include = includeSecondary ?? false;
    $.ajax({
      method: 'GET',
      url: `${mainURL}rubber-reference/get-all?includeSecondary=${include}`,
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }).done((res) => {
      const aux = res.sort((a, b) =>
        `${a.reference} ${a.application}`.localeCompare(`${b.reference} ${b.application}`),
      );
      if (isSubscribed) setReferences(aux);
    });
    return () => (isSubscribed = false);
  }, [includeSecondary]);
  return references;
};

export default function ReferenceQuantityInput(props) {
  const { refresh, usedReferences, includeSecondary } = props;

  const references = useReferences(refresh, includeSecondary);

  const [model, setModel] = useState(emptyModel);
  const [selectedReference, setSelectedReference] = useState(null);

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === 'rubberReferenceId') {
      const item = references.filter((x) => x.id === value)[0];
      console.log(item);
      setModel({
        ...model,
        [name]: value,
        name: item?.reference,
        packedWeight: item?.packedWeight,
      });
    } else {
      setModel({
        ...model,
        [name]: value,
      });
    }
  };

  const handleReferenceChange = (newReference) => {
    if (newReference !== null) {
      setSelectedReference(newReference);
      setModel({
        ...model,
        rubberReferenceId: newReference.id,
        referenceName: `${newReference.reference} ${newReference.application}`,
        packedWeight: newReference.packedWeight,
      });
    } else {
      setModel(emptyModel);
      setSelectedReference(null);
    }
  };

  const handleSubmit = () => {
    props.handleAdd(model);
    setModel(emptyModel);
    setSelectedReference(null);
  };

  return (
    <Grid container alignItems={'center'} spacing={2}>
      <Grid item xs={12} md={8}>
        <FormControl required fullWidth>
          <Autocomplete
            id="tags-standard"
            options={references.filter((x) => !usedReferences.includes(x.id))}
            getOptionLabel={(opt) => `${opt.reference} ${opt.application}`}
            value={selectedReference}
            onChange={(event, newValue) => {
              handleReferenceChange(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Referencias" />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={8} md={2}>
        <FormControl required fullWidth>
          <TextField
            label={'Cantidad'}
            onChange={handleChange}
            value={model.quantity}
            variant="standard"
            name="quantity"
            margin="dense"
            type="number"
            fullWidth
            autoFocus
            required
          />
        </FormControl>
      </Grid>
      <Grid item xs={4} md={2} container justifyContent={'flex-end'}>
        <IconButton onClick={handleSubmit} disabled={model.quantity === 0}>
          <Tooltip title="Agregar referencia">
            <CheckCircle color={model === emptyModel ? 'action' : 'primary'} />
          </Tooltip>
        </IconButton>
      </Grid>
    </Grid>
  );
}

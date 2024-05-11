import React, { useState, useEffect } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import $ from 'jquery';
import mainURL from '../../config/environment';

const useClients = (refresh) => {
  const [cllients, setClients] = useState([]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;
    $.ajax({
      method: 'GET',
      url: mainURL + 'client/get-all',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }).done((res) => {
      const aux = res.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

      if (isSubscribed) setClients(aux);
    });
    return () => (isSubscribed = false);
  }, []);
  return cllients;
};

export default function SelectClient(props) {
  const { handleChange } = props;
  const { required } = props;
  const { refresh } = props;
  const { value } = props;

  const clients = useClients(refresh);

  return (
    <FormControl fullWidth required={required} sx={{ height: '56px', justifyContent: 'flex-end' }}>
      <Autocomplete
        id="tags-standard"
        options={clients}
        getOptionLabel={(opt) => opt.name}
        value={value}
        onChange={(event, newValue) => {
          handleChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} variant="standard" label="Cliente" />}
      />
    </FormControl>
  );
}

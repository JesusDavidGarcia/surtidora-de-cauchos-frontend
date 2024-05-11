import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import $ from 'jquery';
import mainURL from '../../config/environment';

const useReferences = (refresh) => {
  const [references, setReferences] = useState([]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;
    $.ajax({
      method: 'GET',
      url: mainURL + 'rubber-reference/get-all',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }).done((res) => {
      if (isSubscribed) setReferences(res);
    });
    return () => (isSubscribed = false);
  }, []);
  return references;
};

export default function SelectReference(props) {
  const references = useReferences();
  //const [selected, setSelected] = useState([]);

  const { value, handleChange } = props;

  return (
    <FormControl fullWidth sx={{ p: '0px 16px' }}>
      <Autocomplete
        id="tags-standard"
        options={references}
        value={value}
        onChange={(event, newValue) => {
          handleChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} variant="standard" label="Referencias" />}
      />
    </FormControl>
  );
}

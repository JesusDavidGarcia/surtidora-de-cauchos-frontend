import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

export default function SelectStamp(props) {
  const { handleChange } = props;
  const { required } = props;
  const { value } = props;
  const { name } = props;

  const providers = [
    { id: 'Sevilla', name: 'Sevilla' },
    { id: 'Armenia', name: 'Armenia' },
  ];

  return (
    <FormControl fullWidth required={required} sx={{ height: '56px', justifyContent: 'flex-end' }}>
      <InputLabel variant="standard">{'Sello'}</InputLabel>
      <Select value={value} onChange={handleChange} name={name} variant="standard" native>
        <option value="" />
        {providers.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

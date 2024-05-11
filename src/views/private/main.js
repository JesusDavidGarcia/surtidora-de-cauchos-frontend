import React from 'react';

import Grid from '@mui/material/Grid';

//Selfmade
import Dashboard from '../../components/dashboard';

export default function Main(props) {
  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Dashboard />
      </Grid>
    </Grid>
  );
}

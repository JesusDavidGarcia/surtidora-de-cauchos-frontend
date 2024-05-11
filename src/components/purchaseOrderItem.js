import React from 'react';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function PurchaseOrderItem(props) {
  const { item } = props;
  return (
    <Grid container sx={{ pb: 1 }}>
      <Grid item xs={12}>
        <Typography variant="subtitle1">{item.referenceName}</Typography>
      </Grid>
      <Grid item container sm={12} sx={{ pl: 1 }}>
        <Typography variant="body1">{`Cantidad: ${item.quantity}`}</Typography>
      </Grid>
      <Grid item container sm={12} sx={{ pl: 1 }}>
        <Typography variant="body1">{`Faltante: ${item.missingQuantity}`}</Typography>
      </Grid>
    </Grid>
  );
}

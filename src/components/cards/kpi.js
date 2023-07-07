import React from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

export default function KPICard(props) {
  const { Icon, text, value } = props;

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item container direction="column" md={6}>
            {<Icon fontSize={"large"} />}
            <Typography variant="body1">{text}</Typography>
          </Grid>
          <Grid item md={6} container justifyContent={"flex-end"}>
            <Typography variant="h3">{value}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

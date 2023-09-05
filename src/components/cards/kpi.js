import React from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ButtonBase } from "@mui/material";

export default function KPICard(props) {
  const { Icon, text, value, handleClick } = props;

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item container direction="column" md={6}>
            <Icon fontSize={"large"} />
            <Typography variant="body1">{text}</Typography>
          </Grid>
          <Grid item md={6} container justifyContent={"flex-end"}>
            <ButtonBase onClick={handleClick}>
              <Typography variant="h3">{value}</Typography>
            </ButtonBase>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

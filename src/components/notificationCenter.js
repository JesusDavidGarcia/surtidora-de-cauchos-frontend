import React from "react";

import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import DownloadIcon from "@mui/icons-material/Download";
import WarningIcon from "@mui/icons-material/Warning";

import { useNavigate } from "react-router-dom";

export default function NotificationCenter(props) {
  const { handleOnHoverClose, handleClose, open, notifications } = props;

  const navigate = useNavigate();

  const handleExport = (event) => {
    navigate("/alertas");
    handleClose();
  };

  return (
    <Drawer
      onMouseLeave={() => {
        handleOnHoverClose();
      }}
      anchor={"right"}
      open={open}
      onClose={handleClose}
    >
      <Toolbar />
      <Toolbar>
        <Grid container justifyContent={"space-between"}>
          <Typography variant="subtitle1">Alertas</Typography>
          <IconButton onClick={handleExport}>
            <DownloadIcon />
          </IconButton>
        </Grid>
      </Toolbar>
      <Grid container spacing={2} sx={{ maxWidth: "400px", p: 2 }}>
        {notifications.map((noti) => (
          <Grid key={noti.id} item sm={12}>
            <Card>
              <CardHeader
                avatar={<WarningIcon color="warning" fontSize="large" />}
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {noti.application}
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant="subtitle1">{noti.message}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Drawer>
  );
}

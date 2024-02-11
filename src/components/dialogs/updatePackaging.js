import React, { useState, useEffect } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import $ from "jquery";
import mainURL from "../../config/environment";

const emptyModel = {
  name: "",
};

export default function UpdatePackagingDialog(props) {
  const [isFormComplete, setFormComplete] = useState(false);
  const [isEmailValid, setEmailValid] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);
  const { refresh, packagingId } = props;

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    let value = target.value;

    switch (name) {
      case "email":
        value = value.toLowerCase();
        const isEmailValid = Boolean(
          value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
        );
        if (isEmailValid) {
          setEmailValid(true);
        } else {
          setEmailValid(false);
        }
        setModel({
          ...model,
          [name]: value,
        });
        break;

      default:
        setModel({
          ...model,
          [name]: value,
        });
        break;
    }

    if (model.name !== "" && isEmailValid !== "" && isEmailValid) {
      setFormComplete(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("userInfo")).token;

    $.ajax({
      method: "PUT",
      url: `${mainURL}packaging/${packagingId}`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(model),
    })
      .done((res) => {
        setLoading(false);
        props.handleShowNotification(
          "success",
          "Empaque actualizado con éxito"
        );
        handleClear();
      })
      .fail((res) => {
        setLoading(false);
        props.handleShowNotification("error", res.responseText);
        handleClear();
      });
  };

  const handleClear = () => {
    props.handleClose();
    setModel(emptyModel);
    setFormComplete(false);
    props.setRefresh(!refresh);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    const host = JSON.parse(localStorage.getItem("userInfo")).hostName;
    if (packagingId !== "") {
      $.ajax({
        method: "GET",
        url: `${mainURL}packaging/${packagingId}`,
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + token,
          hostname: host,
        },
      }).done((res) => {
        setModel(res);
      });
    }
  }, [packagingId, refresh]);

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{"Editar empaque"}</DialogTitle>
      <DialogContent sx={{ minWidth: "20rem" }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <TextField
                  label={"Nombre"}
                  onChange={handleChange}
                  value={model.name}
                  variant="standard"
                  name="name"
                  margin="dense"
                  type="text"
                  fullWidth
                  autoFocus
                  required
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <Grid container justifyContent={"center"}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container justifyContent={"flex-end"}>
            <Button type="submit" onClick={handleClear}>
              Cerrar
            </Button>
            <Button
              type="submit"
              disabled={!isFormComplete}
              onClick={handleSubmit}
            >
              Actualizar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

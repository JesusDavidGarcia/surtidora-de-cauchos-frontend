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

import SelectReference from "../input/selectReference";

import $ from "jquery";
import mainURL from "../../config/environment";
import SelectOperator from "../input/selectOperator";

const emptyModel = {
  rubberReferenceId: "",
  operatorId: 0,
  produced: 0,
  wasted: 0,
};

export default function UpdateSharpeningEntry(props) {
  const [isFormComplete, setFormComplete] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);
  const { refresh, entryId } = props;

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    let value = target.value;

    setModel({
      ...model,
      [name]: value,
    });

    if (model.produced > 0) {
      setFormComplete(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("userInfo")).token;

    $.ajax({
      method: "PUT",
      url: `${mainURL}production-entry/${entryId}`,
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
          "Inventario actualizado con éxito"
        );
        handleClear();
      })
      .fail((res) => {
        setLoading(false);
        if (res.status === 409) {
          handleClear();
        } else {
          props.handleShowNotification("error", res.responseText);
          handleClear();
        }
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
    if (entryId !== "") {
      $.ajax({
        method: "GET",
        url: `${mainURL}production-entry/${entryId}`,
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + token,
          hostname: host,
        },
      }).done((res) => {
        setModel(res);
      });
    }
  }, [entryId, refresh]);

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{"Registrar ingreso"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <SelectReference
                handleChange={handleChange}
                name="rubberReferenceId"
                value={model.rubberReferenceId}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectOperator
                handleChange={handleChange}
                name="operatorId"
                value={model.operatorId}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth required>
                <TextField
                  label={"Producido"}
                  onChange={handleChange}
                  value={model.produced}
                  variant="standard"
                  name="produced"
                  margin="dense"
                  type="number"
                  inputProps={{ step: "0.25" }}
                  fullWidth
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth required>
                <TextField
                  label={"Desechado"}
                  onChange={handleChange}
                  value={model.wasted}
                  variant="standard"
                  name="wasted"
                  margin="dense"
                  type="number"
                  inputProps={{ step: "0.25" }}
                  fullWidth
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

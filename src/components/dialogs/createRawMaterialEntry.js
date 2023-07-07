import React, { useState } from "react";

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
import SelectRawMaterial from "../input/selectRawMaterial";
import SelectProvider from "../input/selectProvider";

//MUI-LAB
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";

const emptyModel = {
  rawMaterialId: 0,
  weight: 0,
  providerId: "",
  expirationDate: Date.now(),
  invoiceNumber: "",
  inviceValue: 0,
};

export default function CreateRawMaterialEntryDialog(props) {
  const [isFormComplete, setFormComplete] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);
  const { refresh } = props;

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    let value = target.value;

    setModel({
      ...model,
      [name]: value,
    });

    if (model.weight > 0) {
      setFormComplete(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("userInfo")).token;

    const formatted = {
      ...model,
      expirationDate: new Date(model.expirationDate).toISOString(),
    };
    console.log(formatted);
    $.ajax({
      method: "POST",
      url: mainURL + "raw-material-entry-order",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(formatted),
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

  const handleDateChange = (event) => {
    const date = event;
    setModel({
      ...model,
      expirationDate: date,
    });
  };

  const handleClear = () => {
    props.handleClose();
    setModel(emptyModel);
    setFormComplete(false);
    props.setRefresh(!refresh);
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{"Registrar ingreso de materia prima"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <SelectRawMaterial
                handleChange={handleChange}
                name="rawMaterialId"
                value={model.rawMaterialId}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  label={"Cantidad (Kg)"}
                  onChange={handleChange}
                  value={model.weight}
                  variant="standard"
                  name="weight"
                  margin="dense"
                  type="number"
                  fullWidth
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectProvider
                handleChange={handleChange}
                name="providerId"
                value={model.providerId}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={"Fecha de vencimiento"}
                    value={model.expirationDate}
                    onChange={handleDateChange}
                    disablePast
                    format="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField variant="filled" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  label={"Factura"}
                  onChange={handleChange}
                  value={model.invoiceNumber}
                  variant="standard"
                  name="invoiceNumber"
                  margin="dense"
                  type="text"
                  fullWidth
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <TextField
                  label={"Valor de la factura"}
                  onChange={handleChange}
                  value={model.inviceValue}
                  variant="standard"
                  name="inviceValue"
                  margin="dense"
                  type="number"
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
              Agregar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

import React, { useState, useEffect } from "react";

//Material UI

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";

//JQuery
import mainURL from "../../config/environment";
import $ from "jquery";
import { List, ListItem, ListItemText } from "@mui/material";

const emptyData = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  reference: "string",
  application: "string",
  rawWeight: 0,
  packedWeight: 0,
  currentQuantity: 0,
  sharpeningQuantity: 0,
  sharpeningPrice: 0,
  minimum: 0,
  maximum: 0,
  rawMaterialId: 0,
  rawMaterialName: "string",
  comments: "string",
};

export default function ReferenceDetails(props) {
  const [data, setData] = useState(emptyData);

  const { refresh, referenceId } = props;

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    if (referenceId !== undefined) {
      $.ajax({
        method: "GET",
        url: `${mainURL}rubber-reference/${referenceId}`,
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).done((res) => {
        console.log(res);
        if (isSubscribed) setData(res);
      });
    }
    return () => (isSubscribed = false);
  }, [refresh, referenceId]);
  //Submit

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle id="alert-dialog-title">{`${data.reference} - ${data.application}`}</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemText
              primary={"Material"}
              secondary={data.rawMaterialName}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={"Cantidad actual"}
              secondary={data.currentQuantity}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={"Cantidad en refilado"}
              secondary={data.sharpeningQuantity}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={"Consumo de material"}
              secondary={`${data.rawWeight} g`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={"Peso de empaquetado"}
              secondary={`${data.packedWeight} Kg`}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary={"Comentarios"} secondary={data.comments} />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent={"flex-end"}>
          <Button onClick={props.handleClose} color="primary">
            {"Cerrar"}
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

import React, { useState, useEffect } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import CancelIcon from "@mui/icons-material/Cancel";
import InboxIcon from "@mui/icons-material/Inbox";

import $ from "jquery";
import mainURL from "../../config/environment";

import ReferenceQuantityInput from "../../components/input/referenceQuantity";
import { useNavigate, useParams } from "react-router-dom";

const emptyModel = {
  clientId: "",
  references: [],
};

const emptyResponse = {
  id: "",
  clientId: "",
  clientName: "",
  createdOn: "2023-05-08T22:19:35.235Z",
  shipmentWeight: 0,
  invoicePrice: 0,
  nuberOfBoxes: 0,
  missingMaterial: 0,
  references: [],
};

export default function UpdatePurchaseOrder(props) {
  const [response, setResponse] = useState(emptyResponse);
  const [showResponse, setShowResponse] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);

  const { orderId } = useParams();

  //Navigation
  const navigate = useNavigate();

  const handleAdd = (item) => {
    const a = [...model.references];

    a.push(item);
    setModel({ ...model, references: a });
  };

  const handleDelete = (index) => () => {
    let a = [...model.references];
    a.splice(index, 1);

    setModel({ ...model, references: a });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    $.ajax({
      method: "PUT",
      url: `${mainURL}purchase-order/${orderId}`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(model),
    })
      .done((res) => {
        setLoading(false);
        handleShowNotification(
          "success",
          "Orden de compra actualizada con éxito"
        );
        navigate(`/ordenes-compra/${res.id}`);
        handleClear();
      })
      .fail((res) => {
        setLoading(false);

        handleShowNotification("error", res.responseText);
        handleClear();
      });
  };

  const handleValidate = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("userInfo")).token;

    $.ajax({
      method: "POST",
      url: mainURL + "purchase-order/validate",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(model),
    })
      .done((res) => {
        console.log(res);
        setLoading(false);
        setResponse(res);
        setShowResponse(true);
        //handleShowNotification("success", "Orden de compra agregada con éxito");
        //handleClear();
      })
      .fail((res) => {
        setLoading(false);

        // handleShowNotification("error", res.responseText);
        //handleClear();
      });
  };

  //Notification management
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({
    severity: "",
    message: "",
  });

  const handleShowNotification = (severity, message) => {
    setNotificationMessage({ severity: severity, message: message });
    setShowNotification(true);
    setTimeout(function () {
      setShowNotification(false);
    }, 2000);
  };

  const handleClear = () => {
    /* setModel(emptyModel);
    props.setRefresh(!refresh); */
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    //handleShowNotification("info", "Cargando ordenes de compra");
    $.ajax({
      method: "GET",
      url: `${mainURL}purchase-order/${orderId}`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        console.log(res);
        if (isSubscribed) {
          console.log(res);
          setModel(res);
        }
      })
      .fail((res) => {
        //handleShowNotification("error", res.responseText);
      });
    return () => (isSubscribed = false);
  }, [orderId]);

  return (
    <Box sx={{ height: "85vh", p: 2 }}>
      <Grid item xs={12} md={8} sx={{ p: "16px 0" }}>
        <Typography variant="h4">{`Orden de compra: ${1}`}</Typography>
      </Grid>
      {showNotification ? (
        <Grid item xs={12} md={4}>
          <Alert variant="outlined" severity={notificationMessage.severity}>
            {notificationMessage.message}
          </Alert>
        </Grid>
      ) : null}
      <Grid container spacing={2} sx={{ pb: 10 }}>
        <Grid item container md={6}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Grid item xs={12} md={12}>
                <ReferenceQuantityInput
                  handleAdd={handleAdd}
                  usedReferences={model.references.map(
                    (m) => m.rubberReferenceId
                  )}
                />
              </Grid>
            </CardContent>

            <CardActions>
              <Grid container justifyContent={"flex-end"}>
                {!isLoading ? (
                  <React.Fragment>
                    <Button
                      type="submit"
                      variant="outlined"
                      onClick={handleValidate}
                      sx={{ mr: 2 }}
                    >
                      Validar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={handleSubmit}
                    >
                      Actualizar
                    </Button>
                  </React.Fragment>
                ) : (
                  <CircularProgress />
                )}
              </Grid>
            </CardActions>
          </Card>
        </Grid>
        {model !== emptyModel ? (
          <Grid item container md={6}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Typography variant="h5">{model.clientName}</Typography>
                <List>
                  {model.references.map((reference, index) => (
                    <ListItem
                      disablePadding
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={handleDelete(index)}
                        >
                          <CancelIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <InboxIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={reference.referenceName}
                        secondary={
                          <Typography variant="body2">
                            {`Cantidad: ${reference.quantity}`}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                  <Divider />
                </List>
                {showResponse ? (
                  <Grid container>
                    <Grid container alignItems={"center"}>
                      <Typography variant="subtitle1">Peso total:</Typography>
                      <Typography
                        variant="body1"
                        sx={{ ml: 2 }}
                        color="textSecondary"
                      >
                        {`${response.shipmentWeight} Kg`}
                      </Typography>
                    </Grid>
                    <Grid container alignItems={"center"}>
                      <Typography variant="subtitle1">
                        Número de cajas:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ ml: 2 }}
                        color="textSecondary"
                      >
                        {response.nuberOfBoxes}
                      </Typography>
                    </Grid>
                    <Grid container alignItems={"center"}>
                      <Typography variant="subtitle1">
                        Material faltante
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ ml: 2 }}
                        color="textSecondary"
                      >
                        {`${response.missingMaterial} Kg`}
                      </Typography>
                    </Grid>
                  </Grid>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}

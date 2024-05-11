import React, { useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Box from '@mui/material/Box';

import CancelIcon from '@mui/icons-material/Cancel';
import InboxIcon from '@mui/icons-material/Inbox';

import $ from 'jquery';
import mainURL from '../../config/environment';

import ReferenceQuantityInput from '../../components/input/referenceQuantity';
import SelectPackaging from '../../components/input/selectPackaging';
import SelectClient from '../../components/input/selectClient';
import { useNavigate } from 'react-router-dom';

const emptyModel = {
  clientId: '',
  references: [],
  usePackaging: false,
  packagingId: '',
};

const emptyResponse = {
  id: '',
  clientId: '',
  clientName: '',
  createdOn: '2023-05-08T22:19:35.235Z',
  shipmentWeight: 0,
  invoicePrice: 0,
  numberOfBoxes: 0,
  missingMaterial: 0,
  references: [],
};

export default function CreatePurchaseOrder(props) {
  //const [isFormComplete, setFormComplete] = useState(false);
  //const [totalWeight, setTotalWeight] = useState(0);

  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);
  const [selectedClient, setSelectedClient] = useState(null);
  const [response, setResponse] = useState(emptyResponse);

  const [showResponse, setShowResponse] = useState(false);
  const [disabled, setDisabled] = useState(false);

  //Navigation
  const navigate = useNavigate();

  const handleClientChange = (newClient) => {
    if (newClient !== null) {
      setModel({
        ...model,
        clientId: newClient.id,
        clientName: newClient.name,
      });
      setSelectedClient(newClient);
    } else {
      setModel(emptyModel);
      setSelectedClient(null);
    }
  };

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    let value = target.value;

    setModel({
      ...model,
      [name]: value,
    });
  };

  const handleAdd = (item) => {
    const a = [...model.references];

    a.push(item);
    setModel({ ...model, references: a });

    /*  setTotalWeight(
      a
        .map((x) => x.packedWeight)
        .reduce((accumulator, currentValue) => accumulator + currentValue)
    ); */
  };

  const handleDelete = (index) => () => {
    let a = [...model.references];
    a.splice(index, 1);

    setModel({ ...model, references: a });
    /*  setTotalWeight(
      a
        .map((x) => x.packedWeight)
        .reduce((accumulator, currentValue) => accumulator + currentValue)
    ); */
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const newModel = {
      ...model,
      packagingId: model.usePackaging ? model.packagingId : null,
    };
    $.ajax({
      method: 'POST',
      url: mainURL + 'purchase-order',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: JSON.stringify(newModel),
    })
      .done((res) => {
        setLoading(false);
        handleShowNotification('success', 'Orden de compra agregada con éxito');
        navigate(`/ordenes-compra/${res.id}`);
        handleClear();
      })
      .fail((res) => {
        setLoading(false);

        handleShowNotification('error', res.responseText);
        handleClear();
      });
  };

  const handleValidate = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const newModel = {
      ...model,
      packagingId: model.usePackaging ? model.packagingId : null,
    };
    $.ajax({
      method: 'POST',
      url: mainURL + 'purchase-order/validate',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: JSON.stringify(newModel),
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
    severity: '',
    message: '',
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
    if (
      model.clientId === '' ||
      model.references.length === 0 ||
      (model.usePackaging && model.packagingId === '')
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [model]);

  return (
    <Box sx={{ height: '85vh', p: 2 }}>
      <Grid item xs={12} md={8} sx={{ p: '16px 0' }}>
        <Typography variant="h4">{'Crear order de compra'}</Typography>
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
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <SelectClient handleChange={handleClientChange} value={selectedClient} />
                </Grid>
                {model.usePackaging ? (
                  <Grid container item xs={12} md={6}>
                    <Grid item xs={9}>
                      <SelectPackaging
                        handleChange={handleChange}
                        value={model.packagingId}
                        name="packagingId"
                      />
                    </Grid>
                    <Grid item xs={3} container justifyContent={'center'} alignItems={'flex-end'}>
                      <IconButton
                        size="small"
                        onClick={() => setModel({ ...model, usePackaging: false })}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    container
                    justifyContent={'center'}
                    alignItems={'flex-end'}
                  >
                    <FormControlLabel
                      label="Utilizar empaque"
                      control={
                        <Checkbox
                          checked={model.usePackaging}
                          onChange={(e) =>
                            setModel({
                              ...model,
                              usePackaging: e.target.checked,
                            })
                          }
                        />
                      }
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={12}>
                  <ReferenceQuantityInput
                    handleAdd={handleAdd}
                    usedReferences={model.references.map((m) => m.rubberReferenceId)}
                    includeSecondary
                  />
                </Grid>
              </Grid>
            </CardContent>

            <CardActions>
              <Grid container justifyContent={'flex-end'}>
                {!isLoading ? (
                  <React.Fragment>
                    <Button
                      type="submit"
                      variant="outlined"
                      onClick={handleValidate}
                      disabled={disabled}
                      sx={{ mr: 2 }}
                    >
                      Validar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={disabled}
                      onClick={handleSubmit}
                    >
                      Crear
                    </Button>
                  </React.Fragment>
                ) : (
                  <CircularProgress />
                )}
              </Grid>
            </CardActions>
          </Card>
        </Grid>
        {model.references.length > 0 ? (
          <Grid item container md={6}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h5">{model.clientName}</Typography>
                <List>
                  {model.references.map((reference, index) => (
                    <ListItem
                      disablePadding
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={handleDelete(index)}>
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
                            {`Cantidad recibida: ${reference.quantity} - Faltante: ${
                              response.references.filter(
                                (m) => m.rubberReferenceId === reference.rubberReferenceId,
                              )[0]?.missingQuantity
                            } - Por empacar: ${
                              response.references.filter(
                                (m) => m.rubberReferenceId === reference.rubberReferenceId,
                              )[0]?.missingPackagingQuantity
                            }`}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                  <Divider />
                </List>
                {showResponse ? (
                  <Grid container>
                    <Grid container alignItems={'center'}>
                      <Typography variant="subtitle1">Peso total:</Typography>
                      <Typography variant="body1" sx={{ ml: 2 }} color="textSecondary">
                        {response.shipmentWeight}
                      </Typography>
                    </Grid>
                    <Grid container alignItems={'center'}>
                      <Typography variant="subtitle1">Número de cajas:</Typography>
                      <Typography variant="body1" sx={{ ml: 2 }} color="textSecondary">
                        {response.numberOfBoxes}
                      </Typography>
                    </Grid>
                    <Grid container alignItems={'center'}>
                      <Typography variant="subtitle1">Material faltante</Typography>
                      <Typography variant="body1" sx={{ ml: 2 }} color="textSecondary">
                        {response.missingMaterial}
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

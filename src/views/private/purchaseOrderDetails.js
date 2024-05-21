import React, { useState, useEffect } from 'react';

import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

import $ from 'jquery';
import mainURL from '../../config/environment';

import { useNavigate, useParams } from 'react-router-dom';

import { DataGrid } from '@mui/x-data-grid';
import { Download, Edit, BrowserUpdated, PlaylistAdd } from '@mui/icons-material';

import { PDFDownloadLink } from '@react-pdf/renderer';
import PurchaseOrderDocument from '../../components/docs/purchaseOrder';
import { useWidth } from '../../utils/withSelector';
import ClientPurchaseOrderDocument from '../../components/docs/clientPurchaseOrder';
import { Tooltip } from '@mui/material';
import AddReferenceToPurchaseOrder from '../../components/dialogs/addReferencesToPurchaseOrder';

const emptyModel = {
  id: '',
  clientId: '',
  clientName: '',
  createdOn: '',
  shipmentWeight: 0,
  invoicePrice: 0,
  invoiceNumber: '',
  invoiceDate: '',
  invoiceDiscount: '',
  invoiceStamp: '',
  numberOfBoxes: 0,
  missingMaterial: 0,
  orderNumber: 0,
  usePackaging: true,
  packagingId: '',
  packagingName: '',
  references: [],
};

export default function PurchaseOrderDetails(props) {
  const [data, setData] = useState(emptyModel);
  const [rows, setRows] = useState([]);
  const { orderId } = useParams();

  const navigate = useNavigate();
  const breakpoint = useWidth();

  const columns: GridColDef[] = [
    {
      headerName: 'Referencia',
      field: 'referenceName',
      flex: 1,
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Cantidad',
      field: 'quantity',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Por producir',
      field: 'missingQuantity',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      breakpoints: ['md', 'lg', 'xl'],
    },
    {
      headerName: 'Por empacar',
      field: 'missingPackagingQuantity',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      breakpoints: ['md', 'lg', 'xl'],
    },
  ];

  const [dialog, setDialog] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleClose = () => {
    setRefresh(false);
    setDialog(false);
  };

  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;
    //handleShowNotification("info", "Cargando ordenes de compra");
    $.ajax({
      method: 'GET',
      url: `${mainURL}purchase-order/${orderId}`,
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .done((res) => {
        const aux: GridRowsProp = res.references.map((ref, idx) => ({
          ...ref,
          id: idx,
          missingQuantity:
            ref.missingQuantity % 1 === 0 ? ref.missingQuantity : ref.missingQuantity.toFixed(2),
        }));

        if (isSubscribed) {
          setData(res);
          setRows(aux);
          //handleShowNotification("success", "Ordenes cargadas con éxito");
        }
      })
      .fail((res) => {
        //handleShowNotification("error", res.responseText);
      });
    return () => (isSubscribed = false);
  }, [orderId, refresh]);

  const handleToggleView = () => {
    navigate(`/ordenes-compra/${orderId}/editar`);
  };

  const handleToggleDialog = () => {
    setDialog(true);
  };

  return (
    <Box sx={{ height: '85vh', p: 2 }}>
      <AddReferenceToPurchaseOrder
        id={data.id}
        open={dialog}
        handleClose={handleClose}
        orderNumber={data.orderNumber}
      />
      <Grid container spacing={2} height={'100%'}>
        <Grid item container xs={12}>
          <Card sx={{ width: '100%' }}>
            <CardHeader
              title={
                <Typography sx={{ fontWeight: 600, fontSize: 25 }}>
                  {`Orden de compra #${data.orderNumber}`}
                </Typography>
              }
              subheader={
                <React.Fragment>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {data.clientName}
                  </Typography>
                  <Typography variant="body1">
                    {new Date(data.createdOn).toLocaleDateString()}
                  </Typography>
                  {data.usePackaging ? (
                    <Typography variant="body1">{`Empaque ${data.packagingName}`}</Typography>
                  ) : null}
                </React.Fragment>
              }
              action={
                <Grid container>
                  <IconButton onClick={handleToggleDialog}>
                    <PlaylistAdd color="primary" />
                  </IconButton>

                  <IconButton onClick={handleToggleView}>
                    <Edit color="primary" />
                  </IconButton>

                  <PDFDownloadLink
                    document={<PurchaseOrderDocument data={data} />}
                    fileName={`Orden de compra interna ${data.orderNumber}.pdf`}
                  >
                    <Tooltip title="Descargar orden de compra interna">
                      <IconButton>
                        <Download color="primary" />
                      </IconButton>
                    </Tooltip>
                  </PDFDownloadLink>

                  <PDFDownloadLink
                    document={<ClientPurchaseOrderDocument data={data} />}
                    fileName={`Orden de compra ${data.orderNumber}.pdf`}
                  >
                    <Tooltip title="Descargar orden de compra para el cliente">
                      <IconButton>
                        <BrowserUpdated color="primary" />
                      </IconButton>
                    </Tooltip>
                  </PDFDownloadLink>
                </Grid>
              }
            />

            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 550 }}>
                Referencias adquiridas
              </Typography>

              <Box sx={{ height: '40vh', width: '100%', p: '16px 0' }}>
                <DataGrid
                  autoPageSize
                  rows={rows}
                  columns={columns.filter((m) => m.breakpoints.includes(breakpoint))}
                  disableColumnMenu
                />
              </Box>

              {/* <Divider /> */}

              <Grid container sx={{ pt: 2 }}>
                {data.invoiceNumber !== '' ? (
                  <Grid container item sm={6} spacing={2}>
                    <Grid item xs={12}>
                      <Typography>{'Datos de facturación'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{'Número de factura'}</Typography>
                      <Typography variant="body2" color={'textSecondary'}>
                        {data.invoiceNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{'Fecha'}</Typography>
                      <Typography variant="body2" color={'textSecondary'}>
                        {new Date(data.invoiceDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{'Valor'}</Typography>
                      <Typography variant="body2" color={'textSecondary'}>
                        {`$ ${numberWithCommas(parseFloat(data.invoicePrice))}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{'Descuento'}</Typography>
                      <Typography variant="body2" color={'textSecondary'}>
                        {`$ ${numberWithCommas(parseFloat(data.invoiceDiscount))}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{'Sello'}</Typography>
                      <Typography variant="body2" color={'textSecondary'}>
                        {data.invoiceStamp}
                      </Typography>
                    </Grid>
                  </Grid>
                ) : null}
                <Grid container direction={'column'} item sm={6}>
                  <Typography variant="body1">{`Peso total: ${data.shipmentWeight} Kg`}</Typography>
                  <Typography variant="body1">{`Número de cajas: ${data.numberOfBoxes}`}</Typography>
                  <Typography variant="body1">{`Material faltante: ${data.missingMaterial} Kg`}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/*  <Grid item sx={{ display: { xs: "none", md: "block" } }} sm={6}>
          <PdfReport data={data} />
        </Grid> */}
      </Grid>
    </Box>
  );
}

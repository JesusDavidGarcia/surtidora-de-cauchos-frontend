import React, { useState, useEffect } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
//import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

import $ from "jquery";
import mainURL from "../../config/environment";

import { useParams } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";

//import PurchaseOrderItem from "../../components/purchaseOrderItem";

const emptyModel = {
  id: "",
  clientId: "",
  clientName: "",
  createdOn: "",
  shipmentWeight: 0,
  invoicePrice: 0,
  nuberOfBoxes: 0,
  missingMaterial: 0,
  references: [],
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "Times-Roman",
  },
  headers: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
  },
  date: {
    fontSize: 14,
  },
  section: {
    paddingVertical: 10,
    flexDirection: "column",
  },
  divider: {
    width: "100%",
    padding: "16px 0",
    borderTop: "1px solid #505050",
  },
  diagnostic: {
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  technician: {
    fontSize: 14,
    color: "#121212",
  },
  image: {
    width: "200px",
    maxHeight: "400px",
  },
  images: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    margin: "16px 0",
    borderWidth: 1,
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    background: "#f6f6f6",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  refTableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    fontSize: 14,
  },
});

export default function PurchaseOrderDetails(props) {
  const [showReport, setShowReport] = useState(false);
  const [data, setData] = useState(emptyModel);
  const [rows, setRows] = useState([]);
  const { orderId } = useParams();

  const columns: GridColDef[] = [
    {
      headerName: "Referencia",
      field: "referenceName",
      flex: 1,
    },
    {
      headerName: "Cantidad",
      field: "quantity",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "Cantidad faltante",
      field: "missingQuantity",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ];

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

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    handleShowNotification("info", "Cargando ordenes de compra");
    $.ajax({
      method: "GET",
      url: `${mainURL}purchase-order/${orderId}`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        const aux: GridRowsProp = res.references.map((ref, idx) => ({
          ...ref,
          id: idx,
        }));
        console.log(aux);
        if (isSubscribed) {
          setData(res);
          setRows(aux);
          handleShowNotification("success", "Ordenes cargadas con éxito");
        }
      })
      .fail((res) => {
        handleShowNotification("error", res.responseText);
      });
    return () => (isSubscribed = false);
  }, [orderId]);

  const handleToggleView = () => {
    setShowReport(!showReport);
  };

  return (
    <Box sx={{ height: "85vh", p: 2 }}>
      <Grid container spacing={2} height={"100%"}>
        <Grid item container md={showReport ? 6 : 12}>
          <Card sx={{ width: "100%" }}>
            <CardHeader
              title={
                <Typography sx={{ fontWeight: 600, fontSize: 25 }}>
                  {data.clientName}
                </Typography>
              }
              subheader={
                <Typography variant="subtitle1">
                  {new Date(data.createdOn).toLocaleDateString()}
                </Typography>
              }
              action={
                showNotification ? (
                  <Alert
                    variant="outlined"
                    severity={notificationMessage.severity}
                  >
                    {notificationMessage.message}
                  </Alert>
                ) : (
                  <Button
                    onClick={handleToggleView}
                    variant={showReport ? "contained" : "text"}
                    sx={{ display: { xs: "none", md: "flex" } }}
                  >
                    {showReport ? "Cerrar reporte" : "Generar reporte"}
                  </Button>
                )
              }
            />

            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 550 }}>
                Referencias adquiridas
              </Typography>

              <Box sx={{ height: "50vh", width: "100%", p: "16px 0" }}>
                <DataGrid
                  autoPageSize
                  rows={rows}
                  heig
                  columns={columns}
                  disableColumnMenu
                />
              </Box>

              {/* <Divider /> */}

              <Grid container sx={{ pt: 2 }}>
                <Grid container alignItems={"center"}>
                  <Typography variant="body1">{`Peso total: ${data.shipmentWeight} Kg`}</Typography>
                </Grid>
                <Grid container alignItems={"center"}>
                  <Typography variant="body1">{`Número de cajas: ${data.nuberOfBoxes}`}</Typography>
                </Grid>
                <Grid container alignItems={"center"}>
                  <Typography variant="body1">{`Material faltante: ${data.missingMaterial} Kg`}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {showReport ? (
          <Grid item sm={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ height: "100%" }}>
                <PDFViewer width={"100%"} height={"100%"}>
                  <Document>
                    <Page size="A4" style={styles.body}>
                      <View style={styles.headers}>
                        <Text style={styles.title}>{data.clientName}</Text>
                        <Text style={styles.date}>
                          {new Date(data.createdOn).toLocaleDateString()}
                        </Text>
                      </View>

                      <View style={styles.table}>
                        <View style={styles.tableRow}>
                          <View style={styles.refTableCol}>
                            <Text style={styles.tableCell}>Referencia</Text>
                          </View>
                          <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Cantidad</Text>
                          </View>
                          <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>
                              Cantidad faltante
                            </Text>
                          </View>
                        </View>
                        {data.references.map((reference, index) => (
                          <View key={reference.id} style={styles.tableRow}>
                            <View style={styles.refTableCol}>
                              <Text style={styles.tableCell}>
                                {reference.referenceName}
                              </Text>
                            </View>
                            <View style={styles.tableCol}>
                              <Text style={styles.tableCell}>
                                {reference.quantity}
                              </Text>
                            </View>{" "}
                            <View style={styles.tableCol}>
                              <Text style={styles.tableCell}>
                                {reference.missingQuantity}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>

                      {/* {data.references.map((reference, index) => (
                        <View key={reference.id} style={styles.section}>
                          <Text style={styles.diagnostic}>
                            {reference.referenceName}
                          </Text>
                          <View style={styles.images}>
                            <Text
                              style={styles.diagnostic}
                            >{`Cantidad: ${reference.quantity}`}</Text>
                            <Text
                              style={styles.diagnostic}
                            >{`Faltante: ${reference.missingQuantity}`}</Text>
                          </View>
                        </View>
                      ))} */}

                      {/*  <View style={styles.divider}></View> */}
                      <Text
                        style={styles.diagnostic}
                      >{`Peso total: ${data.shipmentWeight}`}</Text>
                      <Text
                        style={styles.diagnostic}
                      >{`Número de cajas: ${data.nuberOfBoxes}`}</Text>
                      <Text
                        style={styles.diagnostic}
                      >{`Material faltante: ${data.missingMaterial}`}</Text>
                    </Page>
                  </Document>
                </PDFViewer>
              </CardContent>
            </Card>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}

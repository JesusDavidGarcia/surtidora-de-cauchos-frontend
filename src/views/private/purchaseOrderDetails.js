import React, { useState, useEffect } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import $ from "jquery";
import mainURL from "../../config/environment";

import { useNavigate, useParams } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import { Download, Edit } from "@mui/icons-material";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PurchaseOrderDocument from "../../components/docs/purchaseOrder";
import { useWidth } from "../../utils/withSelector";

const emptyModel = {
  id: "",
  clientId: "",
  clientName: "",
  createdOn: "",
  shipmentWeight: 0,
  invoicePrice: 0,
  numberOfBoxes: 0,
  missingMaterial: 0,
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
      headerName: "Referencia",
      field: "referenceName",
      flex: 1,
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Cantidad",
      field: "quantity",
      headerAlign: "center",
      align: "center",
      flex: 1,
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Cantidad faltante",
      field: "missingQuantity",
      headerAlign: "center",
      align: "center",
      flex: 1,
      breakpoints: ["md", "lg", "xl"],
    },
  ];

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
        const aux: GridRowsProp = res.references.map((ref, idx) => ({
          ...ref,
          id: idx,
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
  }, [orderId]);

  const handleToggleView = () => {
    navigate(`/ordenes-compra/${orderId}/editar`);
  };

  return (
    <Box sx={{ height: "85vh", p: 2 }}>
      <Grid container spacing={2} height={"100%"}>
        <Grid item container xs={12}>
          <Card sx={{ width: "100%" }}>
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
                </React.Fragment>
              }
              action={
                <Grid container>
                  <IconButton onClick={handleToggleView}>
                    <Edit color="primary" />
                  </IconButton>
                  <PDFDownloadLink
                    document={<PurchaseOrderDocument data={data} />}
                    fileName={`Orden de compra ${data.orderNumber}.pdf`}
                  >
                    <IconButton>
                      <Download color="primary" />
                    </IconButton>
                  </PDFDownloadLink>
                </Grid>
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
                  columns={columns.filter((m) =>
                    m.breakpoints.includes(breakpoint)
                  )}
                  disableColumnMenu
                />
              </Box>

              {/* <Divider /> */}

              <Grid container sx={{ pt: 2 }}>
                <Grid container alignItems={"center"}>
                  <Typography variant="body1">{`Peso total: ${data.shipmentWeight} Kg`}</Typography>
                </Grid>
                <Grid container alignItems={"center"}>
                  <Typography variant="body1">{`Número de cajas: ${data.numberOfBoxes}`}</Typography>
                </Grid>
                <Grid container alignItems={"center"}>
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

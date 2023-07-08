import React, { useState, useEffect } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import $ from "jquery";
import mainURL from "../../config/environment";

import { useNavigate, useParams } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import { Edit } from "@mui/icons-material";

import PdfReport from "../../components/pdfReport";

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

export default function PurchaseOrderDetails(props) {
  const [data, setData] = useState(emptyModel);
  const [rows, setRows] = useState([]);
  const { orderId } = useParams();

  const navigate = useNavigate();

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
        console.log(aux);
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
        <Grid item container xs={12} md={6}>
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
                <Button onClick={handleToggleView}>
                  <Edit />
                </Button>
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
        <Grid item sx={{ display: { xs: "none", md: "block" } }} sm={6}>
          <PdfReport data={data} />
        </Grid>
      </Grid>
    </Box>
  );
}

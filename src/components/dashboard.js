import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import InventoryIcon from "@mui/icons-material/Inventory";
import ArticleIcon from "@mui/icons-material/Article";

import KPICard from "./cards/kpi";
import PieChart from "./charts/pieChart";
import LineChart from "./charts/lineChart";

import mainURL from "../config/environment";
import $ from "jquery";
import PurchaseOrderReportDialog from "./dialogs/purchaseOrderReport";
import MaterialStatusDialog from "./dialogs/materialStatus";

const emptyData = {
  referenceUnits: 0,
  rawMaterial: 0,
};

export default function Dashboard() {
  const [data, setData] = useState(emptyData);

  //Dialog management
  const [reportDialog, setReportDialog] = useState(false);
  const [materialDialog, setMaterialDialog] = useState(false);

  const handleCloseDialogs = () => {
    setReportDialog(false);
    setMaterialDialog(false);
  };

  const handleOpenDialog = (card) => (event) => {
    console.log(card, event);
    switch (card) {
      case "material":
        setMaterialDialog(true);
        break;

      default:
        break;
    }
  };

  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;

    $.ajax({
      method: "GET",
      url: mainURL + "dashboard/main",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        if (isSubscribed) {
          setData(res);
        }
      })
      .fail((res) => {});
    return () => (isSubscribed = false);
  }, []);

  return (
    <Box component="main">
      <PurchaseOrderReportDialog
        open={reportDialog}
        handleClose={handleCloseDialogs}
      />
      <MaterialStatusDialog
        open={materialDialog}
        handleClose={handleCloseDialogs}
      />
      <Grid container sx={{ mt: 2, mb: 2 }}>
        <Grid item xs={10} md={6}>
          <Typography
            variant="h5"
            color="textSecondary"
            sx={{ fontWeight: 800 }}
          >
            {"Surtidora de cauchos"}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{ display: { xs: "none", md: "flex" } }}
          md={6}
          container
          justifyContent={"flex-end"}
        >
          <Button variant="outlined" onClick={() => setReportDialog(true)}>
            Generar reporte
          </Button>
        </Grid>
        <Grid
          item
          sx={{ display: { xs: "flex", md: "none" } }}
          xs={2}
          container
          justifyContent={"flex-end"}
        >
          <IconButton variant="outlined" onClick={() => setReportDialog(true)}>
            <Tooltip title="Generar reporte">
              <ArticleIcon />
            </Tooltip>
          </IconButton>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {[
          {
            id: "material",
            text: "Material disponible",
            value: `${numberWithCommas(data.rawMaterial)} Kg`,
            icon: ViewAgendaIcon,
          },
          {
            id: "references",
            text: "Unidades disponibles",
            value: numberWithCommas(data.referenceUnits),
            icon: InventoryIcon,
          },
        ].map((kpi) => (
          <Grid item key={kpi.id} xs={12} md={6}>
            <KPICard
              Icon={kpi.icon}
              text={kpi.text}
              value={kpi.value}
              handleClick={handleOpenDialog(kpi.id)}
            />
          </Grid>
        ))}
        <Grid item xs={12} md={8}>
          <LineChart
            endpoint={"dashboard/production-over-time"}
            title={"Producción mensual"}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <PieChart
            endpoint={"dashboard/material-distribution"}
            title={"Distribución de materia prima"}
            format={"Kg"}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

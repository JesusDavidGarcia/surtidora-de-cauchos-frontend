import React, { useState, useEffect } from "react";

//MUI
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { DataGrid } from "@mui/x-data-grid";

//Icons

import SearchAndCreate from "../../components/input/searchAndCreate";

import mainURL from "../../config/environment";
import $ from "jquery";
import { useWidth } from "../../utils/withSelector";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { Button, Tooltip } from "@mui/material";
import { Download } from "@mui/icons-material";
import PackagingStateDocument from "../../components/docs/packagingState";

const emptyData = {
  id: "",
  rubberReferenceId: "",
  referenceName: "",
  operator: "",
  produced: 0,
  wasted: 0,
};

export default function PackagingMatrix(props) {
  //Data management
  const [selectedData, setSelectedData] = useState(emptyData);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [data, setData] = useState([]);
  const breakpoint = useWidth();

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
    }, 3000);
  };

  //Search management
  const [searchText, setSearchText] = useState("");
  const handleSearch = (event) => {
    const target = event.target;
    const value = target.value;
    setSearchText(value);
  };

  const handleSelect = (data) => {
    if (data.row !== selectedData) setSelectedData(data.row);
    else setSelectedData(emptyData);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    //handleShowNotification("info", "Cargando clientes");
    //setLoading(true);
    $.ajax({
      method: "GET",
      url: mainURL + "packaging-reference/get-all",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        const filtered = res;
        const packaging = [
          ...new Set(filtered.map((item) => item.packagingName)),
        ];
        const references = [
          ...new Set(filtered.map((item) => item.referenceName)),
        ];
        const combination = [
          ...new Set(
            filtered.map((item, idx) => ({
              id: idx,
              [item.packagingName]: item.quantity,
              Referencia: item.referenceName,
            }))
          ),
        ];

        const columns = packaging.map((item) => ({
          headerName: item,
          field: item,
          flex: 1,
          breakpoints: ["xs", "sm", "md", "lg", "xl"],
        }));

        columns.unshift({
          headerName: "Referencia",
          field: "Referencia",
          flex: 1,
          breakpoints: ["xs", "sm", "md", "lg", "xl"],
        });

        const rows = [];

        references.forEach((ref) => {
          rows.push(
            combination
              .filter((m) => m.Referencia === ref)
              .reduce((r, c) => Object.assign(r, c), {})
          );
        });

        if (isSubscribed) {
          setColumns(columns);
          setData(rows);
          setFilteredData(rows);
          //setLoading(false);
        }
      })
      .fail((res) => {
        handleShowNotification("error", res.responseText);
      });
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    const myReg = new RegExp("^.*" + searchText.toLowerCase() + ".*");
    const newArray = data.filter((f) =>
      f.Referencia.toLowerCase().match(myReg)
    );
    setFilteredData(newArray);
  }, [data, searchText]);

  return (
    <Box sx={{ height: "85vh", p: 2 }}>
      <Grid
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ p: "1rem 0" }}
        spacing={2}
        container
      >
        <Grid item xs={12} md={8}>
          <Typography variant={"h4"}>{"Estado actual de empacado"}</Typography>
        </Grid>

        {showNotification ? (
          <Grid item xs={12} md={4}>
            <Alert variant="outlined" severity={notificationMessage.severity}>
              {notificationMessage.message}
            </Alert>
          </Grid>
        ) : (
          <SearchAndCreate
            title="Buscar por referencia"
            handleOpenDialog={() => null}
            handleSearch={handleSearch}
            showDownloadReportOption
            searchText={searchText}
            permission={10}
          >
            <PDFDownloadLink
              document={
                <PackagingStateDocument
                  title="Reporte de empacado"
                  data={data}
                  columns={columns}
                />
              }
              fileName={`Reporte de empacado ${
                new Date().toISOString().split("T")[0]
              }.pdf`}
            >
              <Tooltip title="Descargar reporte">
                <Button variant="outlined">
                  <Download color="primary" />
                </Button>
              </Tooltip>
            </PDFDownloadLink>
          </SearchAndCreate>
        )}
      </Grid>

      <Box sx={{ height: "70vh", width: "100%", p: "16px 0" }}>
        <DataGrid
          selectionModel={selectedData.id === "" ? [] : selectedData.id}
          onRowClick={handleSelect}
          rows={filteredData}
          columns={columns.filter((m) => m.breakpoints.includes(breakpoint))}
          disableColumnMenu
          autoPageSize
        />
      </Box>
    </Box>
  );
}

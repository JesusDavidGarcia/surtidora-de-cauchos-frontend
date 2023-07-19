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

const emptyData = {
  id: "",
  rubberReferenceId: "",
  referenceName: "",
  operator: "",
  produced: 0,
  wasted: 0,
};

export default function SharpenersMatrix(props) {
  //Data management
  const [selectedData, setSelectedData] = useState(emptyData);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [data, setData] = useState([]);
  const breakpoint = useWidth();

  //const navigate = useNavigate();
  /* const columns: GridColDef[] = [
    {
      headerName: "Referencia",
      field: "referenceName",
      flex: 1,
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Operario",
      field: "sharpener",
      flex: 1,
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Cantidad",
      field: "quantity",
      flex: 1,
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Fecha de refilado",
      field: "sharpeningDate",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {new Date(params.row.sharpeningDate).toLocaleDateString()}
        </Typography>
      ),
      breakpoints: ["sm", "md", "lg", "xl"],
    },
    {
      headerName: "Opciones",
      field: "id",
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={handlePopoverOpen(params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
      //flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      editable: false,
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
  ]; */

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

  //Popover management
  //const [anchor, setAnchor] = useState(null);
  /*  const handlePopoverOpen = (selected) => (event) => {
    event.stopPropagation();
    setAnchor(event.currentTarget);
    setSelectedData(selected);
  }; */

  //Search management
  const [searchText, setSearchText] = useState("");
  const handleSearch = (event) => {
    const target = event.target;
    const value = target.value;
    setSearchText(value);
  };

  /*  const handlePopoverClose = () => {
    setAnchor(null);
  }; */

  const handleSelect = (data) => {
    if (data.row !== selectedData) setSelectedData(data.row);
    else setSelectedData(emptyData);
  };

  /* const showDetails = () => {
    navigate(`/clientes/${selectedData.id}`);
  }; */

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    //handleShowNotification("info", "Cargando clientes");
    $.ajax({
      method: "GET",
      url: mainURL + "operator-sharpening/get-all",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        //const auxRows: GridRowsProp = res;
        //const auxColumns: Col
        const categories = [...new Set(res.map((item) => item.sharpener))];
        const columns = categories.map((item) => ({
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

        const rows = res.map((m) => ({
          id: m.id,
          Referencia: m.referenceName,
          [m.sharpener]: m.quantity,
        }));
        console.log(columns, rows);
        if (isSubscribed) {
          setColumns(columns);
          setData(rows);
          setFilteredData(rows);
          //setData(aux);
          //setFilteredData(aux);
          //handleShowNotification("success", "Referencias cargados con éxito");
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
          <Typography variant={"h4"}>{"Estado actual de refilado"}</Typography>
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
            searchText={searchText}
            permission={10}
          />
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

import React, { useState, useEffect } from "react";

//MUI
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { DataGrid } from "@mui/x-data-grid";

//import { useNavigate } from "react-router-dom";

//Icons
import MoreVertIcon from "@mui/icons-material/MoreVert";

import CreateEntryDialog from "../../components/dialogs/createRawMaterialEntry";
import DeleteEntryDialog from "../../components/dialogs/deleteGeneric";

import SearchAndCreate from "../../components/input/searchAndCreate";
import ClientPopover from "../../components/popovers/generic";

import mainURL from "../../config/environment";
import $ from "jquery";
import { useWidth } from "../../utils/withSelector";

const emptyData = {
  id: "",
  rawMaterialName: "",
  weight: 0,
  createdOn: "",
  providerId: "",
  providerName: "",
};

const errorMessage =
  "No se puede borrar este cliente porque hay obras registradas a su nombre";

export default function RawMaterialEntries(props) {
  //Data management
  const [selectedData, setSelectedData] = useState(emptyData);
  const [filteredData, setFilteredData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [data, setData] = useState([]);

  //const navigate = useNavigate();
  const breakpoint = useWidth();
  const columns: GridColDef[] = [
    {
      headerName: "Material",
      field: "rawMaterialName",
      flex: 1,
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Proveedor",
      field: "providerName",
      flex: 1,
      breakpoints: ["md", "lg", "xl"],
    },
    {
      headerName: "Cantidad",
      field: "weight",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {`${params.row.weight} Kg`}
        </Typography>
      ),
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Fecha de ingreso",
      field: "createdOn",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {new Date(params.row.createdOn).toLocaleDateString()}
        </Typography>
      ),
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Fecha de vencimiento",
      field: "expirationDate",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {new Date(params.row.expirationDate).toLocaleDateString()}
        </Typography>
      ),
      breakpoints: ["md", "lg", "xl"],
    },
    {
      headerName: "Factura",
      field: "invoiceNumber",
      flex: 1,
      breakpoints: ["md", "lg", "xl"],
    },
    {
      headerName: "Valor",
      field: "invoiceValue",
      flex: 1,
      breakpoints: ["md", "lg", "xl"],
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
  ];

  //Dialog management
  //const [renameDialog, setRenameDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const handleCloseDialogs = () => {
    //setRenameDialog(false);
    setDeleteDialog(false);
    setCreateDialog(false);
  };

  const handleOpenDialog = (dialog) => (event) => {
    switch (dialog) {
      case "create":
        setCreateDialog(true);
        break;

      case "delete":
        setDeleteDialog(true);
        break;

      /* case "rename":
        setRenameDialog(true);
        break; */

      default:
        console.log("None");
        break;
    }
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
    }, 3000);
  };

  //Popover management
  const [anchor, setAnchor] = useState(null);
  const handlePopoverOpen = (selected) => (event) => {
    event.stopPropagation();
    setAnchor(event.currentTarget);
    setSelectedData(selected);
  };

  //Search management
  const [searchText, setSearchText] = useState("");
  const handleSearch = (event) => {
    const target = event.target;
    const value = target.value;
    setSearchText(value);
  };

  const handlePopoverClose = () => {
    setAnchor(null);
  };

  const handleSelect = (data) => {
    if (data.row !== selectedData) setSelectedData(data.row);
    else setSelectedData(emptyData);
  };

  /*   const showDetails = () => {
    navigate(`/clientes/${selectedData.id}`);
  }; */

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    //handleShowNotification("info", "Cargando clientes");
    $.ajax({
      method: "GET",
      url: mainURL + "raw-material-entry-order/get-all",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        const aux: GridRowsProp = res;
        if (isSubscribed) {
          setData(aux);
          setFilteredData(aux);
          //handleShowNotification("success", "Referencias cargados con éxito");
        }
      })
      .fail((res) => {
        handleShowNotification("error", res.responseText);
      });
    return () => (isSubscribed = false);
  }, [refresh]);

  useEffect(() => {
    const myReg = new RegExp("^.*" + searchText.toLowerCase() + ".*");
    const newArray = data.filter((f) =>
      f.invoiceNumber.toLowerCase().match(myReg)
    );
    setFilteredData(newArray);
  }, [data, searchText]);

  return (
    <Box sx={{ height: "85vh", p: 2 }}>
      <ClientPopover
        open={anchor}
        showDeleteOption
        handleClose={handlePopoverClose}
        setDeleteDialog={setDeleteDialog}
      />
      <DeleteEntryDialog
        refresh={refresh}
        open={deleteDialog}
        setRefresh={setRefresh}
        title={"Eliminar ingreso"}
        errorMessage={errorMessage}
        name={selectedData.rawMaterialName}
        handleClose={handleCloseDialogs}
        deleteURL={`raw-material-entry-order/${selectedData.id}`}
        successMessage={"Entrada eliminada con éxito"}
        handleShowNotification={handleShowNotification}
      />

      <CreateEntryDialog
        refresh={refresh}
        open={createDialog}
        setRefresh={setRefresh}
        handleClose={handleCloseDialogs}
        handleShowNotification={handleShowNotification}
      />
      <Grid
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ p: "1rem 0" }}
        spacing={2}
        container
      >
        <Grid item xs={12} md={8}>
          <Typography variant={"h4"}>{"Materia prima"}</Typography>
        </Grid>

        {showNotification ? (
          <Grid item xs={12} md={4}>
            <Alert variant="outlined" severity={notificationMessage.severity}>
              {notificationMessage.message}
            </Alert>
          </Grid>
        ) : (
          <SearchAndCreate
            title="Buscar por factura"
            handleOpenDialog={handleOpenDialog}
            handleSearch={handleSearch}
            searchText={searchText}
            permission={10}
          />
        )}
      </Grid>

      <Grid container height={"70vh"} sx={{ pb: 5 }}>
        <DataGrid
          selectionModel={selectedData.id === "" ? [] : selectedData.id}
          onRowClick={handleSelect}
          rows={filteredData}
          columns={columns.filter((m) => m.breakpoints.includes(breakpoint))}
          disableColumnMenu
        />
      </Grid>
    </Box>
  );
}

import React, { useState, useEffect } from "react";

//MUI
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { DataGrid } from "@mui/x-data-grid";

//Icons

import MoreVertIcon from "@mui/icons-material/MoreVert";

import UpdatePackagingDialog from "../../components/dialogs/updatePackaging";
import DeleteOperatorDialog from "../../components/dialogs/deleteGeneric";
import CreatePackaging from "../../components/dialogs/createPackaging";
import SearchAndCreate from "../../components/input/searchAndCreate";
import OptionsPopover from "../../components/popovers/generic";

import mainURL from "../../config/environment";
import $ from "jquery";

const emptyData = {
  id: "",
  name: "",
  email: "",
  phoneNumber: "",
  accessToken: "",
};

const errorMessage =
  "No se puede borrar este cliente porque existen órdenes de compra asociadas a él";

export default function Packaging(props) {
  //Data management
  const [selectedData, setSelectedData] = useState(emptyData);
  const [filteredData, setFilteredData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [data, setData] = useState([]);

  const columns: GridColDef[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
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
    },
  ];

  //Dialog management
  const [updateDialog, setUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const handleCloseDialogs = () => {
    setUpdateDialog(false);
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

      case "update":
        setUpdateDialog(true);
        break;

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

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    //handleShowNotification("info", "Cargando operarios");
    $.ajax({
      method: "GET",
      url: mainURL + "packaging/get-all",
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
          //handleShowNotification("success", "Clientes cargados con éxito");
        }
      })
      .fail((res) => {
        handleShowNotification("error", res.responseText);
      });
    return () => (isSubscribed = false);
  }, [refresh]);

  useEffect(() => {
    const myReg = new RegExp("^.*" + searchText.toLowerCase() + ".*");
    const newArray = data.filter((f) => f.name.toLowerCase().match(myReg));
    setFilteredData(newArray);
  }, [data, searchText]);

  return (
    <Box sx={{ height: "85vh", p: 2 }}>
      <OptionsPopover
        open={anchor}
        showDeleteOption
        showUpdateOption
        handleClose={handlePopoverClose}
        setDeleteDialog={setDeleteDialog}
        setUpdateDialog={setUpdateDialog}
      />
      <DeleteOperatorDialog
        refresh={refresh}
        open={deleteDialog}
        setRefresh={setRefresh}
        title={"Eliminar empaque"}
        errorMessage={errorMessage}
        name={selectedData.name}
        handleClose={handleCloseDialogs}
        deleteURL={`packaging/${selectedData.id}`}
        handleShowNotification={handleShowNotification}
      />
      <UpdatePackagingDialog
        refresh={refresh}
        open={updateDialog}
        setRefresh={setRefresh}
        packagingId={selectedData.id}
        handleClose={handleCloseDialogs}
        handleShowNotification={handleShowNotification}
      />
      <CreatePackaging
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
        <Grid item md={8}>
          <Typography variant="h4">{"Empaques"}</Typography>
        </Grid>

        {showNotification ? (
          <Grid item xs={12} md={4}>
            <Alert variant="outlined" severity={notificationMessage.severity}>
              {notificationMessage.message}
            </Alert>
          </Grid>
        ) : (
          <SearchAndCreate
            handleOpenDialog={handleOpenDialog}
            handleSearch={handleSearch}
            searchText={searchText}
            permission={10}
          />
        )}
      </Grid>

      <Box sx={{ height: "70vh", width: "100%", p: "16px 0", pb:8 }}>
        <DataGrid
          selectionModel={selectedData.id === "" ? [] : selectedData.id}
          onRowClick={handleSelect}
          rows={filteredData}
          columns={columns}
          disableColumnMenu
          autoPageSize
        />
      </Box>
    </Box>
  );
}

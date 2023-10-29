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

import CreateReferenceDialog from "../../components/dialogs/createReference";
import ReferenceDetails from "../../components/dialogs/referenceDetails";
import DeleteClientDialog from "../../components/dialogs/deleteGeneric";
import SearchAndCreate from "../../components/input/searchAndCreate";
import ReferencePopover from "../../components/popovers/generic";

import mainURL from "../../config/environment";
import $ from "jquery";
import UpdateReferenceDialog from "../../components/dialogs/updateReference";
import { useWidth } from "../../utils/withSelector";

const emptyData = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  reference: "",
  application: "",
  rawWeight: null,
  packedWeight: null,
  currentQuantity: null,
  minimum: null,
  maximum: null,
  rawMaterialId: null,
  rawMaterialName: "",
};

const errorMessage =
  "No se puede borrar esta referencia porque hay ordenes de compra asociadas a a esta referencia";

export default function References(props) {
  //Data management
  const [selectedData, setSelectedData] = useState(emptyData);
  const [filteredData, setFilteredData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [data, setData] = useState([]);

  //const navigate = useNavigate();
  const breakpoint = useWidth();
  const columns: GridColDef[] = [
    {
      headerName: "Referencia",
      field: "reference",
      flex: 1,
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Aplicación",
      field: "application",
      flex: 1,
      breakpoints: ["sm", "md", "lg", "xl"],
    },
    {
      headerName: "Material",
      field: "rawMaterialName",
      flex: 1,
      breakpoints: ["sm", "md", "lg", "xl"],
    },
    {
      headerName: "Cantidad actual",
      field: "currentQuantity",
      flex: 1,
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Consumo de materia prima (gr)",
      field: "rawWeight",
      flex: 1,
      breakpoints: ["md", "lg", "xl"],
    },
    {
      headerName: "Peso embalaje x10 (Kg)",
      field: "packedWeight",
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
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const handleCloseDialogs = () => {
    setDetailsDialog(false);
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

      case "details":
        setDetailsDialog(true);
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

  /* const showDetails = () => {
    navigate(`/clientes/${selectedData.id}`);
  }; */

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    //handleShowNotification("info", "Cargando clientes");
    $.ajax({
      method: "GET",
      url: mainURL + "rubber-reference/get-all",
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
      `${f.reference} ${f.application}`.toLowerCase().match(myReg)
    );
    setFilteredData(newArray);
  }, [data, searchText]);

  return (
    <Box sx={{ height: "85vh", p: 2 }}>
      <ReferencePopover
        open={anchor}
        showUpdateOption
        showDeleteOption
        showDetailsOption
        handleClose={handlePopoverClose}
        setDeleteDialog={setDeleteDialog}
        setUpdateDialog={setUpdateDialog}
        setDetailsDialog={setDetailsDialog}
      />
      <ReferenceDetails
        refresh={refresh}
        open={detailsDialog}
        setRefresh={setRefresh}
        referenceId={selectedData.id}
        handleClose={handleCloseDialogs}
      />
      <DeleteClientDialog
        refresh={refresh}
        open={deleteDialog}
        setRefresh={setRefresh}
        title={"Eliminar referencia"}
        errorMessage={errorMessage}
        name={selectedData.reference}
        handleClose={handleCloseDialogs}
        deleteURL={`rubber-reference/${selectedData.id}`}
        handleShowNotification={handleShowNotification}
      />
      <UpdateReferenceDialog
        refresh={refresh}
        open={updateDialog}
        setRefresh={setRefresh}
        referenceId={selectedData.id}
        handleClose={handleCloseDialogs}
        handleShowNotification={handleShowNotification}
      />
      <CreateReferenceDialog
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
          <Typography variant="h4">{"Referencias"}</Typography>
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
            handleOpenDialog={handleOpenDialog}
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

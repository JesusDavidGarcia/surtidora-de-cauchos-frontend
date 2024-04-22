import React, { useState, useEffect } from "react";

//MUI
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { DataGrid } from "@mui/x-data-grid";

import { useNavigate } from "react-router-dom";

//Icons
import MoreVertIcon from "@mui/icons-material/MoreVert";

import DeleteRemissionDialog from "../../components/dialogs/deleteGeneric";
import SearchAndCreate from "../../components/input/searchAndCreate";
import PurchaseOrderPopover from "../../components/popovers/generic";

import mainURL from "../../config/environment";
import $ from "jquery";
import { useWidth } from "../../utils/withSelector";

const emptyData = {
  id: "",
  clientId: "",
  clientName: "",
  createdOn: "",
  shipmentWeight: 0,
  invoicePrice: 0,
  numberOfBoxes: 0,
  references: [],
};

const errorMessage =
  "No se puede borrar esta remisión porque hay alquileres que dependen en ella";
export default function PurchaseOrders(props) {
  //Data management
  const [selectedData, setSelectedData] = useState(emptyData);
  const [filteredData, setFilteredData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);

  //Navigation
  const navigate = useNavigate();

  const breakpoint = useWidth();

  const columns: GridColDef[] = [
    {
      headerName: "Número",
      field: "orderNumber",
      //flex: 1,
      //align: "center",
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Cliente",
      field: "clientName",
      flex: 1,
      breakpoints: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      headerName: "Fecha de creación",
      field: "createdOn",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {new Date(params.row.createdOn).toLocaleDateString()}
        </Typography>
      ),
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
  const [deleteDialog, setDeleteDialog] = useState(false);
  const handleCloseDialogs = () => {
    setDeleteDialog(false);
  };

  const handleOpenDialog = (dialog) => (event) => {
    switch (dialog) {
      case "create":
        navigate("crear");
        break;

      case "delete":
        setDeleteDialog(true);
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

  //Search management
  const [searchText, setSearchText] = useState("");
  const handleSearch = (event) => {
    const target = event.target;
    const value = target.value;
    setSearchText(value);
  };

  const handleShowNotification = (severity, message) => {
    setNotificationMessage({ severity: severity, message: message });
    setShowNotification(true);
    setTimeout(function () {
      setShowNotification(false);
    }, 2000);
  };

  //Popover management
  const [anchor, setAnchor] = useState(null);
  const handlePopoverOpen = (selected) => (event) => {
    event.stopPropagation();
    setAnchor(event.currentTarget);
    setSelectedData(selected);
  };

  const handlePopoverClose = () => {
    setAnchor(null);
  };

  const handleSelect = (data) => {
    if (data.row !== selectedData)
      navigate(`/ordenes-compra/${data.id}`); //setSelectedData(data.row);
    else setSelectedData(emptyData);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    //handleShowNotification("info", "Cargando ordenes de compra");
    $.ajax({
      method: "GET",
      url: mainURL + "purchase-order/get-all",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        const aux: GridRowsProp = res.sort(
          (a, b) => b.orderNumber - a.orderNumber
        );
        if (isSubscribed) {
          setData(aux);
          //handleShowNotification("success", "Ordenes cargadas con éxito");
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
      f.clientName.toLowerCase().match(myReg)
    );
    setFilteredData(newArray);
  }, [data, searchText]);

  return (
    <Box sx={{ height: "85vh", p: 2,  }}>
      <PurchaseOrderPopover
        open={anchor}
        showDeleteOption
        handleClose={handlePopoverClose}
        setDeleteDialog={setDeleteDialog}
      />
      <DeleteRemissionDialog
        refresh={refresh}
        open={deleteDialog}
        title={"Eliminar orden de compra"}
        setRefresh={setRefresh}
        name={selectedData.orderNumber}
        errorMesage={errorMessage}
        handleClose={handleCloseDialogs}
        deleteURL={`purchase-order/${selectedData.id}`}
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
          <Typography variant="h4">{"Ordenes de compra"}</Typography>
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
            title={"Buscar por cliente"}
            handleSearch={handleSearch}
            searchText={searchText}
            permission={26}
          />
        )}
      </Grid>
      <Box sx={{ height: "70vh", width: "100%", p: "16px 0", pb:8 }}>
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

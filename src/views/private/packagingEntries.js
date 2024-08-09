import React, { useState, useEffect } from 'react';

//MUI
//import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
//import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { DataGrid } from '@mui/x-data-grid';

// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { DatePicker } from "@mui/x-date-pickers";

//Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';

import UpdateEntryDialog from '../../components/dialogs/updatePackagingEntry';
import CreateEntryDialog from '../../components/dialogs/createPackagingEntry';
import DeleteEntryDialog from '../../components/dialogs/deleteGeneric';
import SearchAndCreate from '../../components/input/searchAndCreate';
import ProductionPopover from '../../components/popovers/generic';

import mainURL from '../../config/environment';
import $ from 'jquery';
import { useWidth } from '../../utils/widthSelector';
//import { PDFDownloadLink } from "@react-pdf/renderer";
//import SharpeningEntriesDocument from "../../components/docs/sharpeningEntries";
//import {  CircularProgress } from "@mui/material";
// import { Download, ImportExport } from "@mui/icons-material";
// import SelectOperator from "../../components/input/selectOperator";

const emptyData = {
  id: '',
  rubberReferenceId: '',
  referenceName: '',
  packagingId: '',
  packagingName: '',
  quantity: 0,
  packagingDate: '',
  createdOn: '',
};

const errorMessage = 'No se puede borrar este cliente porque hay obras registradas a su nombre';

// const emptyRange = {
//   start: new Date(Date.now()).setDate(1),
//   end: Date.now(),
// };

export default function PackagingEntries(props) {
  //Data management

  const [selectedData, setSelectedData] = useState(emptyData);
  //const [dateRange, setDateRange] = useState(emptyRange);
  //const [showFilters, setShowFilters] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  //const [exportData, setExportData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  //const [loading, setLoading] = useState(false);
  //const [sharpener, setSharpener] = useState(0);

  const [data, setData] = useState([]);
  const breakpoint = useWidth();

  //const navigate = useNavigate();
  const columns: GridColDef[] = [
    {
      headerName: 'Referencia',
      field: 'referenceName',
      flex: 1,
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Empaque',
      field: 'packagingName',
      flex: 1,
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Cantidad',
      field: 'quantity',
      flex: 1,
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Fecha de empacado',
      field: 'packagingDate',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {new Date(params.row.packagingDate).toLocaleDateString()}
        </Typography>
      ),
      breakpoints: ['sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Opciones',
      field: 'id',
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={handlePopoverOpen(params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
      //flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      editable: false,
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
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
      case 'create':
        setCreateDialog(true);
        break;

      case 'delete':
        setDeleteDialog(true);
        break;

      case 'update':
        setUpdateDialog(true);
        break;

      default:
        console.log('None');
        break;
    }
  };

  //Notification management
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({
    severity: '',
    message: '',
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
  const [searchText, setSearchText] = useState('');
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
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;

    $.ajax({
      method: 'GET',
      url: mainURL + 'packaging-entry/get-all',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .done((res) => {
        const aux: GridRowsProp = res.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

        if (isSubscribed) {
          setData(aux);
          setFilteredData(aux);
          //handleShowNotification("success", "Referencias cargados con éxito");
        }
      })
      .fail((res) => {
        handleShowNotification('error', res.responseText);
      });
    return () => (isSubscribed = false);
  }, [refresh]);

  /* useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    // const start = new Date(dateRange.start).toISOString().split("T")[0];
    // const end = new Date(dateRange.end).toISOString().split("T")[0];
    setLoading(true);
    $.ajax({
      method: "GET",
      url: `${mainURL}report/packaging?start=${start}&end=${end}${
        sharpener !== 0 ? `&sharpenerId=${sharpener}` : ""
      }`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        if (isSubscribed) {
          setExportData(res);
          setLoading(false);
        }
      })
      .fail((res) => {
        handleShowNotification("error", res.responseText);
      });
    return () => (isSubscribed = false);
  }, [refresh]); */

  useEffect(() => {
    const myReg = new RegExp('^.*' + searchText.toLowerCase() + '.*');
    const newArray = data.filter((f) => f.referenceName.toLowerCase().match(myReg));
    setFilteredData(newArray);
  }, [data, searchText]);

  return (
    <Box sx={{ height: '85vh', p: 2 }}>
      <ProductionPopover
        open={anchor}
        showDeleteOption
        showUpdateOption
        handleClose={handlePopoverClose}
        setDeleteDialog={setDeleteDialog}
        setUpdateDialog={setUpdateDialog}
      />
      <DeleteEntryDialog
        refresh={refresh}
        open={deleteDialog}
        setRefresh={setRefresh}
        title={'Eliminar registro'}
        errorMessage={errorMessage}
        name={`${selectedData.referenceName}`}
        handleClose={handleCloseDialogs}
        deleteURL={`packaging-entry/${selectedData.id}`}
        successMessage={'Registro eliminado con éxito'}
        handleShowNotification={handleShowNotification}
      />
      <UpdateEntryDialog
        refresh={refresh}
        open={updateDialog}
        setRefresh={setRefresh}
        entryId={selectedData.id}
        handleClose={handleCloseDialogs}
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
        justifyContent={'space-between'}
        alignItems={'center'}
        sx={{ p: '1rem 0' }}
        spacing={2}
        container
      >
        <Grid item xs={12} container>
          <Grid item xs={12} md={8}>
            <Typography variant={'h4'}>{'Ingresos a empacado'}</Typography>
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
              title="Buscar por referencia"
              handleSearch={handleSearch}
              searchText={searchText}
              permission={10}
            >
              {/* {loading ? <CircularProgress /> : null} */}
            </SearchAndCreate>
          )}
        </Grid>
        {/*  {showFilters ? (
          <Grid item xs={12} container columnSpacing={2}>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={"Fecha de inicio"}
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({
                        ...dateRange,
                        start: e,
                      })
                    }
                    format="dd/MM/yyyy"
                    textField={(params) => <TextField variant="standard" />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={"Fecha de finalización"}
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({
                        ...dateRange,
                        end: e,
                      })
                    }
                    format="dd/MM/yyyy"
                    textField={(params) => <TextField variant="standard" />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={4}>
              <SelectOperator
                handleChange={(e) => setSharpener(e.target.value)}
                value={sharpener}
                name="sharpener"
                area="Refilado"
              />
            </Grid>
            <Grid
              item
              xs={6}
              md={2}
              container
              justifyContent={"center"}
              alignItems={"center"}
            >
              <PDFDownloadLink
                document={<SharpeningEntriesDocument data={exportData} />}
                fileName={`Informe de empacado ${
                  new Date().toISOString().split("T")[0]
                }.pdf`}
              >
                <Tooltip title="Descargar reporte">
                  <Button
                    variant="outlined"
                    disabled={exportData.length === 0}
                    onClick={() => {
                      setSharpener(0);
                      setDateRange(emptyRange);
                    }}
                  >
                    <Download color="primary" />
                  </Button>
                </Tooltip>
              </PDFDownloadLink>
            </Grid>
          </Grid>
        ) : null} */}
      </Grid>

      <Box sx={{ height: '70vh', width: '100%', p: '16px 0', pb: 8 }}>
        <DataGrid
          selectionModel={selectedData.id === '' ? [] : selectedData.id}
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

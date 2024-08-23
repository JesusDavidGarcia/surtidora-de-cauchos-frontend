import React, { useState, useEffect } from 'react';

//MUI
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { DataGrid } from '@mui/x-data-grid';

//import { useNavigate } from "react-router-dom";

import SyncIcon from '@mui/icons-material/Sync';

//Icons

import mainURL from '../../config/environment';
import $ from 'jquery';
import { useWidth } from '../../utils/widthSelector';
import SearchAndCreate from '../input/searchAndCreate';
import { useNavigate } from 'react-router-dom';

import { BrowserUpdated, ExitToApp } from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProjectionDocument from '../docs/projectionDoc';

const emptyData = {
  id: '',
  rawMaterialName: '',
  weight: '',
  createdOn: '',
  providerId: '',
  providerName: '',
};

export default function ProjectionTable(props) {
  //Data management
  const [selectedData, setSelectedData] = useState(emptyData);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { endpoint, clientId } = props;
  //const [isSummarized, setSummarized] = useState(false);

  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [projectionDate, setProjectionDate] = useState(new Date());
  const [clientName, setClientName] = useState('');

  //const navigate = useNavigate();
  const breakpoint = useWidth();
  const columns: GridColDef[] = [
    {
      headerName: 'Referencia',
      field: 'reference',
      flex: 1,
      endpoints: ['get-all', 'get-summarized'],
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Aplicación',
      field: 'application',
      flex: 1,
      endpoints: ['get-all', 'get-summarized'],
      breakpoints: ['sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Cliente',
      field: 'clientName',
      flex: 1,
      endpoints: ['get-by-client'],
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Empaque',
      field: 'packagingName',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {params.row.packagingName ?? 'Sin empaque'}
        </Typography>
      ),
      endpoints: ['get-all', 'get-summarized'],
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Vendido en el último mes',
      field: 'last30DaysPurchased',
      flex: 1,
      endpoints: ['get-all', 'get-summarized', 'get-by-client'],
      breakpoints: ['lg', 'xl'],
    },
    {
      headerName: 'Cantidad actual',
      field: 'currentQuantity',
      flex: 1,
      endpoints: ['get-all', 'get-summarized', 'get-by-client'],
      breakpoints: ['lg', 'xl'],
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {params.row.currentQuantity.toFixed(2)}
        </Typography>
      ),
    },
    {
      headerName: 'Cantidad empacada actual',
      field: 'currentPackedQuantity',
      flex: 1,
      endpoints: ['get-all', 'get-summarized', 'get-by-client'],
      breakpoints: ['lg', 'xl'],
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {params.row.currentPackedQuantity.toFixed(2)}
        </Typography>
      ),
    },
    {
      headerName: 'Proyección a empacar',
      field: 'projectedPackagingQuantity',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {params.row.projectedPackagingQuantity.toFixed(2)}
        </Typography>
      ),
      endpoints: ['get-all', 'get-summarized', 'get-by-client'],
      breakpoints: ['md', 'lg', 'xl'],
    },
    {
      headerName: 'Proyección a producir',
      field: 'projectedProductionQuantity',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {params.row.projectedProductionQuantity.toFixed(2)}
        </Typography>
      ),
      endpoints: ['get-all', 'get-summarized', 'get-by-client'],
      breakpoints: ['md', 'lg', 'xl'],
    },
    {
      headerName: 'Proyección total',
      field: 'projectedQuantity',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography key={params.row.id} variant="body2">
          {params.row.projectedQuantity.toFixed(2)}
        </Typography>
      ),
      endpoints: ['get-all', 'get-summarized', 'get-by-client'],
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Ver',
      field: 'id',
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={() => navigate(params.row.clientId)}>
          <ExitToApp />
        </IconButton>
      ),
      //flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      editable: false,
      endpoints: ['get-by-client'],
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  ];

  //Search management
  const [searchText, setSearchText] = useState('');
  const handleSearch = (event) => {
    const target = event.target;
    const value = target.value;
    setSearchText(value);
  };

  const handleSelect = (data) => {
    if (data.row !== selectedData) setSelectedData(data.row);
    else setSelectedData(emptyData);
  };

  const handleOpenDialog = (dialog) => (event) => {};

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

  const handleSync = (event) => {
    event.preventDefault();
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    $.ajax({
      method: 'POST',
      url: `${mainURL}projection/calculate-projection`,
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .done((res) => {
        setRefresh(!refresh);
        handleShowNotification('success', 'Proyección calculada con éxito');
      })
      .fail((res) => {
        handleShowNotification('error', res.responseText);
      });
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;
    setLoading(true);
    $.ajax({
      method: 'GET',
      url: `${mainURL}projection/${endpoint}?clientId=${clientId}`,
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .done((res) => {
        const aux: GridRowsProp = res.map((x, idx) => ({ ...x, id: idx }));
        if (isSubscribed) {
          setData(aux);
          setFilteredData(aux);
          setProjectionDate(new Date(aux[0].projectionDate));
          setClientName(aux[0].clientName);
          setLoading(false);
        }
      })
      .fail((res) => {
        setLoading(false);
        handleShowNotification('error', res.responseText);
      });
    return () => (isSubscribed = false);
  }, [endpoint, refresh, clientId]);

  useEffect(() => {
    const myReg = new RegExp('^.*' + searchText.toLowerCase() + '.*');
    if (endpoint.includes('client')) {
      const newArray = data.filter((f) => f.clientName.toLowerCase().match(myReg));
      setFilteredData(newArray);
    } else {
      const newArray = data.filter((f) =>
        `${f.reference} ${f.application}`.toLowerCase().match(myReg),
      );
      setFilteredData(newArray);
    }
  }, [data, searchText, endpoint]);

  return (
    <Box sx={{ height: '70vh', pb: 20 }}>
      <Grid justifyContent={'space-between'} alignItems={'center'} container pb={1} rowSpacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">{`Proyección realizada el ${projectionDate.toLocaleDateString()}`}</Typography>
        </Grid>

        {showNotification ? (
          <Grid item xs={12} md={4}>
            <Alert variant="outlined" severity={notificationMessage.severity}>
              {notificationMessage.message}
            </Alert>
          </Grid>
        ) : (
          <SearchAndCreate
            title={endpoint.includes('client') ? 'Buscar por cliente' : 'Buscar por referencia'}
            handleOpenDialog={handleOpenDialog}
            handleSearch={handleSearch}
            showDownloadReportOption
            searchText={searchText}
          >
            <Tooltip title="Calcular proyección">
              <IconButton variant="contained" onClick={handleSync}>
                <SyncIcon color="primary" />
              </IconButton>
            </Tooltip>

            <PDFDownloadLink
              document={
                <ProjectionDocument
                  data={data}
                  clientName={clientName}
                  projectionDate={projectionDate}
                  showClient={clientId !== undefined}
                />
              }
              fileName={`Proyección ${clientName ?? 'general'}.pdf`}
            >
              <Tooltip title="Descargar proyección">
                <IconButton>
                  <BrowserUpdated color="primary" />
                </IconButton>
              </Tooltip>
            </PDFDownloadLink>
          </SearchAndCreate>
        )}
      </Grid>

      <DataGrid
        selectionModel={selectedData.id === '' ? [] : selectedData.id}
        onRowClick={handleSelect}
        rows={filteredData}
        loading={loading}
        columns={columns
          .filter((m) => m.breakpoints.includes(breakpoint))
          .filter((m) => m.endpoints.includes(endpoint))}
        disableColumnMenu
        autoPageSize
      />
      {/*  </Grid> */}
    </Box>
  );
}

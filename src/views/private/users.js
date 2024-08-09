import React, { useState, useEffect } from 'react';

//MUI
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { DataGrid } from '@mui/x-data-grid';

//Icons

import MoreVertIcon from '@mui/icons-material/MoreVert';

//Dialogs
import DeleteUserDialog from '../../components/dialogs/deleteGeneric';
import SearchAndCreate from '../../components/input/searchAndCreate';
import CreateUserDialog from '../../components/dialogs/createUser';
import UpdateUserDialog from '../../components/dialogs/updateUser';
import UserPopover from '../../components/popovers/generic';

import mainURL from '../../config/environment';
import $ from 'jquery';
import { useWidth } from '../../utils/widthSelector';

const emptyData = {
  id: 0,
  fullName: '',
  email: '',
  phoneNumber: '',
};

export default function Users(props) {
  //Data management
  const [selectedData, setSelectedData] = useState(emptyData);
  const [filteredData, setFilteredData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);

  const breakpoint = useWidth();

  const columns: GridColDef[] = [
    {
      headerName: 'Nombre',
      field: 'fullName',
      flex: 1,
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Email',
      field: 'email',
      flex: 1,
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      headerName: 'Teléfono',
      field: 'phoneNumber',
      flex: 1,
      breakpoints: ['md', 'lg', 'xl'],
    },
    {
      headerName: 'Opciones',
      field: 'id',
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={handlePopoverOpen(params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      editable: false,
      breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  ];

  //Dialog management
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const handleCloseDialogs = () => {
    setDeleteDialog(false);
    setCreateDialog(false);
    setUpdateDialog(false);
  };

  const handleOpenDialog = (dialog) => (event) => {
    switch (dialog) {
      case 'create':
        setCreateDialog(true);
        break;

      case 'delete':
        setDeleteDialog(true);
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

  //Search management
  const [searchText, setSearchText] = useState('');
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
    if (data.row !== selectedData) setSelectedData(data.row);
    else setSelectedData(emptyData);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;
    //handleShowNotification("info", "Cargando usuarios");
    $.ajax({
      method: 'GET',
      url: mainURL + 'user/get-all',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .done((res) => {
        res = res.filter((x) => x.id > 0);
        const aux: GridRowsProp = res;
        if (isSubscribed) {
          setData(aux);
          //handleShowNotification("success", "Usuarios cargados con éxito");
        }
      })
      .fail((res) => {
        handleShowNotification('error', res.responseText);
      });
    return () => (isSubscribed = false);
  }, [refresh]);

  useEffect(() => {
    const myReg = new RegExp('^.*' + searchText.toLowerCase() + '.*');
    const newArray = data.filter((f) => f.fullName.toLowerCase().match(myReg));
    setFilteredData(newArray);
  }, [data, searchText]);

  return (
    <Box sx={{ height: '85vh', p: 2 }}>
      <UserPopover
        open={anchor}
        showDeleteOption
        showUpdateOption
        handleClose={handlePopoverClose}
        setDeleteDialog={setDeleteDialog}
        setUpdateDialog={setUpdateDialog}
      />
      <CreateUserDialog
        refresh={refresh}
        open={createDialog}
        setRefresh={setRefresh}
        handleClose={handleCloseDialogs}
        handleShowNotification={handleShowNotification}
      />
      <UpdateUserDialog
        refresh={refresh}
        open={updateDialog}
        setRefresh={setRefresh}
        userId={selectedData.id}
        handleClose={handleCloseDialogs}
        handleShowNotification={handleShowNotification}
      />
      <DeleteUserDialog
        refresh={refresh}
        open={deleteDialog}
        setRefresh={setRefresh}
        name={selectedData.fullName}
        title={'Eliminar usuario'}
        handleClose={handleCloseDialogs}
        deleteURL={`user/${selectedData.id}`}
        handleShowNotification={handleShowNotification}
      />
      <Grid
        justifyContent={'space-between'}
        alignItems={'center'}
        sx={{ p: '1rem 0' }}
        spacing={2}
        container
      >
        <Grid item xs={12} md={8}>
          <Typography variant="h4">{'Usuarios'}</Typography>
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
            permission={2}
          />
        )}
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

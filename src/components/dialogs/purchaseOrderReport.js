import React, { useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

//MUI-LAB
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import $ from 'jquery';
import mainURL from '../../config/environment';
import SelectClient from '../input/selectClient';

const emptyModel = {
  clientId: '',
  from: Date.now(),
  to: Date.now(),
};

export default function PurchaseOrderReportDialog(props) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [model, setModel] = useState(emptyModel);

  const handleClientChange = (newClient) => {
    if (newClient !== null) {
      setModel({
        ...model,
        clientId: newClient.id,
        clientName: newClient.name,
      });
      setSelectedClient(newClient);
    } else {
      setModel(emptyModel);
      setSelectedClient(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;

    const from = new Date(model.from).toISOString().split('T')[0];
    const to = new Date(model.to).toISOString().split('T')[0];
    $.ajax({
      method: 'GET',
      url: `${mainURL}report/${model.clientId}/purchase-orders?from=${from}&to=${to}`,
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: JSON.stringify(model),
    })
      .done((dataRes) => {
        setLoading(false);
        //console.log(res);
        /*  const references = res.map((m) => ({
          aplicacion: m.aplicacion,
          cantidad: m.cantidadTotal,
        }));

        const result = Object.groupBy(
          references,
          ({ aplicacion }) => aplicacion
        ); */

        var result = [];
        dataRes.reduce(function (res, value) {
          if (!res[value.aplicacion]) {
            res[value.aplicacion] = {
              aplicacion: value.aplicacion,
              cantidadTotal: 0,
            };
            result.push(res[value.aplicacion]);
          }
          res[value.aplicacion].cantidadTotal += value.cantidadTotal;
          return res;
        }, {});

        if (dataRes.length > 0) {
          const fileName = `Reporte de órdenes de compra`;
          const fileType =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          const fileExtension = '.xlsx';
          const ws = XLSX.utils.json_to_sheet(dataRes);
          const refs = XLSX.utils.json_to_sheet(result);
          const wb = {
            Sheets: { 'Ordenes de compra': ws, Referencias: refs },
            SheetNames: ['Ordenes de compra', 'Referencias'],
          };
          const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array',
          });

          const data = new Blob([excelBuffer], { type: fileType });
          FileSaver.saveAs(data, fileName + fileExtension);
        } else {
          alert('No hay datos para los filtros seleccionados');
        }
      })
      .fail((res) => {
        setLoading(false);
        handleClear();
      });
  };

  const handleClear = () => {
    props.handleClose();
    setModel(emptyModel);
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose} maxWidth="md">
      <DialogTitle>{'Genear reporte de órdenes de compra'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SelectClient handleChange={handleClientChange} value={selectedClient} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={'Fecha inicial'}
                    value={model.from}
                    onChange={(e) => setModel({ ...model, from: e })}
                    format="dd/MM/yyyy"
                    renderInput={(params) => <TextField variant="standard" />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={'Fecha final'}
                    value={model.to}
                    onChange={(e) => setModel({ ...model, to: e })}
                    format="dd/MM/yyyy"
                    renderInput={(params) => <TextField variant="standard" />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <Grid container justifyContent={'center'}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container justifyContent={'flex-end'}>
            <Button type="submit" onClick={handleClear}>
              Cerrar
            </Button>
            <Button type="submit" disabled={model.clientId === ''} onClick={handleSubmit}>
              Generar
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
}

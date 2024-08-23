import React, { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArticleIcon from '@mui/icons-material/Article';

import KPICard from './cards/kpi';
import PieChart from './charts/pieChart';
import LineChart from './charts/lineChart';

import mainURL from '../config/environment';
import $ from 'jquery';
import PurchaseOrderReportDialog from './dialogs/purchaseOrderReport';
import MaterialStatusDialog from './dialogs/materialStatus';
import ProjectionTable from './charts/projectionTable';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const emptyData = {
  referenceUnits: 0,
  rawMaterial: 0,
};

export default function Dashboard() {
  const [data, setData] = useState(emptyData);

  const { clientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [clientName, setClientName] = useState('');

  //Tab management
  const [value, setValue] = useState(location.pathname);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== 4) navigate(newValue);
    setValue(newValue);
  };

  /* useEffect(() => {
    console.log(clientId);
    if (clientId !== undefined) setValue('4');
  }, [clientId]); */

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;
    if (clientId) {
      $.ajax({
        method: 'GET',
        url: `${mainURL}client/${clientId}`,
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }).done((res) => {
        if (isSubscribed) {
          setClientName(res.name);
          setValue('4');
        }
      });
    }
    return () => (isSubscribed = false);
  }, [clientId]);

  //Dialog management
  const [reportDialog, setReportDialog] = useState(false);
  const [materialDialog, setMaterialDialog] = useState(false);

  const handleCloseDialogs = () => {
    setReportDialog(false);
    setMaterialDialog(false);
  };

  const handleOpenDialog = (card) => (event) => {
    console.log(card, event);
    switch (card) {
      case 'material':
        setMaterialDialog(true);
        break;

      default:
        break;
    }
  };

  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    let isSubscribed = true;

    $.ajax({
      method: 'GET',
      url: mainURL + 'dashboard/main',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .done((res) => {
        if (isSubscribed) {
          setData(res);
        }
      })
      .fail((res) => {
        if (res.status === 401) {
          alert('Sesión expirada');
          localStorage.removeItem('userInfo');
          navigate('/login');
        }
      });
    return () => (isSubscribed = false);
  }, [navigate]);

  return (
    <Box component="main" p={2}>
      <PurchaseOrderReportDialog open={reportDialog} handleClose={handleCloseDialogs} />
      <MaterialStatusDialog open={materialDialog} handleClose={handleCloseDialogs} />
      <Grid container sx={{ mt: 2, mb: 2 }}>
        <Grid item xs={10} md={6}>
          <Typography variant="h5" color="textSecondary" sx={{ fontWeight: 800 }}>
            {'Surtidora de cauchos'}
          </Typography>
        </Grid>
        {location.pathname === '/' ? (
          <Grid
            item
            sx={{ display: { xs: 'none', md: 'flex' } }}
            md={6}
            container
            justifyContent={'flex-end'}
          >
            <Button variant="outlined" onClick={() => setReportDialog(true)}>
              Generar reporte
            </Button>
          </Grid>
        ) : null}
        <Grid
          item
          sx={{ display: { xs: 'flex', md: 'none' } }}
          xs={2}
          container
          justifyContent={'flex-end'}
        >
          <IconButton variant="outlined" onClick={() => setReportDialog(true)}>
            <Tooltip title="Generar reporte">
              <ArticleIcon />
            </Tooltip>
          </IconButton>
        </Grid>
      </Grid>
      <TabContext value={value}>
        <TabList
          variant="scrollable"
          scrollButtons="auto"
          onChange={handleChange}
          aria-label="lab API tabs example"
        >
          <Tab label="Dashboard" value="/" />
          <Tab label="Proyección por cliente" value="/proyeccion-por-cliente" />
          <Tab label="Proyección por referencia" value="/proyeccion-por-referencia" />
          {clientId ? <Tab label={clientName} value="4" /> : null}
        </TabList>
        <TabPanel value="/">
          <Grid container spacing={2}>
            {[
              {
                id: 'material',
                text: 'Material disponible',
                value: `${numberWithCommas(data.rawMaterial)} Kg`,
                icon: ViewAgendaIcon,
              },
              {
                id: 'references',
                text: 'Unidades disponibles',
                value: numberWithCommas(data.referenceUnits),
                icon: InventoryIcon,
              },
            ].map((kpi) => (
              <Grid item key={kpi.id} xs={12} md={6}>
                <KPICard
                  Icon={kpi.icon}
                  text={kpi.text}
                  value={kpi.value}
                  handleClick={handleOpenDialog(kpi.id)}
                />
              </Grid>
            ))}
            <Grid item xs={12} md={8}>
              <LineChart
                endpoint={'dashboard/time-series?type=Production'}
                reportTitle={'Reporte de producción'}
                reportEndpoint={'production'}
                title={'Producción mensual'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <PieChart
                endpoint={'dashboard/distribution?type=Material'}
                title={'Distribución de materia prima'}
                format={'Kg'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <PieChart
                endpoint={'dashboard/distribution?type=Purchases'}
                title={'Referencias más vendidas'}
                format={'Unidades'}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <LineChart
                endpoint={'dashboard/time-series?type=Purchases'}
                reportTitle={'Reporte de ventas'}
                title={'Ventas mensuales'}
                reportEndpoint={'sales'}
                setColors
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <LineChart
                endpoint={'dashboard/time-series?type=Sharpening'}
                reportTitle={'Reporte de refilado'}
                title={'Análisis mensual de refilado'}
                reportEndpoint={'sharpening'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PieChart
                endpoint={'dashboard/distribution?type=Client'}
                title={'Mejores clientes'}
                format={'Unidades'}
              />
            </Grid>
            <Grid item xs={12} p={5}></Grid>
          </Grid>
        </TabPanel>
        <TabPanel value="/proyeccion-por-cliente">
          <Grid item xs={12}>
            <ProjectionTable endpoint="get-by-client" />
          </Grid>
        </TabPanel>
        <TabPanel value="/proyeccion-por-referencia">
          <Grid item xs={12}>
            <ProjectionTable endpoint="get-summarized" />
          </Grid>
        </TabPanel>
        <TabPanel value="4">
          <Grid item xs={12}>
            <ProjectionTable endpoint="get-all" clientId={clientId} />
          </Grid>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

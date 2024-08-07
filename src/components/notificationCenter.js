import React from 'react';

import FormControlLabel from '@mui/material/FormControlLabel';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import Toolbar from '@mui/material/Toolbar';
import Switch from '@mui/material/Switch';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import DownloadIcon from '@mui/icons-material/Download';
import WarningIcon from '@mui/icons-material/Warning';

import AlertReport from './docs/alerts';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { useWidth } from '../utils/widthSelector';
import { CircularProgress } from '@mui/material';

export default function NotificationCenter(props) {
  const {
    handleOnHoverClose,
    handleClose,
    open,
    notifications,
    sharpening,
    columns,
    onlyBelow,
    loading,
    handleToggleOnlyBelow,
  } = props;

  const breakpoint = useWidth();

  return (
    <Drawer
      onMouseLeave={() => {
        handleOnHoverClose();
      }}
      anchor={'right'}
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: { xs: `70%`, md: 400 },
        },
      }}
    >
      <Toolbar />
      <Toolbar>
        <Grid container justifyContent={'space-between'}>
          <Typography variant="subtitle1">Alertas</Typography>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={onlyBelow} onChange={handleToggleOnlyBelow} />}
              label="Solo faltantes"
            />
          </FormGroup>

          <PDFDownloadLink
            document={
              <AlertReport data={notifications} sharpening={sharpening} columns={columns} />
            }
            fileName="Reporte de alertas.pdf"
          >
            <IconButton disabled={notifications.length + sharpening.length <= 0}>
              {loading ? <CircularProgress size={35} /> : <DownloadIcon />}
            </IconButton>
          </PDFDownloadLink>
        </Grid>
      </Toolbar>
      <Grid container spacing={2} sx={{ maxWidth: '400px', p: 2, ml: '-8px' }}>
        {notifications.map((noti) => (
          <Grid key={noti.id} item sm={12}>
            <Card>
              <CardHeader
                avatar={
                  <WarningIcon
                    color="warning"
                    fontSize={['xs', 'sm'].includes(breakpoint) ? 'medium' : 'large'}
                  />
                }
                title={
                  <Typography
                    variant={['xs', 'sm'].includes(breakpoint) ? 'subtitle1' : 'h6'}
                    sx={{ fontWeight: 600 }}
                  >
                    {noti.application}
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant={['xs', 'sm'].includes(breakpoint) ? 'body2' : 'subtitle1'}>
                  {noti.message}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Drawer>
  );
}

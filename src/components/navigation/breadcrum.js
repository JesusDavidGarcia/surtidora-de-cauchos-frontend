import * as React from "react";

import Link from "@mui/material/Link";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import HailIcon from "@mui/icons-material/Hail";

import { Link as RouterLink, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
  "/usuarios": "Usuarios",
  "/materia-prima": "Materia prima",
  "/clientes": "Clientes",
  "/proveedores": "Proveedores",
  "/referencias": "Referencias",
  "/produccion": "Producción",
  "/ordenes-compra": "Órdenes de compra",
  "/ordenes-compra/crear": "Crear",
  "/operarios": "Operarios",
  "/refilado": "Refilado",
};

const breadcrumbIconMap = {
  "/materia-prima": <ViewAgendaIcon sx={{ mr: 1 }} htmlColor="#FFF" />,
  "/referencias": <InventoryIcon sx={{ mr: 1 }} htmlColor="#FFF" />,
  "/produccion": <EngineeringIcon sx={{ mr: 1 }} htmlColor="#FFF" />,
  "/ordenes-compra": (
    <ShoppingCartCheckoutIcon sx={{ mr: 1 }} htmlColor="#FFF" />
  ),
  "/ordenes-compra/crear": <PlaylistAddIcon sx={{ mr: 1 }} htmlColor="#FFF" />,
  "/proveedores": <LocalShippingIcon sx={{ mr: 1 }} htmlColor="#FFF" />,
  "/clientes": <HailIcon sx={{ mr: 1 }} htmlColor="#FFF" />,
  "/usuarios": <GroupIcon sx={{ mr: 1 }} htmlColor="#FFF" />,
  "/operarios": <GroupsIcon sx={{ mr: 1 }} htmlColor="#FFF" />,
  "/refilado": <ContentCutIcon sx={{ mr: 1 }} htmlColor="#FFF" />,
};

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

export default function ActiveLastBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x.length < 35);
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" htmlColor="#FFF" />}
      sx={{ display: "flex", alignItems: "center" }}
    >
      <Grid container>
        <HomeIcon sx={{ mr: 1 }} htmlColor="#FFF" />
        <LinkRouter underline="hover" color="white" to="/">
          Inicio
        </LinkRouter>
      </Grid>
      {pathnames.map((value, index) => {
        const last = false;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        return last ? (
          <Grid container key={to}>
            {breadcrumbIconMap[to]}
            <Typography color="white">{breadcrumbNameMap[to]}</Typography>
          </Grid>
        ) : (
          <Grid container key={to}>
            {breadcrumbIconMap[to]}
            <LinkRouter underline="hover" color="white" to={to}>
              {breadcrumbNameMap[to]}
            </LinkRouter>
          </Grid>
        );
      })}
    </Breadcrumbs>
  );
}

import React, { useState, useEffect } from "react";

//MUI
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BottomNavigation from "@mui/material/BottomNavigation";
import Paper from "@mui/material/Paper";

//Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router-dom";

import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EngineeringIcon from "@mui/icons-material/Engineering";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupIcon from "@mui/icons-material/Group";
import HailIcon from "@mui/icons-material/Hail";

import InventoryPopover from "../popovers/inventory";
import SectionsPopover from "../popovers/sections";

const sections = [
  {
    id: "raw-material",
    title: "Materia prima",
    icon: <ViewAgendaIcon />,
    path: "/materia-prima",
    permission: 9,
  },
  {
    id: "sharpening",
    title: "Refilado",
    icon: <ContentCutIcon />,
    path: "/refilado",
    permission: 9,
  },
  {
    id: "references",
    title: "Referencias",
    icon: <InventoryIcon />,
    path: "/referencias",
    permission: 9,
  },
  {
    id: "production",
    title: "Producción",
    icon: <EngineeringIcon />,
    path: "/produccion",
    permission: 9,
  },
  {
    id: "purchase-orders",
    title: "Órdenes de compra",
    icon: <ShoppingCartCheckoutIcon />,
    path: "/ordenes-compra",
    permission: 9,
  },
  {
    id: "operators",
    title: "Operarios",
    icon: <GroupsIcon />,
    path: "/operarios",
    permission: 9,
  },
  {
    id: "sharpeners",
    title: "Refiladoras",
    icon: <GroupsIcon />,
    path: "/refiladoras",
    permission: 9,
  },
  {
    id: "providers",
    title: "Proveedores",
    icon: <LocalShippingIcon />,
    path: "/proveedores",
    permission: 9,
  },
  {
    id: "clients",
    title: "Clientes",
    icon: <HailIcon />,
    path: "/clientes",
    permission: 9,
  },
  {
    id: "users",
    title: "Usuarios",
    icon: <GroupIcon />,
    path: "/usuarios",
    permission: 1,
  },
];

export default function BottomNavbar() {
  const currentPath = window.location.pathname;
  const [value, setValue] = useState(currentPath);

  //const permissions = usePermissions();
  const navigate = useNavigate();

  //Profile popover management
  const [anchorInventory, setAnchorInventory] = useState(null);
  const [anchorSections, setAnchorSections] = useState(null);
  const handleInventoryPopoverOpen = (type) => (event) => {
    event.stopPropagation();
    switch (type) {
      case "inventory":
        setAnchorInventory(event.currentTarget);
        break;
      case "sections":
        setAnchorSections(event.currentTarget);
        break;
      default:
        setAnchorSections(event.currentTarget);
    }
  };

  const handleInventoryPopoverClose = () => {
    setAnchorInventory(null);
    setAnchorSections(null);
  };

  useEffect(() => {
    let isSubscribed = true;
    const mainRoute = `/${currentPath.split("/")[1]}`;
    if (isSubscribed) setValue(mainRoute);
    return () => (isSubscribed = false);
  }, [currentPath]);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <InventoryPopover
        open={anchorInventory}
        handleClose={handleInventoryPopoverClose}
      />
      <SectionsPopover
        open={anchorSections}
        handleClose={handleInventoryPopoverClose}
      />
      <BottomNavigation
        showLabels
        sx={{ display: { xs: "none", md: "flex" } }}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(newValue);
        }}
      >
        <BottomNavigationAction
          value={"/"}
          label="Inicio"
          icon={<DashboardIcon />}
        />

        {sections.map((section) => {
          return (
            <BottomNavigationAction
              key={section.id}
              label={section.title}
              value={section.path}
              icon={section.icon}
            />
          );
        })}
      </BottomNavigation>
      <BottomNavigation
        showLabels
        sx={{ display: { xs: "flex", md: "none" } }}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(newValue);
        }}
      >
        <BottomNavigationAction
          value={"/"}
          label="Inicio"
          icon={<DashboardIcon />}
        />
        <BottomNavigationAction
          onClick={handleInventoryPopoverOpen("inventory")}
          label="Inventario"
          icon={<InventoryIcon />}
        />
        <BottomNavigationAction
          onClick={handleInventoryPopoverOpen("sections")}
          label="Más opciones"
          icon={<MoreHorizIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}

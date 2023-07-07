import React from "react";

//React router
import { useNavigate } from "react-router-dom";

//MUI
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";

import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EngineeringIcon from "@mui/icons-material/Engineering";

import GroupsIcon from "@mui/icons-material/Groups";
import GroupIcon from "@mui/icons-material/Group";
import HailIcon from "@mui/icons-material/Hail";

const sections = [
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
export default function InventoryPopover(props) {
  const navigate = useNavigate();
  const { open } = props;

  const handleClick = (path) => (event) => {
    navigate(path);
    props.handleClose();
  };

  return (
    <Popover
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={Boolean(open)}
      anchorEl={open}
      onClose={props.handleClose}
    >
      <List dense>
        {sections.map((section) => (
          <ListItemButton key={section.id} onClick={handleClick(section.path)}>
            <ListItemText primary={section.title} />
          </ListItemButton>
        ))}
      </List>
    </Popover>
  );
}

import React from "react";

//React router
import { useNavigate } from "react-router-dom";

//MUI
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";

//Icons
import InventoryIcon from "@mui/icons-material/Inventory";

const sections = [
  {
    id: "raw-material",
    title: "Materia prima",
    icon: <InventoryIcon />,
    path: "/materia-prima",
    permission: 17,
  },
  {
    id: "rubber-references",
    title: "Referencias",
    icon: <InventoryIcon />,
    path: "/referencias",
    permission: 21,
  },
];

export default function SectionsPopover(props) {
  //const permissions = usePermissions();
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
        {sections.map((section) => {
          return (
            <ListItemButton
              key={section.id}
              onClick={handleClick(section.path)}
            >
              <ListItemText primary={section.title} />
            </ListItemButton>
          );
        })}
      </List>
    </Popover>
  );
}

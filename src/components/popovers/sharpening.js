import React from "react";

//React router
import { useNavigate } from "react-router-dom";

//MUI
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";

//Icons
import ContentCutIcon from "@mui/icons-material/ContentCut";
import GroupIcon from "@mui/icons-material/Group";

const sections = [
  {
    id: "sharpening",
    title: "Ingresos",
    icon: <ContentCutIcon />,
    path: "/ingresos-refilado",
    permission: 9,
  },
  {
    id: "sharpeners",
    title: "Actualidad",
    icon: <GroupIcon />,
    path: "/actualidad-refilado",
    permission: 9,
  },
];

export default function SharpeningPopover(props) {
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

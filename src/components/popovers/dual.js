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
import BackpackIcon from "@mui/icons-material/Backpack";
import GroupIcon from "@mui/icons-material/Group";

export default function DualPopover(props) {
  //const permissions = usePermissions();
  const navigate = useNavigate();
  const { open, type } = props;

  const handleClick = (path) => (event) => {
    navigate(path);
    props.handleClose();
  };

  const sections = [
    {
      id: "sharpening",
      title: "Ingresos",
      icon: <ContentCutIcon />,
      path: type === "sharpening" ? "/ingresos-refilado" : "/ingresos-empacado",
      permission: 9,
    },
    {
      id: "sharpeners",
      title: "Actualidad",
      icon: <GroupIcon />,
      path:
        type === "sharpening" ? "/actualidad-refilado" : "/actualidad-empacado",
      permission: 9,
    },
    {
      id: "packaging",
      title: "Empaques",
      icon: <BackpackIcon />,
      path: "/empaques",
      permission: 9,
    },
  ];

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
        {sections
          .filter((x) => (type === "sharpening" ? x.id !== "packaging" : true))
          .map((section) => {
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

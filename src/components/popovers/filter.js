import React from "react";

//MUI
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";

export default function FilterPopover(props) {
  const { open, handleSubmit } = props;

  return (
    <Popover
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={Boolean(open)}
      anchorEl={open}
      onClose={props.handleClose}
    >
      <List dense>
        <ListItemButton onClick={handleSubmit(false)}>
          <ListItemText primary={"Mensual"} />
        </ListItemButton>
        <ListItemButton onClick={handleSubmit(true)}>
          <ListItemText primary={"Diario"} />
        </ListItemButton>
      </List>
    </Popover>
  );
}

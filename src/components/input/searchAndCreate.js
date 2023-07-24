import React from "react";

//MUI
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

//Icons
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

/* import mainURL from "../../config/environment";
import $ from "jquery"; */

/* const usePermissions = (refresh) => {
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    const roleId = JSON.parse(localStorage.getItem("userInfo")).roleId;
    let isSubscribed = true;
    $.ajax({
      method: "GET",
      url: mainURL + `permissions/${roleId}`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).done((res) => {
      const aux = [];
      res.forEach((element) => {
        if (element.isAssigned) aux.push(element.permission);
      });
      if (isSubscribed) setPermissions(aux);
    });
    return () => (isSubscribed = false);
  }, []);
  return permissions;
}; */

export default function SearchAndCreate(props) {
  //const permissions = useContext(PermissionContext);
  //Data management
  const { showDownloadReportOption } = props;
  const { showAdvanceSearchIcon } = props;
  const { handleOpenDialog } = props;
  const { showRefreshIcon } = props;
  const { handleSearch } = props;
  const { buttonLabel } = props;
  const { searchText } = props;
  const { permission } = props;
  const { title } = props;

  //const permissions = usePermissions();

  //const [showAddOption, setShowAddOption] = useState(false);
  /* useEffect(() => {
    let isSubscribed = true;
    const show = permissions.find((x) => x === permission);
    if (isSubscribed) {
      setShowAddOption(show);
    }
    return () => (isSubscribed = false);
  }, [permission, permissions]); */

  return (
    <Grid item xs={12} md={4} columnSpacing={1} container>
      <Grid item xs={permission ? 6 : 12} md={permission ? 8 : 12}>
        <FormControl fullWidth>
          <TextField
            label={title ?? "Buscar por nombre"}
            variant="standard"
            onChange={handleSearch}
            value={searchText}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
              endAdornment: showAdvanceSearchIcon ? (
                <IconButton size="small" onClick={handleOpenDialog("search")}>
                  <ArrowDropDownIcon color="action" />
                </IconButton>
              ) : showRefreshIcon ? (
                <IconButton size="small" onClick={handleOpenDialog("refresh")}>
                  <ClearIcon color="action" />
                </IconButton>
              ) : null,
            }}
          />
        </FormControl>
      </Grid>
      {permission ? (
        <Grid
          item
          xs={showDownloadReportOption ? 3 : 6}
          md={showDownloadReportOption ? 2 : 4}
          sx={{ textAlign: "end", alignSelf: "center" }}
        >
          <Button variant="contained" onClick={handleOpenDialog("create")}>
            <PlaylistAddIcon /* sx={{ mr: 1 }} */ />
            {showDownloadReportOption ? null : buttonLabel ?? "Crear"}
          </Button>
        </Grid>
      ) : null}
      {showDownloadReportOption ? (
        <Grid item xs={3} md={2} sx={{ textAlign: "end", alignSelf: "center" }}>
          {props.children}
        </Grid>
      ) : null}
    </Grid>
  );
}

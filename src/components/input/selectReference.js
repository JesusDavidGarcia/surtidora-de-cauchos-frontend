import React, { useState, useEffect } from "react";

import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import $ from "jquery";
import mainURL from "../../config/environment";

const useReferences = (refresh, includeSecondary) => {
  const [references, setReferences] = useState([]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    const include = includeSecondary ?? false;
    console.log(include);
    $.ajax({
      method: "GET",
      url: `${mainURL}rubber-reference/get-all?includeSecondary=${include}`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).done((res) => {
      const aux = res.sort((a, b) =>
        `${a.reference} ${a.application}`.localeCompare(
          `${b.reference} ${b.application}`
        )
      );
      if (isSubscribed) setReferences(aux);
    });
    return () => (isSubscribed = false);
  }, [includeSecondary]);
  return references;
};

export default function SelectReference(props) {
  const { includeSecondary, title } = props;
  const { handleChange } = props;
  const { required } = props;
  const { refresh } = props;
  const { value } = props;

  const references = useReferences(refresh, includeSecondary);

  return (
    <FormControl
      sx={{ height: "56px", justifyContent: "flex-end" }}
      fullWidth
      required={required}
    >
      <Autocomplete
        id="tags-standard"
        options={references}
        getOptionLabel={(opt) => `${opt.reference} ${opt.application}`}
        value={value}
        onChange={(event, newValue) => {
          handleChange(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={title ?? "Referencia"}
          />
        )}
      />
    </FormControl>
  );
}

import React, { useState, useEffect } from "react";

import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import $ from "jquery";
import mainURL from "../../config/environment";

const useSharpeners = (reference) => {
  const [sharpeners, setSharpeners] = useState([]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    if (reference) {
      $.ajax({
        method: "GET",
        url: `${mainURL}operator-sharpening/get-all?reference=${reference}`,
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).done((res) => {
        console.log(res);
        const aux = res.sort((a, b) =>
          `${a.reference} ${a.application}`.localeCompare(
            `${b.reference} ${b.application}`
          )
        );
        if (isSubscribed) setSharpeners(aux);
      });
    } else {
      setSharpeners([]);
    }
    return () => (isSubscribed = false);
  }, [reference]);
  return sharpeners;
};

export default function SelectSharpener(props) {
  const { handleChange } = props;
  const { reference } = props;
  //const { required } = props;
  const { value } = props;

  const references = useSharpeners(reference);

  return (
    <FormControl fullWidth>
      <Autocomplete
        id="tags-standard"
        options={references}
        getOptionLabel={(opt) => `${opt.sharpener} - Cantidad: ${opt.quantity}`}
        value={value}
        onChange={(event, newValue) => {
          handleChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Refilador" />
        )}
      />
    </FormControl>
  );
}

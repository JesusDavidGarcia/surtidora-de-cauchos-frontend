import React, { useState, useEffect } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

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
        if (isSubscribed) setSharpeners(res);
      });
    }
    return () => (isSubscribed = false);
  }, [reference]);
  return sharpeners;
};

export default function SelectAvailableSharpeners(props) {
  const { handleChange } = props;
  const { reference } = props;
  const { required } = props;
  const { title } = props;
  const { value } = props;
  const { name } = props;

  const operators = useSharpeners(reference);

  return (
    <FormControl
      fullWidth
      required={required}
      sx={{ height: "56px", justifyContent: "flex-end" }}
    >
      <InputLabel variant="standard">{title ?? "Operario"}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        name={name}
        variant="standard"
        native
      >
        <option value="" />
        {operators.map((operator) => (
          <option key={operator.id} value={operator.id}>
            {operator.sharpener}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

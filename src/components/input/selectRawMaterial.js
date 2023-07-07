import React, { useState, useEffect } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import $ from "jquery";
import mainURL from "../../config/environment";

const useRawMaterials = (refresh) => {
  const [rawMaterials, setRawMaterials] = useState([]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    $.ajax({
      method: "GET",
      url: mainURL + "raw-material/get-all",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).done((res) => {
      if (isSubscribed) setRawMaterials(res);
    });
    return () => (isSubscribed = false);
  }, []);
  return rawMaterials;
};

export default function SelectRawMaterial(props) {
  const { handleChange } = props;
  const { required } = props;
  const { refresh } = props;
  const { value } = props;
  const { name } = props;

  const rawMaterials = useRawMaterials(refresh);

  return (
    <FormControl
      fullWidth
      required={required}
      sx={{ height: "56px", justifyContent: "flex-end" }}
    >
      <InputLabel variant="standard">{"Material"}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        name={name}
        variant="standard"
        native
      >
        <option value="" />
        {rawMaterials.map((reference) => (
          <option key={reference.id} value={reference.id}>
            {reference.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

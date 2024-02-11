import React, { useState, useEffect } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import $ from "jquery";
import mainURL from "../../config/environment";

const usePackaging = (area) => {
  const [packaging, setPackaging] = useState([]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    $.ajax({
      method: "GET",
      url: `${mainURL}packaging/get-all`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).done((res) => {
      if (isSubscribed) setPackaging(res);
    });
    return () => (isSubscribed = false);
  }, []);
  return packaging;
};

export default function SelectPackaging(props) {
  const { handleChange } = props;
  const { required } = props;
  const { title } = props;
  const { value } = props;
  const { name } = props;

  const packaging = usePackaging();

  return (
    <FormControl
      fullWidth
      required={required}
      sx={{ height: "56px", justifyContent: "flex-end" }}
    >
      <InputLabel variant="standard">{title ?? "Empaque"}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        name={name}
        variant="standard"
        native
      >
        <option value="" />
        {packaging.map((operator) => (
          <option key={operator.id} value={operator.id}>
            {operator.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

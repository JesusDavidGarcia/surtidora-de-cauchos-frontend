import React, { useState, useEffect } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import $ from "jquery";
import mainURL from "../../config/environment";

const useOperators = (area) => {
  const [operators, setOperators] = useState([]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    $.ajax({
      method: "GET",
      url: `${mainURL}operator/get-all?area=${area}`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).done((res) => {
      if (isSubscribed) setOperators(res);
    });
    return () => (isSubscribed = false);
  }, [area]);
  return operators;
};

export default function SelectOperator(props) {
  const { handleChange } = props;
  const { required } = props;
  const { title } = props;
  const { value } = props;
  const { name } = props;
  const { area } = props;

  const operators = useOperators(area);

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
            {operator.fullName}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

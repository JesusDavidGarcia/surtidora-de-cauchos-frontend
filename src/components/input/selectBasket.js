import React, { useState, useEffect } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import $ from "jquery";
import mainURL from "../../config/environment";

const useBaskets = (refresh) => {
  const [baskets, setBaskets] = useState([]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    $.ajax({
      method: "GET",
      url: mainURL + "basket/get-all",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).done((res) => {
      if (isSubscribed) setBaskets(res);
    });
    return () => (isSubscribed = false);
  }, []);
  return baskets;
};

export default function SelectBasket(props) {
  const { handleChange } = props;
  const { required } = props;
  const { refresh } = props;
  const { value } = props;
  const { name } = props;

  const baskets = useBaskets(refresh);

  return (
    <FormControl
      fullWidth
      required={required}
      sx={{ height: "56px", justifyContent: "flex-end" }}
    >
      <InputLabel variant="standard">{"Canasta"}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        name={name}
        variant="standard"
        native
      >
        <option value="" />
        {baskets.map((basket) => (
          <option key={basket.id} value={basket.id}>
            {basket.number}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

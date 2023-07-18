import React from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

const options = ["Manufactura", "Refilado"];
export default function SelectArea(props) {
  const { handleChange } = props;
  const { required } = props;

  const { value } = props;
  const { name } = props;

  return (
    <FormControl
      fullWidth
      required={required}
      sx={{ height: "56px", justifyContent: "flex-end" }}
    >
      <InputLabel variant="standard">{"Área"}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        name={name}
        variant="standard"
        native
      >
        <option value="" />
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

// Dropdown for selecting a customer
// Props: customers (array), selectedCustomer (number), onChange (function)

import PropTypes from "prop-types";
import { Box, Typography, Select, MenuItem } from "@mui/material";

const CustomerDropdown = ({ customers, selectedCustomer, onChange }) => (
  <Box sx={{ minWidth: 250, flex: 1 }}>
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      Customer
    </Typography>
    <Select
      fullWidth
      value={selectedCustomer || ""}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {customers.map((customer) => (
        <MenuItem key={customer.id} value={customer.id}>
          {customer.name}
        </MenuItem>
      ))}
    </Select>
  </Box>
);

CustomerDropdown.propTypes = {
  customers: PropTypes.array.isRequired,
  selectedCustomer: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default CustomerDropdown;

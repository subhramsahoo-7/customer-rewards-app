import PropTypes from "prop-types";
import { Box, Typography, Select, MenuItem } from "@mui/material";

const MonthDropdown = ({ selectedMonth, onChange }) => (
  <Box sx={{ minWidth: 250, flex: 1 }}>
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      Month
    </Typography>
    <Select
      fullWidth
      value={selectedMonth}
      onChange={(e) => onChange(e.target.value)}
    >
      <MenuItem value="last3">Last 3 Months</MenuItem>
      {[
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((month) => (
        <MenuItem key={month} value={month}>
          {month}
        </MenuItem>
      ))}
    </Select>
  </Box>
);

MonthDropdown.propTypes = {
  selectedMonth: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MonthDropdown;

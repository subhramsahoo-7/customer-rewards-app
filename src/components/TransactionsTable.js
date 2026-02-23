// Displays transactions in a table with pagination
// Props: transactions (array), currentPage (number), totalPages (number), onPageChange (function)

import PropTypes from "prop-types";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { calculatePoints } from "../utils/rewards";

const TransactionsTable = ({
  transactions,
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Transactions
    </Typography>
    {transactions.length > 0 ? (
      <Table>
        <TableHead sx={{ backgroundColor: "#1976d2" }}>
          <TableRow>
            <TableCell sx={{ color: "white" }}>Transaction ID</TableCell>
            <TableCell sx={{ color: "white" }}>Date</TableCell>
            <TableCell sx={{ color: "white" }}>Amount</TableCell>
            <TableCell sx={{ color: "white" }}>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((txn) => (
            <TableRow key={txn.transactionId}>
              <TableCell>{txn.transactionId}</TableCell>
              <TableCell>{txn.date}</TableCell>
              <TableCell>${txn.amount}</TableCell>
              <TableCell>{calculatePoints(txn.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <Typography>No transactions available for this selection.</Typography>
    )}

    {transactions.length > 0 && (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => onPageChange(value)}
          color="primary"
        />
      </Box>
    )}
  </Paper>
);

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default TransactionsTable;

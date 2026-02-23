import React, { useState, useMemo } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { calculatePoints } from "../utils/rewards";
import { APP_CONSTANTS } from "../constants/appConstants";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";

const CustomerRewards = () => {
  const { transactions, loading, error } = useTransactions();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("last3");
  const [currentPage, setCurrentPage] = useState(APP_CONSTANTS.INITIAL_PAGE);
  const pageSize = APP_CONSTANTS.PAGE_SIZE;

  // ✅ Helper: unique customers
  const getUniqueCustomers = () => {
    if (!transactions || transactions.length === 0) return [];
    const ids = [...new Set(transactions.map((txn) => txn.customerId))];
    return ids.map((id) => ({ id, name: "Customer " + id }));
  };

  // ✅ Helper: filter transactions
  const filterTransactions = () => {
    if (!selectedCustomer) return [];
    let filtered = transactions.filter(
      (txn) => txn.customerId === selectedCustomer
    );

    if (selectedMonth !== "last3") {
      filtered = filtered.filter((txn) => {
        const date = new Date(txn.date);
        const monthName = date.toLocaleString("default", { month: "short" });
        return monthName === selectedMonth;
      });
    } else {
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 2);
      filtered = filtered.filter((txn) => new Date(txn.date) >= threeMonthsAgo);
    }

    return filtered || [];
  };

  // ✅ Helper: summarize points
  const summarizePoints = (filtered) => {
    const summary = {};
    (filtered || []).forEach((txn) => {
      const date = new Date(txn.date);
      const month = date.toLocaleString("default", { month: "short" });
      const points = calculatePoints(txn.amount);
      summary[month] = (summary[month] || 0) + points;
    });
    return summary;
  };

  const customers = getUniqueCustomers();
  const filtered = filterTransactions();

  // ✅ useMemo for expensive calculations
  const summary = useMemo(() => summarizePoints(filtered), [filtered]);
  const totalPoints = useMemo(
    () => filtered.reduce((sum, txn) => sum + calculatePoints(txn.amount), 0),
    [filtered]
  );

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  const totalPages =
    filtered.length > 0 ? Math.ceil(filtered.length / pageSize) : 1;
  const paginatedTransactions =
    filtered.length > 0
      ? filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Customer Rewards Program
      </Typography>

      {/* Dropdowns with static labels above */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
        <Box sx={{ minWidth: 250, flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Customer
          </Typography>
          <Select
            fullWidth
            value={selectedCustomer || ""}
            onChange={(e) => setSelectedCustomer(Number(e.target.value))}
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ minWidth: 250, flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Month
          </Typography>
          <Select
            fullWidth
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <MenuItem value="last3">Last 3 Months</MenuItem>
            {[
              "Jan","Feb","Mar","Apr","May","Jun",
              "Jul","Aug","Sep","Oct","Nov","Dec"
            ].map((month) => (
              <MenuItem key={month} value={month}>{month}</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Monthly Points Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Points
        </Typography>
        {Object.keys(summary).length > 0 ? (
          <ul>
            {Object.entries(summary).map(([month, points]) => (
              <li key={month}>
                {month}: {points} points
              </li>
            ))}
          </ul>
        ) : (
          <Typography>No points available for this selection.</Typography>
        )}
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
          Total Points: {totalPoints}
        </Typography>
      </Paper>

      {/* Transactions Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Transactions
        </Typography>
        {paginatedTransactions.length > 0 ? (
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
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>{transaction.transactionId}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>{calculatePoints(transaction.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No transactions available for this selection.</Typography>
        )}

        {paginatedTransactions.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CustomerRewards;
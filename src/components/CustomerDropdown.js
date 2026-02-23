import { useState, useMemo } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { calculatePoints } from "../utils/rewards";
import { APP_CONSTANTS } from "../constants/appConstants";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

import CustomerDropdown from "./CustomerDropdown";
import MonthDropdown from "./MonthDropdown";
import PointsSummary from "./PointsSummary";
import TransactionsTable from "./TransactionsTable";

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
      (txn) => txn.customerId === selectedCustomer,
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
    [filtered],
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

      {/* Dropdowns */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
        <CustomerDropdown
          customers={customers}
          selectedCustomer={selectedCustomer}
          onChange={setSelectedCustomer}
        />
        <MonthDropdown
          selectedMonth={selectedMonth}
          onChange={setSelectedMonth}
        />
      </Box>

      {/* Points Summary */}
      <PointsSummary summary={summary} totalPoints={totalPoints} />

      {/* Transactions Table */}
      <TransactionsTable
        transactions={paginatedTransactions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
};

export default CustomerRewards;

// src/components/CustomerRewards.js
import React, { useState, useMemo } from "react";
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
  // Custom hook fetches transactions, handles loading & error
  const { transactions, loading, error } = useTransactions();

  //  State for selected customer, month, and pagination
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("last3");
  const [currentPage, setCurrentPage] = useState(APP_CONSTANTS.INITIAL_PAGE);
  const pageSize = APP_CONSTANTS.PAGE_SIZE;

  //  Extract unique customers from transactions
  const getUniqueCustomers = () => {
    if (!transactions || transactions.length === 0) return [];
    const ids = [...new Set(transactions.map((txn) => txn.customerId))];
    return ids.map((id) => ({ id, name: "Customer " + id }));
  };

  //  Filter transactions by selected customer and month
  const filterTransactions = () => {
    if (!selectedCustomer) return [];
    let filtered = transactions.filter(
      (txn) => txn.customerId === selectedCustomer
    );

    if (selectedMonth !== "last3") {
      // Filter by specific month
      filtered = filtered.filter((txn) => {
        const date = new Date(txn.date);
        const monthName = date.toLocaleString("default", { month: "short" });
        return monthName === selectedMonth;
      });
    } else {
      // Filter last 3 months
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 2);
      filtered = filtered.filter((txn) => new Date(txn.date) >= threeMonthsAgo);
    }

    return filtered || [];
  };

  //  Summarize points earned per month
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

  // Memoize expensive calculations
  const summary = useMemo(() => summarizePoints(filtered), [filtered]);
  const totalPoints = useMemo(
    () => filtered.reduce((sum, txn) => sum + calculatePoints(txn.amount), 0),
    [filtered]
  );

  //  Show loader or error before rendering UI
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  // Pagination logic
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


      <PointsSummary summary={summary} totalPoints={totalPoints} />

     
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
import React, { useEffect, useState } from "react";
import { fetchTransactions } from "../services/api";
import { calculatePoints } from "../utils/rewards";
import Loader from "./Loader";
import Pagination from "./Pagination";

const CustomerRewards = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("last3");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

useEffect(() => {
  setLoading(true);
  fetchTransactions().then((data) => {
    setTimeout(() => {   
      setTransactions(data || []);
      if (data && data.length > 0) {
        setSelectedCustomer(data[0].customerId);
      }
      setLoading(false);
    }, 2000); 
  });
}, []);

  if (loading) {
    return <Loader />;
  }

  
  const getUniqueCustomers = () => {
    if (!transactions || transactions.length === 0) return [];
    const ids = [...new Set(transactions.map((t) => t.customerId))];
    return ids.map((id) => ({
      id,
      name: "Customer " + id,
    }));
  };

  const filterTransactions = () => {
    if (!selectedCustomer) return []; 

    let filtered = transactions.filter((t) => t.customerId === selectedCustomer);

    if (selectedMonth !== "last3") {
      filtered = filtered.filter((t) => {
        const d = new Date(t.date);
        const monthName = d.toLocaleString("default", { month: "short" });
        return monthName === selectedMonth;
      });
    } else {
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 2);
      filtered = filtered.filter((t) => new Date(t.date) >= threeMonthsAgo);
    }

    return filtered || [];
  };

  const summarizePoints = (filtered) => {
    const summary = {};
    let total = 0;

    (filtered || []).forEach((t) => {
      const d = new Date(t.date);
      const month = d.toLocaleString("default", { month: "short" });
      const pts = calculatePoints(t.amount);

      summary[month] = (summary[month] || 0) + pts;
      total += pts;
    });

    return { summary, total };
  };

 
  const customers = getUniqueCustomers();
  const filtered = filterTransactions();
  const { summary, total } = summarizePoints(filtered);

  const totalPages = filtered.length > 0 ? Math.ceil(filtered.length / pageSize) : 1;
  const paginatedTransactions = filtered.length > 0
    ? filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  return (
    <div style={{ padding: 20 }}>
      <h2>Customer Rewards Program</h2>

      <label>Select Customer: </label>
      {customers.length > 0 ? (
        <select
          value={selectedCustomer || ""}
          onChange={(e) => setSelectedCustomer(Number(e.target.value))}
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      ) : (
        <span>No customers available</span>
      )}

      <label style={{ marginLeft: 20 }}>Select Month: </label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="last3">Last 3 Months</option>
        <option value="Jan">Jan</option>
        <option value="Feb">Feb</option>
        <option value="Mar">Mar</option>
        <option value="Apr">Apr</option>
        <option value="May">May</option>
        <option value="Jun">Jun</option>
        <option value="Jul">Jul</option>
        <option value="Aug">Aug</option>
        <option value="Sep">Sep</option>
        <option value="Oct">Oct</option>
        <option value="Nov">Nov</option>
        <option value="Dec">Dec</option>
      </select>

      <div style={{ marginTop: 20 }}>
        <h3>Monthly Points</h3>
        {Object.keys(summary).length > 0 ? (
          <ul>
            {Object.entries(summary).map(([month, pts]) => (
              <li key={month}>
                {month}: {pts} points
              </li>
            ))}
          </ul>
        ) : (
          <p>No points available for this selection.</p>
        )}
        <strong>Total Points: {total}</strong>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Transactions</h3>
        {paginatedTransactions.length > 0 ? (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((t) => (
                <tr key={t.transactionId}>
                  <td>{t.transactionId}</td>
                  <td>{t.date}</td>
                  <td>${t.amount}</td>
                  <td>{calculatePoints(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions available for this selection.</p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CustomerRewards;
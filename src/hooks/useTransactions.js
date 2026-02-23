import { useState, useEffect } from "react";
import { fetchTransactions } from "../services/api";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions();

        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        setTransactions(data);
      } catch (err) {
        setError(err.message || "Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  return { transactions, loading, error };
};

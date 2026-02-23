export const fetchTransactions = async () => {
  try {
    const response = await fetch("/data/transactions.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: expected an array");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch transactions");
  }
};

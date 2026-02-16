export const fetchTransactions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      fetch("/data/transactions.json")
        .then((res) => res.json())
        .then((data) => resolve(data));
    }, 3000); 
  });
};


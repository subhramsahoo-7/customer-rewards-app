const Loader = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div
        className="spinner"
        style={{
          border: "6px solid #f3f3f3",
          borderTop: "6px solid #3498db",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          animation: "spin 1s linear infinite",
          margin: "auto",
        }}
      ></div>
      <h3 style={{ marginTop: "20px" }}>Loading data...</h3>
    </div>
  );
};

export default Loader;

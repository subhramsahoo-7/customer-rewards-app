import PropTypes from "prop-types";

const ErrorMessage = ({ message }) => (
  <div style={{ color: "red", textAlign: "center" }}>
    <p>{message}</p>
  </div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
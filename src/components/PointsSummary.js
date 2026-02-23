import PropTypes from "prop-types";
import { Paper, Typography } from "@mui/material";

const PointsSummary = ({ summary, totalPoints }) => (
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
);

PointsSummary.propTypes = {
  summary: PropTypes.object.isRequired,
  totalPoints: PropTypes.number.isRequired,
};

export default PointsSummary;

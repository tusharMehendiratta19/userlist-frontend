import React from "react";
import "../style/snackbar.css";

const Snackbar = ({ open, message, type }) => {
  if (!open) return null;

  return (
    <div className={`snackbar ${type}`}>
      {message}
    </div>
  );
};

export default Snackbar;

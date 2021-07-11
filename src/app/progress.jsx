import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

export function Progress({ percent }) {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setMsg(`Raytraced ${percent.toFixed(0)}%`);
  }, [percent]);

  return <p>{msg}</p>;
}

Progress.propTypes = {
  percent: PropTypes.number,
};

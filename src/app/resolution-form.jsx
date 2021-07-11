import React, { useState } from "react";
import PropTypes from "prop-types";

export function ResolutionForm({ onSubmit }) {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(50);

  function onFormSubmit(event) {
    event.preventDefault();
    onSubmit({ width, height });
  }

  return (
    <form onSubmit={onFormSubmit}>
      <label>
        <span>Width:</span>
        <input
          type="number"
          onChange={(e) => setWidth(e.target.value)}
          defaultValue={width}
        />
      </label>
      <label>
        <span>Height:</span>
        <input
          type="number"
          onChange={(e) => setHeight(e.target.value)}
          defaultValue={height}
        />
      </label>
      <button>Render</button>
    </form>
  );
}

ResolutionForm.propTypes = {
  onSubmit: PropTypes.func,
};

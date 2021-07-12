import React, { useState } from "react";
import PropTypes from "prop-types";

export function ResolutionForm({ widthPx, heightPx, onSubmit }) {
  const [width, setWidth] = useState(widthPx);
  const [height, setHeight] = useState(heightPx);

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
          onChange={(e) => setWidth(parseInt(e.target.value))}
          defaultValue={width}
        />
      </label>
      <label>
        <span>Height:</span>
        <input
          type="number"
          onChange={(e) => setHeight(parseInt(e.target.value))}
          defaultValue={height}
        />
      </label>
      <button>Render</button>
    </form>
  );
}

ResolutionForm.propTypes = {
  widthPx: PropTypes.number,
  heightPx: PropTypes.number,
  onSubmit: PropTypes.func,
};

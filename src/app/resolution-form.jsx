import React, { useState } from "react";
import PropTypes from "prop-types";

export function ResolutionForm({ widthPx, heightPx, fovDegrees, onSubmit }) {
  const [width, setWidth] = useState(widthPx);
  const [height, setHeight] = useState(heightPx);
  const [fov, setFov] = useState(fovDegrees);

  function onFormSubmit(event) {
    event.preventDefault();
    onSubmit({ width, height, fov });
  }

  return (
    <form onSubmit={onFormSubmit}>
      <label>
        <span>Width:</span>
        <input
          type="number"
          onChange={(e) => setWidth(parseInt(e.target.value))}
          min="50"
          defaultValue={width}
        />
      </label>
      <label>
        <span>Height:</span>
        <input
          type="number"
          min="50"
          onChange={(e) => setHeight(parseInt(e.target.value))}
          defaultValue={height}
        />
      </label>
      <label>
        <span>FOV:</span>
        <input
          type="number"
          onChange={(e) => setFov(parseInt(e.target.value))}
          defaultValue={fov}
        />
      </label>
      <button>Render</button>
    </form>
  );
}

ResolutionForm.propTypes = {
  widthPx: PropTypes.number,
  heightPx: PropTypes.number,
  fovDegrees: PropTypes.number,
  onSubmit: PropTypes.func,
};

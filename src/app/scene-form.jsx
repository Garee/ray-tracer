import React, { useState } from "react";
import PropTypes from "prop-types";
import "./scene-form.css";

export function SceneForm({ scene, onSubmit }) {
  const [value, setValue] = useState(JSON.stringify(scene, null, 2));

  function onFormSubmit(event) {
    event.preventDefault();
    onSubmit({ sceneJson: value });
  }

  return (
    <form onSubmit={onFormSubmit} className="scene-form">
      <label>
        <span>Scene:</span>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>
      </label>
      <button>Render</button>
    </form>
  );
}

SceneForm.propTypes = {
  scene: PropTypes.object,
  onSubmit: PropTypes.func,
};

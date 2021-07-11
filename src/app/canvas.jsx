import React, { useEffect } from "react";
import PropTypes from "prop-types";

export function AppCanvas({ width, height, frame }) {
  function draw(frame) {
    const el = document.getElementById("canvas");
    const ctx = el.getContext("2d");

    const imageData = ctx.createImageData(frame.width, frame.height);
    frame.scalePixels().forEach((p, i) => {
      const idx = i * 4;
      imageData.data[idx] = p.red;
      imageData.data[idx + 1] = p.green;
      imageData.data[idx + 2] = p.blue;
      imageData.data[idx + 3] = 255;
    });

    ctx.putImageData(imageData, 0, 0);
  }

  useEffect(() => {
    if (frame) {
      draw(frame);
    }
  }, [frame, width, height]);

  return <canvas id="canvas" width={width} height={height}></canvas>;
}

AppCanvas.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  frame: PropTypes.object,
};

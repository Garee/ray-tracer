import React, { useEffect } from "react";
import PropTypes from "prop-types";

export function AppCanvas({ width, height, pixels }) {
  function draw(pixels) {
    const el = document.getElementById("canvas");
    const ctx = el.getContext("2d");

    const imageData = ctx.createImageData(width, height);
    pixels.forEach((p, i) => {
      const idx = i * 4;
      imageData.data[idx] = p.x;
      imageData.data[idx + 1] = p.y;
      imageData.data[idx + 2] = p.z;
      imageData.data[idx + 3] = 255;
    });

    ctx.putImageData(imageData, 0, 0);
  }

  useEffect(() => {
    if (pixels) {
      draw(pixels);
    }
  }, [pixels, width, height]);

  return <canvas id="canvas" width={width} height={height}></canvas>;
}

AppCanvas.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  pixels: PropTypes.array,
};

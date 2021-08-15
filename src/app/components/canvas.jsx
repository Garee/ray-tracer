import React, { useEffect } from "react";
import PropTypes from "prop-types";

export function AppCanvas({ width, height, pixels, scale = 1 }) {
  function draw(pixels) {
    const el = document.getElementById("canvas");
    const ctx = el.getContext("2d");

    const imageData = ctx.createImageData(width, height);
    pixels.forEach(({ red, green, blue, alpha }, i) => {
      const idx = i * 4;
      imageData.data[idx] = red;
      imageData.data[idx + 1] = green;
      imageData.data[idx + 2] = blue;
      imageData.data[idx + 3] = alpha;
    });

    ctx.putImageData(imageData, 0, 0);
  }

  useEffect(() => {
    if (pixels) {
      draw(pixels);
    }
  }, [pixels, width, height, scale]);

  return (
    <canvas
      id="canvas"
      width={width}
      height={height}
      style={{ width: width * scale, height: height * scale }}
    ></canvas>
  );
}

AppCanvas.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  scale: PropTypes.number,
  pixels: PropTypes.array,
};

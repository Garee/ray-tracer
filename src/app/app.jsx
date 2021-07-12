import React, { useState, useEffect } from "react";
import { createWorld, createCamera } from "./scene";
import { raytrace } from "./render";
import { AppCanvas } from "./canvas";
import { Progress } from "./progress";
import { ResolutionForm } from "./resolution-form";

export function App() {
  const [pixels, setPixels] = useState();
  const [progress, setProgress] = useState(0);
  const [world] = useState(createWorld());
  const [canvasWidth, setCanvasWidth] = useState(100);
  const [canvasHeight, setCanvasHeight] = useState(50);
  const [fov] = useState(Math.PI / 3);
  const [camera, setCamera] = useState(
    createCamera(canvasWidth, canvasHeight, fov)
  );
  const [raytracing, setRaytracing] = useState(true);

  function onRowRender(row) {
    setProgress(((row + 1) / camera.width) * 100);
  }

  function onRaytraceComplete({ pixels, workers }) {
    setPixels(pixels);
    workers.forEach((w) => w.terminate());
  }

  function onResolutionFormSubmit({ width, height }) {
    setRaytracing(true);
    setCanvasWidth(width);
    setCanvasHeight(height);
    setCamera(createCamera(width, height, fov));
  }

  useEffect(() => {
    raytrace(world, camera, onRowRender)
      .then(onRaytraceComplete)
      .finally(() => setRaytracing(false));
  }, [world, camera]);

  return (
    <>
      {raytracing ? (
        <Progress percent={progress} />
      ) : (
        <>
          <AppCanvas
            pixels={pixels}
            width={canvasWidth}
            height={canvasHeight}
          />
          <ResolutionForm onSubmit={onResolutionFormSubmit} />
        </>
      )}
    </>
  );
}

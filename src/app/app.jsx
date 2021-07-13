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
  const [canvasWidth, setCanvasWidth] = useState(200);
  const [canvasHeight, setCanvasHeight] = useState(100);
  const [fov, setFov] = useState(67.5);
  const [camera, setCamera] = useState(
    createCamera(canvasWidth, canvasHeight, fov)
  );
  const [raytracing, setRaytracing] = useState(true);

  let tracedRows = 0;
  function onRowRender() {
    tracedRows++;
    setProgress(Math.min((tracedRows / camera.height) * 100, 100));
  }

  function onRaytraceComplete({ pixels, workers }) {
    setPixels(pixels);
    workers.forEach((w) => w.terminate());
  }

  function onResolutionFormSubmit({ width, height, fov }) {
    setRaytracing(true);
    setCanvasWidth(width);
    setCanvasHeight(height);
    setFov(fov);
    setCamera(createCamera(width, height, fov));
  }

  useEffect(() => {
    raytrace(world, camera, onRowRender)
      .then(onRaytraceComplete)
      .finally(() => {
        setProgress(0);
        setRaytracing(false);
      });
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
          <ResolutionForm
            widthPx={canvasWidth}
            heightPx={canvasHeight}
            fovDegrees={fov}
            onSubmit={onResolutionFormSubmit}
          />
        </>
      )}
    </>
  );
}

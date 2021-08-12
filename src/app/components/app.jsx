import React, { useState, useEffect } from "react";
import { defaultScene } from "../io/scene";
import { raytrace } from "../lib/render";
import { AppCanvas } from "./canvas";
import { Progress } from "./progress";
import { SceneForm } from "./scene-form";
import "./app.css";

export function App() {
  const [scene, setScene] = useState(defaultScene);
  const [raytracing, setRaytracing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pixels, setPixels] = useState();

  let tracedRows = 0;
  function onRowRender() {
    tracedRows++;
    setProgress(Math.min((tracedRows / scene.camera.height) * 100, 100));
  }

  function onRaytraceComplete({ pixels, workers }) {
    setPixels(pixels);
    workers?.forEach((w) => w.terminate());
  }

  function onSceneFormSubmit({ sceneJson }) {
    try {
      setScene(JSON.parse(sceneJson));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setRaytracing(true);
    raytrace(scene, onRowRender)
      .then(onRaytraceComplete)
      .finally(() => {
        setProgress(0);
        setRaytracing(false);
      });
  }, [scene]);

  return (
    <>
      {raytracing ? (
        <Progress percent={progress} />
      ) : (
        <>
          <AppCanvas
            pixels={pixels}
            width={scene.camera.width}
            height={scene.camera.height}
          />
          <SceneForm scene={scene} onSubmit={onSceneFormSubmit} />
        </>
      )}
    </>
  );
}

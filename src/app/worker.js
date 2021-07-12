import { createWorld, createCamera } from "./scene";

onmessage = function (e) {
  const { from, to, width, height, fov } = e.data;

  function onRowRender(row) {
    postMessage({ row });
  }

  const world = createWorld();
  const camera = createCamera(width, height, fov);
  const frame = camera.render(world, onRowRender, from, to);
  const pixels = frame.scalePixels();

  postMessage({ from, to, pixels });
};

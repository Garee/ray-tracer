import { SceneParser } from "../io/scene-parser";

onmessage = function (e) {
  const { scene, from, to } = e.data;

  function onRowRender(row) {
    postMessage({ row });
  }

  const [camera, world] = SceneParser.parse(scene);
  const frame = camera.render(world, onRowRender, from, to);
  const pixels = frame.toRgba();

  postMessage({ from, to, pixels });
};

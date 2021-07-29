import { ObjParser } from "../io/obj-parser";
import { createWorld, createCamera } from "./scene";

onmessage = function (e) {
  const { from, to, width, height, fov, raw } = e.data;

  function onRowRender(row) {
    postMessage({ row });
  }

  const root = ObjParser.of(raw).toGroup();
  const world = createWorld([root]);
  const camera = createCamera(width, height, fov);
  const frame = camera.render(world, onRowRender, from, to);
  const pixels = frame.toRgba();

  postMessage({ from, to, pixels });
};

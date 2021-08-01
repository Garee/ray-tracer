import { toDegrees } from "../util/maths";

export async function raytrace(world, camera, onRowRender) {
  console.time("Raytracing");
  if (!window.Worker) {
    console.info(`Web workers are not supported by this browser.`);
    return camera.render(world, onRowRender);
  }

  const batches = [];

  return new Promise((resolve) => {
    const nworkers = navigator.hardwareConcurrency || 4;
    console.debug(`Spawning ${nworkers} web workers.`);

    const workers = new Array(nworkers).fill().map((_, i) => {
      const n = i + 1;
      console.debug(`Spawning worker ${n}.`);

      const worker = new Worker("worker.js");

      const rowBatchSize = Math.ceil(camera.height / nworkers);
      const toRow = rowBatchSize * n;
      const fromRow = toRow - rowBatchSize;

      worker.postMessage({
        from: fromRow,
        to: toRow,
        width: camera.width,
        height: camera.height,
        fov: toDegrees(camera.fov),
      });

      worker.onmessage = ({ data }) => {
        if (data.pixels) {
          console.debug(
            `Web worker ${n} finished tracing rows ${data.from}-${data.to}.`
          );

          batches.push({
            from: data.from * camera.width,
            to: data.to * camera.width,
            pixels: data.pixels.slice(
              data.from * camera.width,
              data.to * camera.width
            ),
          });

          if (batches.length === nworkers) {
            const framePixels = batches
              .sort((a, b) => a.from - b.from)
              .reduce((acc, b) => acc.concat(b.pixels), []);

            console.timeEnd("Raytracing");
            resolve({ pixels: framePixels, workers });
          }
        } else {
          onRowRender(data.row);
        }
      };

      return worker;
    });
  });
}

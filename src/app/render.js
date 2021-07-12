export function raytrace(world, camera, onRowRender) {
  if (!window.Worker) {
    return camera.renderAsync(world, onRowRender);
  }

  return new Promise((resolve) => {
    const nworkers = 1; //navigator.hardwareConcurrency || 4;
    console.debug(`Spawning ${nworkers} web workers.`);

    const workers = new Array({ length: nworkers }).map((_, i) => {
      console.debug(`Spawning worker ${i + 1}.`);

      const worker = new Worker("worker.js");

      worker.postMessage({
        width: camera.width,
        height: camera.height,
        fov: camera.fov,
      });

      worker.onmessage = ({ data }) => {
        const { pixels, row } = data;
        if (pixels) {
          console.debug(`Web worker ${i + 1} complete.`);
          const { pixels } = data;
          resolve({ pixels, workers });
        } else {
          onRowRender(row);
        }
      };

      return worker;
    });
  });
}

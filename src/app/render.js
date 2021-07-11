export function raytrace(world, camera, onRowRender) {
  return camera.renderAsync(world, onRowRender);
}

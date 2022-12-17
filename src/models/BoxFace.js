import * as THREE from "three";

export default class BoxFace {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  createBoxDielineFace(color, x, y, z, s) {
    const squareShape = new THREE.Shape()
      .moveTo(0, 0)
      .lineTo(0, this.height)
      .lineTo(this.width, this.height)
      .lineTo(this.width, 0);

    squareShape.autoClose = true;

    const points = squareShape.getPoints();

    const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

    // solid line
    let line = new THREE.Line(
      geometryPoints,
      new THREE.LineBasicMaterial({ color: color, linewidth: 2 })
    );
    line.position.set(x, y, z - 25);
    line.scale.set(s, s, s);

    return line;
  }
}

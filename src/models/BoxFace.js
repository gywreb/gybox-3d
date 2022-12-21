import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

export default class BoxFace {
  constructor(width, height, thickness, name) {
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.name = name || "";
  }

  createLengthDefineLine(color, x, y, z) {
    const width = this.width;
    const lengthDefineLine = new THREE.Group();
    const lineShape = new THREE.Shape().moveTo(0, 0).lineTo(this.width, 0);

    const points = lineShape.getPoints();
    const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

    let line = new THREE.Line(
      geometryPoints,
      new THREE.LineBasicMaterial({ color: color })
    );
    line.position.set(x, y, z - 25);

    lengthDefineLine.add(line);

    const fontLoader = new FontLoader();

    fontLoader.load(
      "/src/assets/fonts/helvetiker_regular.typeface.json",
      function (font) {
        const geometry = new TextGeometry(`L : ${width} mm`, {
          font: font,
          size: 12,
          height: 5,
          curveSegments: 10,
          bevelEnabled: false,
        });
        const material = new THREE.LineBasicMaterial({ color: color });
        const textMesh = new THREE.Mesh(geometry, material);

        textMesh.position.set(x + width / 3, y + 10, z - 25);

        lengthDefineLine.add(textMesh);
      }
    );

    return lengthDefineLine;
  }

  createWidthDefineLine(color, x, y, z) {
    const height = this.height;
    const width = this.width;

    const lengthDefineLine = new THREE.Group();
    const lineShape = new THREE.Shape().moveTo(0, 0).lineTo(0, this.height);

    const points = lineShape.getPoints();
    const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

    let line = new THREE.Line(
      geometryPoints,
      new THREE.LineBasicMaterial({ color: color })
    );
    line.position.set(x + width / 1.5, y, z - 25);

    lengthDefineLine.add(line);

    const fontLoader = new FontLoader();

    fontLoader.load(
      "/src/assets/fonts/helvetiker_regular.typeface.json",
      function (font) {
        const geometry = new TextGeometry(`W : ${height} mm`, {
          font: font,
          size: 12,
          height: 5,
          curveSegments: 10,
          bevelEnabled: false,
        });
        const material = new THREE.LineBasicMaterial({ color: color });
        const textMesh = new THREE.Mesh(geometry, material);

        textMesh.position.set(x + width / 1.6, y + height / 2, z - 25);

        lengthDefineLine.add(textMesh);
      }
    );

    return lengthDefineLine;
  }

  createHeightDefineLine(color, x, y, z) {
    const height = this.height;
    const width = this.width;

    const lengthDefineLine = new THREE.Group();
    const lineShape = new THREE.Shape().moveTo(0, 0).lineTo(0, this.height);

    const points = lineShape.getPoints();
    const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

    let line = new THREE.Line(
      geometryPoints,
      new THREE.LineBasicMaterial({ color: color })
    );
    line.position.set(x + width / 2, y, z - 25);

    lengthDefineLine.add(line);

    const fontLoader = new FontLoader();

    fontLoader.load(
      "/src/assets/fonts/helvetiker_regular.typeface.json",
      function (font) {
        const geometry = new TextGeometry(`H : ${height} mm`, {
          font: font,
          size: 12,
          height: 5,
          curveSegments: 10,
          bevelEnabled: false,
        });
        const material = new THREE.LineBasicMaterial({ color: color });
        const textMesh = new THREE.Mesh(geometry, material);

        textMesh.position.set(x + width / 2.5, y + height / 2, z - 25);

        lengthDefineLine.add(textMesh);
      }
    );

    return lengthDefineLine;
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
      new THREE.LineBasicMaterial({ color: color })
    );
    line.position.set(x, y, z - 25);
    line.scale.set(s, s, s);

    return line;
  }

  createBox3dFace({ texture, color }, x, y, z, rx, ry, rz) {
    const squareShape = new THREE.Shape();

    squareShape
      .moveTo(0, 0)
      .lineTo(0, this.height)
      .lineTo(this.width, this.height)
      .lineTo(this.width, 0);

    const extrudeSettings = {
      depth: this.thickness || 3,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 1,
      bevelThickness: 1,
    };

    let faceTexture;

    if (texture?.length) {
      faceTexture = new THREE.TextureLoader().load(texture);
      faceTexture.wrapS = faceTexture.wrapT = THREE.RepeatWrapping;
      faceTexture.repeat.set(0.005, 0.005);
    }

    const geometry = new THREE.ExtrudeGeometry(squareShape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial(
      texture?.length
        ? {
            map: faceTexture,
            side: THREE.DoubleSide,
          }
        : { color: color }
    );
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z - 75);
    mesh.rotation.set(
      THREE.MathUtils.degToRad(rx || 0),
      THREE.MathUtils.degToRad(ry || 0),
      THREE.MathUtils.degToRad(rz || 0)
    );
    mesh.receiveShadow = true;
    mesh.name = this.name;

    return mesh;
  }
}

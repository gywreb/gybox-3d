import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default class BoxFaceLayers {
  constructor(width, height, thickness, folds, name, pivotTranslate) {
    this.width = width;
    this.height = height;
    // thickness in mm
    this.thickness = thickness / 10;
    this.waveFreq = 3;

    this.folds = folds || [false, false, false, false];
    // top edge: Z -> 0 when y -> plane height,
    // right edge: Z -> 0 when x -> plane width,
    // bottom edge: Z -> 0 when y -> 0,
    // left edge: Z -> 0 when x -> 0
    this.name = name || "";
    this.pivotTranslate = pivotTranslate || [0, 0, 0];
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
      "/assets/fonts/helvetiker_regular.typeface.json",
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
      "/assets/fonts/helvetiker_regular.typeface.json",
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
      "/assets/fonts/helvetiker_regular.typeface.json",
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

  // create fold effect at the edge of box face
  applyLayerFolds(x, y, z) {
    let modifier = (c, s) => 1 - Math.pow(c / (0.5 * s), 10);
    if ((x > 0 && this.folds[1]) || (x < 0 && this.folds[3])) {
      z *= modifier(x, this.width * 2);
    }
    if ((y > 0 && this.folds[0]) || (y < 0 && this.folds[2])) {
      z *= modifier(y, this.height);
    }
    return z;
  }

  // create box face from 3 layer: front, mid, back
  createLayerGeometry(baseGeometry, offset) {
    const layerGeometry = baseGeometry.clone();
    const layerPositions = layerGeometry.attributes.position;
    layerGeometry.attributes.position.needsUpdate = true;
    for (let index = 0; index < layerPositions.count; index++) {
      let x = layerPositions.getX(index);
      let y = layerPositions.getY(index);
      let z = layerPositions.getZ(index) + offset(x);
      z = this.applyLayerFolds(x, y, z);
      layerPositions.setXYZ(index, x, y, z);
    }
    return layerGeometry;
  }

  createLayerTopGeometry(baseGeometry) {
    const geometriesToMerge = [];
    geometriesToMerge.push(
      this.createLayerGeometry(
        baseGeometry,
        (v) => 0.5 * this.thickness + 0.01 * Math.sin(this.waveFreq * v)
      )
    );
    const mergedGeometry = new mergeBufferGeometries(geometriesToMerge, false);
    mergedGeometry.computeVertexNormals();
    return mergedGeometry;
  }

  createLayerBottomGeometry(baseGeometry) {
    const geometriesToMerge = [];
    geometriesToMerge.push(
      this.createLayerGeometry(
        baseGeometry,
        (v) => -0.5 * this.thickness + 0.01 * Math.sin(this.waveFreq * v)
      )
    );
    const mergedGeometry = new mergeBufferGeometries(geometriesToMerge, false);
    mergedGeometry.computeVertexNormals();
    return mergedGeometry;
  }

  createLayerMidGeometry(baseGeometry) {
    const geometriesToMerge = [];
    geometriesToMerge.push(
      this.createLayerGeometry(
        baseGeometry,
        (v) => 0.5 * this.thickness * Math.sin(this.waveFreq * v)
      )
    );
    const mergedGeometry = new mergeBufferGeometries(geometriesToMerge, false);
    mergedGeometry.computeVertexNormals();
    return mergedGeometry;
  }

  createBox3dFace({
    texture,
    color,
    position: { x, y, z },
    rotation: { rx, ry, rz },
  }) {
    const boxFaceStructure = {
      layer: new THREE.Group(),
      layerTop: new THREE.Mesh(),
      layerMid: new THREE.Mesh(),
      layerBottom: new THREE.Mesh(),
    };

    const baseGeometry = new THREE.PlaneGeometry(
      this.width,
      this.height,
      Math.floor(5 * this.width),
      Math.floor(0.2 * this.height)
    );

    let faceTexture;

    if (texture?.length) {
      faceTexture = new THREE.TextureLoader().load(texture);
    }

    const midLayerTexture = new THREE.TextureLoader().load(
      "/assets/textures/boxmid.jpg"
    );

    const material = new THREE.MeshStandardMaterial(
      texture?.length
        ? {
            map: faceTexture,
            side: THREE.DoubleSide,
          }
        : { color: color, side: THREE.DoubleSide }
    );
    const midMaterial = new THREE.MeshStandardMaterial({
      map: midLayerTexture,
      side: THREE.DoubleSide,
    });

    boxFaceStructure.layerTop.geometry =
      this.createLayerTopGeometry(baseGeometry);
    boxFaceStructure.layerMid.geometry =
      this.createLayerMidGeometry(baseGeometry);
    boxFaceStructure.layerBottom.geometry =
      this.createLayerBottomGeometry(baseGeometry);

    boxFaceStructure.layerBottom.material = material;
    boxFaceStructure.layerMid.material = midMaterial;
    boxFaceStructure.layerTop.material = material;

    // move pivot rotate point
    boxFaceStructure.layerTop.geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(...this.pivotTranslate)
    );
    boxFaceStructure.layerMid.geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(...this.pivotTranslate)
    );
    boxFaceStructure.layerBottom.geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(...this.pivotTranslate)
    );

    boxFaceStructure.layer.add(
      boxFaceStructure.layerTop,
      boxFaceStructure.layerMid,
      boxFaceStructure.layerBottom
    );

    boxFaceStructure.layer.position.set(x, y, z);
    boxFaceStructure.layer.rotation.set(
      THREE.MathUtils.degToRad(rx || 0),
      THREE.MathUtils.degToRad(ry || 0),
      THREE.MathUtils.degToRad(rz || 0)
    );
    boxFaceStructure.layer.receiveShadow = true;
    boxFaceStructure.layer.castShadow = true;

    boxFaceStructure.layer.name = this.name;

    return boxFaceStructure.layer;
  }
}

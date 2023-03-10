import * as THREE from "three";
import { MathUtils, Mesh, Shape } from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getDefaultRectangleShape, SHAPE_TYPES } from "../constants/constants";
export default class BoxFace {
  constructor(width, height, thickness, folds, name, pivotTranslate, shapes) {
    this.width = width;
    this.height = height;
    this.thickness = thickness / 10;
    this.folds = folds || [];
    this.name = name || "";
    this.pivotTranslate = pivotTranslate || [0, 0, 0];
    this.shapes = shapes || getDefaultRectangleShape(width, height);
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

  drawShape(shape, { type, coordinates }) {
    switch (type) {
      case SHAPE_TYPES.LINE: {
        shape.lineTo(
          coordinates[0] || 0, // x
          coordinates[1] || 0 // y
        );
        break;
      }
      case SHAPE_TYPES.BEZIER_CURVE: {
        shape.bezierCurveTo(
          coordinates[0] || 0,
          coordinates[1] || 0,
          coordinates[2] || 0,
          coordinates[3] || 0,
          coordinates[4] || 0,
          coordinates[5] || 0
        );
        break;
      }
      case SHAPE_TYPES.ABS_ARC: {
        shape.absarc(
          coordinates[0] || 0,
          coordinates[1] || 0,
          coordinates[2] || 0,
          coordinates[3] || 0,
          coordinates[4] || 0,
          true
        );
        break;
      }
      case SHAPE_TYPES.QUADRATIC_CURVE: {
        shape.quadraticCurveTo(
          coordinates[0] || 0,
          coordinates[1] || 0,
          coordinates[2] || 0,
          coordinates[3] || 0
        );
        break;
      }
      default:
        break;
    }
  }

  createBoxDielineFace({
    color,
    positions = [0, 0, 0],
    rotations = [0, 0, 0],
  }) {
    const boxFaceShape = new THREE.Shape();
    // initialize the starting point
    boxFaceShape.moveTo(0, 0);

    this.shapes.map((shape) => {
      this.drawShape(boxFaceShape, {
        type: shape.type,
        coordinates: shape.coordinates,
      });
    });

    boxFaceShape.autoClose = true;

    const points = boxFaceShape.getPoints();

    const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

    // solid line
    let line = new THREE.Line(
      geometryPoints,
      new THREE.LineBasicMaterial({ color: color })
    );
    line.position.set(positions[0], positions[1], positions[2] - 25);
    line.rotation.set(...rotations.map((point) => MathUtils.degToRad(point)));
    // line.scale.set(s, s, s);

    return line;
  }

  // create fold effect at the edge of box face
  createFoldLine(
    foldSize,
    foldPivotTranslation,
    foldPositions,
    foldRotation,
    foldMainMaterial,
    foldBevelMaterial
  ) {
    const archShape = new THREE.Shape();

    const archExtrudeSetting = {
      depth: foldSize,
      bevelEnabled: true,
      material: 0,
      extrudeMaterial: 1,
    };

    archShape.arc(
      0,
      0,
      this.thickness * 0.75,
      0,
      MathUtils.degToRad(180),
      true
    );

    const archGeometry = new THREE.ExtrudeGeometry(
      archShape,
      archExtrudeSetting
    );

    const archMesh = new Mesh(archGeometry, [
      foldMainMaterial,
      foldBevelMaterial,
    ]);

    archGeometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(...foldPivotTranslation)
    );

    archMesh.rotation.set(
      ...foldRotation.map((angle) => MathUtils.degToRad(angle))
    );

    archMesh.position.set(...foldPositions);

    return archMesh;
  }

  // create box face from 3 layer: front, mid, back
  createLayerGeometry(baseGeometry, offset) {
    const layerGeometry = baseGeometry.clone();
    const layerPositions = layerGeometry.attributes.position;
    for (let index = 0; index < layerPositions.count; index++) {
      let x = layerPositions.getX(index);
      let y = layerPositions.getY(index);
      let z = layerPositions.getZ(index) + offset;
      layerPositions.setXYZ(index, x, y, z);
    }
    return layerGeometry;
  }

  createLayerTopGeometry(baseGeometry) {
    const geometriesToMerge = [];
    geometriesToMerge.push(
      this.createLayerGeometry(baseGeometry, -this.thickness)
    );
    const mergedGeometry = new mergeBufferGeometries(geometriesToMerge, false);
    mergedGeometry.computeVertexNormals();
    return mergedGeometry;
  }

  createLayerBottomGeometry(baseGeometry) {
    const geometriesToMerge = [];
    geometriesToMerge.push(
      this.createLayerGeometry(baseGeometry, this.thickness)
    );
    const mergedGeometry = new mergeBufferGeometries(geometriesToMerge, false);
    mergedGeometry.computeVertexNormals();
    return mergedGeometry;
  }

  createLayerMidGeometry(baseGeometry) {
    const geometriesToMerge = [];
    geometriesToMerge.push(
      this.createLayerGeometry(baseGeometry, -this.thickness / 2)
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

    const boxFaceShape = new THREE.Shape();
    // initialize the starting point
    boxFaceShape.moveTo(0, 0);

    this.shapes.map((shape) => {
      this.drawShape(boxFaceShape, {
        type: shape.type,
        coordinates: shape.coordinates,
      });
    });

    boxFaceShape.autoClose = true;

    const sideLayerExtrudeSettings = {
      depth: 0,
      bevelEnabled: false,
    };

    const midLayerExtrudeSetting = {
      depth: this.thickness,
      bevelEnabled: true,
      material: 0,
      extrudeMaterial: 1,
    };

    let faceTexture;

    const midLayerTexture = new THREE.TextureLoader().load(
      "/assets/textures/boxmid.jpg"
    );
    midLayerTexture.wrapS = midLayerTexture.wrapT = THREE.RepeatWrapping;
    midLayerTexture.repeat.set(0.05, 0.8);

    const bottomLayerTexture = new THREE.TextureLoader().load(
      "/assets/textures/cardboard.jpg"
    );
    bottomLayerTexture.wrapS = bottomLayerTexture.wrapT = THREE.RepeatWrapping;
    bottomLayerTexture.repeat.set(0.005, 0.01);

    if (texture?.length) {
      faceTexture = new THREE.TextureLoader().load(texture);
      faceTexture.wrapS = faceTexture.wrapT = THREE.RepeatWrapping;
      faceTexture.repeat.set(0.005, 0.01);
    }

    const sideLayerGeometry = new THREE.ExtrudeGeometry(
      boxFaceShape,
      sideLayerExtrudeSettings
    );

    const midLayerGeometry = new THREE.ExtrudeGeometry(
      boxFaceShape,
      midLayerExtrudeSetting
    );

    const sideLayerMaterial = new THREE.MeshStandardMaterial(
      texture?.length
        ? {
            map: faceTexture,
            side: THREE.DoubleSide,
          }
        : { color: color }
    );

    const bottomLayerMaterial = new THREE.MeshStandardMaterial({
      map: bottomLayerTexture,
      side: THREE.DoubleSide,
    });

    const midLayerMaterial = new THREE.MeshStandardMaterial({
      map: midLayerTexture,
      side: THREE.DoubleSide,
    });

    boxFaceStructure.layerBottom.material = bottomLayerMaterial;
    boxFaceStructure.layerMid.material = midLayerMaterial;
    boxFaceStructure.layerTop.material = sideLayerMaterial;

    boxFaceStructure.layerTop.geometry =
      this.createLayerTopGeometry(sideLayerGeometry);
    boxFaceStructure.layerMid.geometry =
      this.createLayerMidGeometry(midLayerGeometry);
    boxFaceStructure.layerBottom.geometry =
      this.createLayerBottomGeometry(sideLayerGeometry);

    boxFaceStructure.layerMid = new THREE.Mesh(midLayerGeometry, [
      sideLayerMaterial,
      midLayerMaterial,
    ]);

    boxFaceStructure.layerMid.translateZ(-this.thickness / 2);

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

    this.folds.forEach((fold) => {
      if (fold) {
        const foldMesh = this.createFoldLine(
          fold.width,
          fold.pivotTranslation || [0, 0, 0],
          fold.position || [0, 0, 0],
          fold.rotate || [0, 0, 0],
          midLayerMaterial,
          sideLayerMaterial
        );
        boxFaceStructure.layer.add(foldMesh);
      }
    });

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

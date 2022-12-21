import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { BOX_FACE_NAMES, MATERIALS } from "../../constants/constants";
import BoxFace from "../../models/BoxFace";
import * as TWEEN from "@tweenjs/tween.js";
import { MathUtils } from "three";
import { isEmpty } from "lodash";

const BoxAnimation = ({
  length,
  width,
  height,
  thickness = 0.5,
  faceColor = 0xba7b13,
  faceTexture = MATERIALS.CARDBOARD,
}) => {
  const groupRef = useRef();
  const [boxFaces, setBoxFaces] = useState({});

  useEffect(() => {
    const bottomFace = renderBottomFace();
    const bottomLeftFace = renderBottomLeftFace();
    const bottomRightFace = renderBottomRightFace();
    const belowFrontFace = renderBelowFrontFace();
    const upperFrontFace = renderUpperFrontFace();
    const upperFace = renderUpperFace();

    groupRef.current?.clear();
    groupRef.current?.add(
      bottomFace,
      bottomLeftFace,
      bottomRightFace,
      belowFrontFace,
      upperFrontFace,
      upperFace
    );

    if (groupRef.current?.children.length) {
      setBoxFaces(
        groupRef.current?.children.reduce((boxFacesAcc, currentMesh) => {
          boxFacesAcc[currentMesh.name] = currentMesh;
          return boxFacesAcc;
        }, {})
      );
    }
  }, [length, width, height, faceColor, faceTexture, thickness]);

  useFrame(() => {
    boxFaces[BOX_FACE_NAMES.UPPER].rotation.x = startFaceFolding(
      BOX_FACE_NAMES.UPPER,
      boxFaces[BOX_FACE_NAMES.UPPER].rotation.x,
      MathUtils.degToRad(90)
    );

    boxFaces[BOX_FACE_NAMES.UPPER].position.z = startFaceFolding(
      BOX_FACE_NAMES.UPPER,
      boxFaces[BOX_FACE_NAMES.UPPER].position.z,
      // circle arch formula
      height - 75
    );

    boxFaces[BOX_FACE_NAMES.BELOW_FRONT].rotation.x = startFaceFolding(
      BOX_FACE_NAMES.BELOW_FRONT,
      boxFaces[BOX_FACE_NAMES.BELOW_FRONT].rotation.x,
      MathUtils.degToRad(90)
    );
  });

  const startFaceFolding = (name, from, to, delay = 0.01) => {
    if (boxFaces[name]) {
      return MathUtils.lerp(from, to, delay);
    }
  };

  const renderBottomFace = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      thickness,
      BOX_FACE_NAMES.BOTTOM
    ); // width + height of box shape;
    // x: x postion, y: y postion, z: z position, scale: scale factor
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      -length / 2,
      -width / 2 + thickness,
      0,
      0,
      0,
      0,
      1
    );
  };

  const renderBottomLeftFace = () => {
    const boxFaceController = new BoxFace(
      height,
      width,
      thickness,
      BOX_FACE_NAMES.BOTTOM_LEFT
    );
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      -length / 2 - height,
      -width / 2,
      0,
      0,
      0,
      0,
      1
    );
  };

  const renderBottomRightFace = () => {
    const boxFaceController = new BoxFace(
      height,
      width,
      thickness,
      BOX_FACE_NAMES.BOTTOM_RIGHT
    );
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      length / 2,
      -width / 2,
      0,
      0,
      0,
      0,
      1
    );
  };

  const renderBelowFrontFace = () => {
    const boxFaceController = new BoxFace(
      length,
      height,
      thickness,
      BOX_FACE_NAMES.BELOW_FRONT
    );
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      -length / 2,
      width / 2,
      0,
      0,
      0,
      0,
      1
    );
  };
  const renderUpperFrontFace = () => {
    const boxFaceController = new BoxFace(
      length,
      height,
      thickness,
      BOX_FACE_NAMES.UPPER_FRONT
    );
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      -length / 2,
      -width / 2 - height,
      0,
      0,
      0,
      0,
      1
    );
  };

  const renderUpperFace = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      thickness,
      BOX_FACE_NAMES.UPPER
    );
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      -length / 2,
      width / 2 + height,
      0,
      0,
      0,
      0,
      1
    );
  };

  return <group ref={groupRef}></group>;
};

export default BoxAnimation;

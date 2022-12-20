import React, { useEffect, useRef } from "react";
import { MATERIALS } from "../../constants/constants";
import BoxFace from "../../models/BoxFace";

const Box3d = ({
  length,
  width,
  height,
  thickness = 0.5,
  faceColor = 0xba7b13,
  faceTexture = MATERIALS.CARDBOARD,
}) => {
  const groupRef = useRef();

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
  }, [length, width, height, faceColor, faceTexture, thickness]);

  const renderBottomFace = () => {
    const boxFaceController = new BoxFace(length, width, thickness); // width + height of box shape;
    // x: x postion, y: y postion, z: z position, scale: scale factor
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      -length / 2,
      -width / 2 + thickness,
      0,
      90,
      0,
      0,
      1
    );
  };

  const renderBottomLeftFace = () => {
    const boxFaceController = new BoxFace(height, width, thickness);
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      -length / 2,
      -width / 2,
      0,
      90,
      90,
      0,
      1
    );
  };

  const renderBottomRightFace = () => {
    const boxFaceController = new BoxFace(height, width, thickness);
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      length / 2 - thickness,
      -width / 2,
      0,
      90,
      90,
      0,
      1
    );
  };

  const renderBelowFrontFace = () => {
    const boxFaceController = new BoxFace(length, height, thickness);
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      -length / 2,
      -width / 2,
      0,
      -360,
      0,
      0,
      1
    );
  };
  const renderUpperFrontFace = () => {
    const boxFaceController = new BoxFace(length, height, thickness);
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      -length / 2,
      -width / 2,
      width - thickness,
      0,
      0,
      0,
      1
    );
  };

  const renderUpperFace = () => {
    const boxFaceController = new BoxFace(length, width, thickness);
    return boxFaceController.createBox3dFace(
      { texture: faceTexture, color: faceColor },
      -length / 2,
      -width / 2 + height,
      0,
      90,
      0,
      0,
      1
    );
  };

  return <group ref={groupRef}></group>;
};

export default Box3d;

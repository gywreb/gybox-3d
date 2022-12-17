import React, { useEffect, useRef } from "react";
import BoxFace from "../../models/BoxFace";

const BoxDieline = ({ length, width, height }) => {
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
  }, [length, width, height]);

  const renderBottomFace = () => {
    const boxFaceController = new BoxFace(length, width); // width + height of box shape;
    // x: x postion, y: y postion, z: z position, scale: scale factor
    return boxFaceController.createBoxDielineFace(
      0x804000,
      -length / 2,
      -width / 2,
      0,
      1
    );
  };

  const renderBottomLeftFace = () => {
    const boxFaceController = new BoxFace(height, width);
    return boxFaceController.createBoxDielineFace(
      0x804000,
      -length / 2 - height,
      -width / 2,
      0,
      1
    );
  };

  const renderBottomRightFace = () => {
    const boxFaceController = new BoxFace(height, width);
    return boxFaceController.createBoxDielineFace(
      0x804000,
      length / 2,
      -width / 2,
      0,
      1
    );
  };

  const renderBelowFrontFace = () => {
    const boxFaceController = new BoxFace(length, height);
    return boxFaceController.createBoxDielineFace(
      0x804000,
      -length / 2,
      width / 2,
      0,
      1
    );
  };
  const renderUpperFrontFace = () => {
    const boxFaceController = new BoxFace(length, height);
    return boxFaceController.createBoxDielineFace(
      0x804000,
      -length / 2,
      -width / 2 - height,
      0,
      1
    );
  };

  const renderUpperFace = () => {
    const boxFaceController = new BoxFace(length, width);
    return boxFaceController.createBoxDielineFace(
      0x804000,
      -length / 2,
      width / 2 + height,
      0,
      1
    );
  };

  return <group ref={groupRef}></group>;
};

export default BoxDieline;

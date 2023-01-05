import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import {
  getRoundedFlapShape,
  getRoundedFlapTrapezoldShape,
  getSampleFlapShape,
  SAMPLE_FACE_RADIUS,
} from "../../constants/constants";
import BoxFace from "../../models/BoxFace";

const BoxDieline = ({ length, width, height, thickness, lineColor }) => {
  const groupRef = useRef();

  useEffect(() => {
    const bottomFace = renderBottomFace();
    const bottomLeftFace = renderBottomLeftFace();
    const bottomRightFace = renderBottomRightFace();
    const belowFrontFace = renderBelowFrontFace();
    const upperFrontFace = renderUpperFrontFace();
    const upperFace = renderUpperFace();
    const lengthDefineLine = renderLengthDefineLine();
    const widthDefineLine = renderWidthDefineLine();
    const heightDefineLine = renderHeightDefineLine();

    // flap generate
    const upperFrontLeftFlap = renderUpperFrontLeftFlap();
    const upperFrontRightFlap = renderUpperFrontRightFlap();
    upperFrontFace.add(upperFrontLeftFlap, upperFrontRightFlap);

    const upperRightFlap = renderUpperRightFlap();
    const upperLeftFlap = renderUpperLeftFlap();
    upperFace.add(upperRightFlap, upperLeftFlap);

    groupRef.current?.clear();
    groupRef.current?.add(
      bottomFace,
      bottomLeftFace,
      bottomRightFace,
      belowFrontFace,
      upperFrontFace,
      upperFace,
      lengthDefineLine,
      widthDefineLine,
      heightDefineLine
    );
  }, [length, width, height]);

  useFrame(({ camera }) => {
    camera.position.set(0, 0, 0);
  });

  const renderBottomFace = () => {
    const boxFaceController = new BoxFace(length, width); // width + height of box shape;
    // x: x postion, y: y postion, z: z position, scale: scale factor
    return boxFaceController.createBoxDielineFace({
      color: lineColor,
      positions: [-length / 2, -width / 2, 0],
    });
  };

  const renderBottomLeftFace = () => {
    const boxFaceController = new BoxFace(height, width);
    return boxFaceController.createBoxDielineFace({
      color: lineColor,
      positions: [-length / 2 - height, -width / 2, 0],
    });
  };

  const renderBottomRightFace = () => {
    const boxFaceController = new BoxFace(height, width);
    return boxFaceController.createBoxDielineFace({
      color: lineColor,
      positions: [length / 2, -width / 2, 0],
    });
  };

  const renderBelowFrontFace = () => {
    const boxFaceController = new BoxFace(length, height);
    return boxFaceController.createBoxDielineFace({
      color: lineColor,
      positions: [-length / 2, width / 2, 0],
    });
  };
  const renderUpperFrontFace = () => {
    const boxFaceController = new BoxFace(length - thickness / 2, height);
    return boxFaceController.createBoxDielineFace({
      color: lineColor,
      positions: [-length / 2 + thickness / 4, -width / 2 - height, 0],
    });
  };

  const renderUpperFace = () => {
    const boxFaceController = new BoxFace(length - thickness / 2, width);
    return boxFaceController.createBoxDielineFace({
      color: lineColor,
      positions: [-length / 2 + thickness / 4, width / 2 + height, 0],
    });
  };

  const renderUpperFrontLeftFlap = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      0,
      [],
      "",
      [0, 0, 0],
      getRoundedFlapShape(
        height - thickness * 2,
        height - thickness * 2,
        SAMPLE_FACE_RADIUS
      )
    );
    return boxFaceController.createBoxDielineFace({
      color: lineColor,
      positions: [0, thickness, 0],
      rotations: [0, 180, 0],
    });
  };

  const renderUpperFrontRightFlap = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      0,
      [],
      "",
      [0, 0, 0],
      getRoundedFlapShape(
        height - thickness * 2,
        height - thickness * 2,
        SAMPLE_FACE_RADIUS
      )
    );
    return boxFaceController.createBoxDielineFace({
      color: lineColor,
      positions: [length - thickness / 2, thickness, 0],
      rotations: [0, 0, 0],
    });
  };

  const renderUpperRightFlap = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      0,
      [],
      "",
      [0, 0, 0],
      getRoundedFlapTrapezoldShape(
        height - thickness * 2.5,
        width - thickness * 2 - SAMPLE_FACE_RADIUS,
        SAMPLE_FACE_RADIUS
      )
    );
    return boxFaceController.createBoxDielineFace({
      color: lineColor,
      positions: [length - thickness / 2, thickness + SAMPLE_FACE_RADIUS, 0],
      rotations: [0, 0, 0],
    });
  };

  const renderUpperLeftFlap = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      0,
      [],
      "",
      [0, 0, 0],
      getRoundedFlapTrapezoldShape(
        height - thickness * 2.5,
        width - thickness * 2 - SAMPLE_FACE_RADIUS,
        SAMPLE_FACE_RADIUS
      )
    );
    return boxFaceController.createBoxDielineFace({
      color: lineColor,
      positions: [0, thickness + SAMPLE_FACE_RADIUS, 0],
      rotations: [0, 180, 0],
    });
  };

  const renderLengthDefineLine = () => {
    const boxFaceController = new BoxFace(length, width);
    return boxFaceController.createLengthDefineLine(
      0xfa11f2,
      -length / 2,
      -width / 4,
      0
    );
  };

  const renderWidthDefineLine = () => {
    const boxFaceController = new BoxFace(length, width);
    return boxFaceController.createWidthDefineLine(
      0xfa11f2,
      -length / 3,
      -width / 2,
      0
    );
  };

  const renderHeightDefineLine = () => {
    const boxFaceController = new BoxFace(length, height);
    return boxFaceController.createHeightDefineLine(
      0xfa11f2,
      -length / 3,
      width / 2,
      0
    );
  };

  return <group ref={groupRef}></group>;
};

export default BoxDieline;

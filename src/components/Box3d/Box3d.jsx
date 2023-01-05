import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { MATERIALS } from "../../constants/constants";
import BoxFaceLayers from "../../models/BoxFaceLayers";

const Box3d = ({
  length,
  width,
  height,
  thickness = 10,
  faceColor = 0xba7b13,
  faceTexture = MATERIALS.CARDBOARD,
  isPreviewMockup,
  lightGroup,
  is3dRenderMode,
}) => {
  const groupRef = useRef();
  const { camera } = useThree();
  // useHelper(lightHolder, PointLightHelper, 10, "cyan");
  // useHelper(sideLight, PointLightHelper, 10, "red");

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
  }, [
    length,
    width,
    height,
    faceColor,
    faceTexture,
    thickness,
    isPreviewMockup,
  ]);

  useFrame(({ camera }) => {
    lightGroup.current.quaternion.copy(camera.quaternion);
  });

  useEffect(() => {
    if (is3dRenderMode) {
      camera.position.set(300, 200, 700);
    } else camera.position.set(0, 0, 0);
  }, [isPreviewMockup, is3dRenderMode]);

  const renderBottomFace = () => {
    const boxFaceController = new BoxFaceLayers(length, width, thickness, [
      true,
      true,
      true,
      true,
    ]); // width + height of box shape;
    // x: x postion, y: y postion, z: z position, scale: scale factor
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      rotation: {
        rx: 90,
        ry: 0,
        rz: 0,
      },
    });
  };

  const renderBottomLeftFace = () => {
    const boxFaceController = new BoxFaceLayers(height, width, thickness, [
      false,
      false,
      false,
      true,
    ]);
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: -length / 2,
        y: height / 2,
        z: 0,
      },
      rotation: {
        rx: 90,
        ry: 90,
        rz: 0,
      },
    });
  };

  const renderBottomRightFace = () => {
    const boxFaceController = new BoxFaceLayers(height, width, thickness, [
      false,
      false,
      false,
      true,
    ]);
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: length / 2,
        y: height / 2,
        z: 0,
      },
      rotation: {
        rx: 90,
        ry: 90,
        rz: 0,
      },
    });
  };

  const renderBelowFrontFace = () => {
    const boxFaceController = new BoxFaceLayers(length, height, thickness, [
      true,
      false,
      true,
      false,
    ]);
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: 0,
        y: height / 2,
        z: -width / 2,
      },
      rotation: {
        rx: -360,
        ry: 0,
        rz: 0,
      },
    });
  };
  const renderUpperFrontFace = () => {
    const boxFaceController = new BoxFaceLayers(length, height, thickness, [
      false,
      false,
      true,
      false,
    ]);
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: 0,
        y: height / 2,
        z: width / 2,
      },
      rotation: {
        rx: 0,
        ry: 0,
        rz: 0,
      },
    });
  };

  const renderUpperFace = () => {
    const boxFaceController = new BoxFaceLayers(length, width, thickness, [
      false,
      false,
      true,
      false,
    ]);
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: 0,
        y: height,
        z: 0,
      },
      rotation: {
        rx: isPreviewMockup ? 45 : 90,
        ry: 0,
        rz: 0,
      },
    });
  };

  return <group ref={groupRef}></group>;
};

export default Box3d;

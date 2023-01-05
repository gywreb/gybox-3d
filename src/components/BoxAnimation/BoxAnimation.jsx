import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { BOX_FACE_NAMES, MATERIALS } from "../../constants/constants";
import { MathUtils } from "three";
import { isEmpty } from "lodash";
import BoxFaceLayers from "../../models/BoxFaceLayers";
import { gsap } from "gsap";

const BoxAnimation = ({
  length,
  width,
  height,
  thickness = 5,
  faceColor = 0xba7b13,
  faceTexture = MATERIALS.CARDBOARD,
  isPreviewMockup,
  lightGroup,
  is3dRenderMode,
}) => {
  const groupRef = useRef();
  const { camera } = useThree();
  const [boxFaces, setBoxFaces] = useState({});

  useEffect(() => {
    const bottomFace = renderBottomFace();
    const bottomLeftFace = renderBottomLeftFace();
    const bottomRightFace = renderBottomRightFace();
    const belowFrontFace = renderBelowFrontFace();
    const upperFrontFace = renderUpperFrontFace();
    const upperFace = renderUpperFace();
    belowFrontFace.add(upperFace);

    groupRef.current?.clear();
    groupRef.current?.add(
      bottomFace,
      bottomLeftFace,
      bottomRightFace,
      belowFrontFace,
      upperFrontFace
    );

    groupRef.current.rotation.set(150, 0, 0);

    if (groupRef.current?.children.length) {
      setBoxFaces(
        groupRef.current?.children.reduce((boxFacesAcc, currentMesh) => {
          boxFacesAcc[currentMesh.name] = currentMesh;
          return boxFacesAcc;
        }, {})
      );
    }
  }, [length, width, height, faceColor, faceTexture, thickness]);

  useEffect(() => {
    // using gsap to for animation instead of useFrame
    // animation can be set in sequence
    if (!isEmpty(boxFaces)) {
      gsap
        .timeline({})
        .to(boxFaces[BOX_FACE_NAMES.BELOW_FRONT]?.rotation, {
          x: MathUtils.degToRad(90),
          duration: 1,
          ease: "none",
        })
        .to(boxFaces[BOX_FACE_NAMES.BOTTOM_LEFT]?.rotation, {
          y: MathUtils.degToRad(90),
          duration: 1,
          ease: "none",
        })
        .to(
          boxFaces[BOX_FACE_NAMES.BOTTOM_RIGHT]?.rotation,
          {
            y: MathUtils.degToRad(-90),
            duration: 1,
            ease: "none",
          },
          // insert at the start of the previous animation
          "<"
        )
        .to(boxFaces[BOX_FACE_NAMES.UPPER_FRONT]?.rotation, {
          x: MathUtils.degToRad(-90),
          duration: 1,
          ease: "none",
        })
        // children 3 === the upper face
        .to(boxFaces[BOX_FACE_NAMES.BELOW_FRONT]?.children[3].rotation, {
          x: MathUtils.degToRad(90),
          duration: 1,
          ease: "none",
        });
    }
  }, [boxFaces]);

  useEffect(() => {
    if (is3dRenderMode) {
      camera.position.set(300, -200, 800);
    } else camera.position.set(0, 0, 0);
  }, [isPreviewMockup, is3dRenderMode]);

  useFrame(({ camera }) => {
    lightGroup.current.quaternion.copy(camera.quaternion);
  });

  const renderBottomFace = () => {
    const boxFaceController = new BoxFaceLayers(
      length,
      width,
      thickness,
      [true, true, true, true],
      BOX_FACE_NAMES.BOTTOM
    ); // width + height of box shape;
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
        rx: 0,
        ry: 0,
        rz: 0,
      },
    });
  };

  const renderBottomLeftFace = () => {
    const boxFaceController = new BoxFaceLayers(
      height,
      width,
      thickness,
      [false, true, false, false],
      BOX_FACE_NAMES.BOTTOM_LEFT,
      [-height / 2, 0, 0]
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: -length / 2,
        y: 0,
        z: 0,
      },
      rotation: {
        rx: 0,
        ry: 0,
        rz: 0,
      },
    });
  };

  const renderBottomRightFace = () => {
    const boxFaceController = new BoxFaceLayers(
      height,
      width,
      thickness,
      [false, false, false, true],
      BOX_FACE_NAMES.BOTTOM_RIGHT,
      [height / 2, 0, 0]
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: length / 2,
        y: 0,
        z: 0,
      },
      rotation: {
        rx: 0,
        ry: 0,
        rz: 0,
      },
    });
  };

  const renderBelowFrontFace = () => {
    const boxFaceController = new BoxFaceLayers(
      length,
      height,
      thickness,
      [true, false, true, false],
      BOX_FACE_NAMES.BELOW_FRONT,
      [0, height / 2, 0]
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: 0,
        y: width / 2,
        z: 0,
      },
      rotation: {
        rx: 0,
        ry: 0,
        rz: 0,
      },
    });
  };

  const renderUpperFrontFace = () => {
    const boxFaceController = new BoxFaceLayers(
      length,
      height,
      thickness,
      [true, false, false, false],
      BOX_FACE_NAMES.UPPER_FRONT,
      [0, -height / 2, 0]
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: 0,
        y: -width / 2,
        z: 0,
      },
      rotation: {
        rx: 0,
        ry: 0,
        rz: 0,
      },
    });
  };

  const renderUpperFace = () => {
    const boxFaceController = new BoxFaceLayers(
      length,
      width,
      thickness,
      [false, false, true, false],
      BOX_FACE_NAMES.UPPER,
      [0, width / 2, 0]
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: 0,
        y: height,
        z: 0,
      },
      rotation: {
        rx: 0,
        ry: 0,
        rz: 0,
      },
    });
  };

  return <group ref={groupRef}></group>;
};

export default BoxAnimation;

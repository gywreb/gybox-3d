import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import {
  BOX_FACE_NAMES,
  getRoundedFlapShape,
  getRoundedFlapTrapezoldShape,
  getSampleFlapShape,
  MATERIALS,
  SAMPLE_FACE_RADIUS,
} from "../../constants/constants";
import { MathUtils } from "three";
import { isEmpty } from "lodash";
import BoxFace from "../../models/BoxFace";
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
  isPreviewAnimation,
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
      upperFrontFace
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

  useEffect(() => {
    // using gsap to for animation instead of useFrame
    // animation can be set in sequence
    if (!isEmpty(boxFaces) && isPreviewAnimation) {
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
        .to(boxFaces[BOX_FACE_NAMES.UPPER_FRONT]?.children[6].rotation, {
          y: MathUtils.degToRad(450),
          duration: 1,
          ease: "none",
        })
        .to(
          boxFaces[BOX_FACE_NAMES.UPPER_FRONT]?.children[7].rotation,
          {
            y: MathUtils.degToRad(-90),
            duration: 1,
            ease: "none",
          },
          "<"
        )
        .to(boxFaces[BOX_FACE_NAMES.UPPER_FRONT]?.rotation, {
          x: MathUtils.degToRad(-90),
          duration: 1,
          ease: "none",
        })
        .to(
          boxFaces[BOX_FACE_NAMES.BELOW_FRONT]?.children[4].children[6]
            .rotation,
          {
            y: MathUtils.degToRad(-90),
            duration: 1,
            ease: "none",
          }
        )
        .to(
          boxFaces[BOX_FACE_NAMES.BELOW_FRONT]?.children[4].children[7]
            .rotation,
          {
            y: MathUtils.degToRad(450),
            duration: 1,
            ease: "none",
          },
          "<"
        )
        // children 3 === the upper face
        .to(boxFaces[BOX_FACE_NAMES.BELOW_FRONT]?.children[4].rotation, {
          x: MathUtils.degToRad(90),
          duration: 1,
          ease: "none",
        });
    }
  }, [boxFaces, isPreviewAnimation]);

  useEffect(() => {
    if (is3dRenderMode) {
      camera.position.set(300, -200, 800);
    } else camera.position.set(0, 0, 0);
  }, [isPreviewMockup, is3dRenderMode]);

  useEffect(() => {
    groupRef.current?.translateX(-length / 2);
    groupRef.current?.rotation.set(150, 0, 0);
  }, []);

  useFrame(({ camera }) => {
    lightGroup.current.quaternion.copy(camera.quaternion);
  });

  const renderBottomFace = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      thickness,
      [],
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
    const boxFaceController = new BoxFace(
      height,
      width,
      thickness,
      [
        {
          width,
          pivotTranslation: [0, 0, 0],
          rotate: [-90, 0, 90],
        },
      ],
      BOX_FACE_NAMES.BOTTOM_LEFT,
      [-height, 0, 0]
    );
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

  const renderBottomRightFace = () => {
    const boxFaceController = new BoxFace(
      height,
      width,
      thickness,
      [
        {
          width,
          pivotTranslation: [0, 0, 0],
          rotate: [-90, 0, -90],
        },
      ],
      BOX_FACE_NAMES.BOTTOM_RIGHT,
      [0, 0, 0]
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: length,
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
    const boxFaceController = new BoxFace(
      length,
      height,
      thickness,
      [
        {
          width: length,
          pivotTranslation: [0, 0, 0],
          rotate: [0, 90, 0],
        },
      ],
      BOX_FACE_NAMES.BELOW_FRONT,
      [0, 0, 0]
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: 0,
        y: width,
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
    const boxFaceController = new BoxFace(
      length - thickness / 2,
      height,
      thickness,
      [
        {
          width: length - thickness / 2,
          pivotTranslation: [0, 0, 0],
          rotate: [0, 90, 180],
        },
        {
          width: height - thickness * 2,
          pivotTranslation: [0, 0, -height + thickness],
          rotate: [-90, 0, -90],
        },
        {
          width: height - thickness * 2,
          position: [length - thickness / 2, -height + thickness, 0],
          rotate: [-90, 0, 90],
        },
      ],
      BOX_FACE_NAMES.UPPER_FRONT,
      [0, -height, 0]
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: thickness / 4,
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

  const renderUpperFace = () => {
    const boxFaceController = new BoxFace(
      length - thickness / 2,
      width,
      thickness,
      [
        {
          width: length - thickness / 2,
          pivotTranslation: [0, 0, 0],
          rotate: [0, 90, 0],
        },
        {
          width: width - thickness * 2,
          position: [0, thickness, 0],
          rotate: [-90, 0, -90],
        },
        {
          width: width - thickness * 2,
          position: [length - thickness / 2, thickness, 0],
          rotate: [-90, 0, 90],
        },
      ],
      BOX_FACE_NAMES.UPPER,
      [0, 0, 0]
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: thickness / 4,
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

  const renderUpperRightFlap = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      thickness,
      [],
      BOX_FACE_NAMES.UPPER_RIGHT_FLAP,
      [0, 0, 0],
      getRoundedFlapTrapezoldShape(
        height - thickness * 2.5,
        width - thickness * 2 - SAMPLE_FACE_RADIUS,
        SAMPLE_FACE_RADIUS
      )
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: length - thickness / 2,
        y: thickness + SAMPLE_FACE_RADIUS,
        z: 0,
      },
      rotation: {
        rx: 0,
        ry: 0,
        rz: 0,
      },
    });
  };

  const renderUpperLeftFlap = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      thickness,
      [],
      BOX_FACE_NAMES.UPPER_LEFT_FLAP,
      [0, 0, 0],
      getRoundedFlapTrapezoldShape(
        height - thickness * 2.5,
        width - thickness * 2 - SAMPLE_FACE_RADIUS,
        SAMPLE_FACE_RADIUS
      )
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: 0,
        y: width - (thickness + SAMPLE_FACE_RADIUS),
        z: 0,
      },
      rotation: {
        rx: 0,
        ry: 360,
        rz: 180,
      },
    });
  };

  const renderUpperFrontLeftFlap = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      thickness,
      [],
      BOX_FACE_NAMES.UPPER_FRONT_LEFT_FLAP,
      [0, 0, 0],
      getRoundedFlapShape(
        height - thickness * 2,
        height - thickness * 2,
        SAMPLE_FACE_RADIUS
      )
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: 0,
        y: -thickness,
        z: 0,
      },
      rotation: {
        rx: 0,
        ry: 360,
        rz: 180,
      },
    });
  };

  const renderUpperFrontRightFlap = () => {
    const boxFaceController = new BoxFace(
      length,
      width,
      thickness,
      [],
      BOX_FACE_NAMES.UPPER_FRONT_RIGHT_FLAP,
      [0, 0, 0],
      getRoundedFlapShape(
        height - thickness * 2,
        height - thickness * 2,
        SAMPLE_FACE_RADIUS
      )
    );
    return boxFaceController.createBox3dFace({
      texture: faceTexture,
      color: faceColor,
      position: {
        x: length - thickness / 2,
        y: -height + thickness,
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

import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../../common/Button/Button";
import Input from "../../common/Input/Input";
import Select from "../../common/Select/Select";
import {
  BOX_EDIT_DEFAULT_VALUES,
  EXPORT_FORMATS,
  FACE_TYPES,
  MATERIALS,
  RENDER_MODE,
} from "../../constants/constants";
import Box3d from "../Box3d/Box3d";
import BoxDieline from "../BoxDieline/BoxDieline";
import { capitalize } from "lodash";
import BoxExporter from "../BoxExporter/BoxExporter";
import Dropzone from "../../common/Dropzone/Dropzone";
import BoxAnimation from "../BoxAnimation/BoxAnimation";
import BoxAnimationVer2 from "../BoxAnimationVer2/BoxAnimationVer2";
// import BoxAnimation from "../BoxAnimation/BoxAnimation";

const BoxEditable = () => {
  const [renderMode, setRenderMode] = useState(RENDER_MODE.RENDER_2D);
  const [formValues, setFormValues] = useState(BOX_EDIT_DEFAULT_VALUES);
  const [isPreviewMockup, setIsPreviewMockup] = useState(false);
  const [isPreviewAnimation, setIsPreviewAnimation] = useState(false);
  const canvasRef = useRef();
  const cameraRef = useRef();
  const topLight = useRef();
  const sideLight = useRef();
  const lightGroup = useRef();

  const methods = useForm({ mode: "onTouched" });
  const { handleSubmit } = methods;
  const onSubmit = (data) => {
    setFormValues({
      length: Number(data.length),
      width: Number(data.width),
      height: Number(data.height),
      thickness: Number(data.thickness),
      texture: FACE_TYPES.MATERIAL ? data.material?.value || "" : "",
      format: data.format.value,
      faceType: data.faceType.value,
      color: data.color || "",
    });
    if (data.faceType.value === FACE_TYPES.CUSTOM) {
      convertImageBase64(data.material);
    }
  };

  const onChangeRenderMode = () => {
    if (renderMode === RENDER_MODE.RENDER_2D)
      setRenderMode(RENDER_MODE.RENDER_3D);
    else setRenderMode(RENDER_MODE.RENDER_2D);
  };

  const convertImageBase64 = (files) => {
    // check max. file size is not exceeded
    // size is in bytes
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = () => {
      setFormValues((prev) => ({ ...prev, texture: reader.result }));
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const is3dRenderMode = useMemo(
    () => renderMode === RENDER_MODE.RENDER_3D,
    [renderMode]
  );

  const materialOptions = useMemo(
    () =>
      Object.keys(MATERIALS).map((label) => ({
        label: capitalize(label),
        value: MATERIALS[label],
      })),
    []
  );

  const formatOptions = useMemo(
    () =>
      Object.keys(EXPORT_FORMATS).map((label) => ({
        label: label,
        value: EXPORT_FORMATS[label],
      })),
    []
  );

  const faceTypeOptions = useMemo(
    () =>
      Object.keys(FACE_TYPES).map((label) => ({
        label: capitalize(label),
        value: FACE_TYPES[label],
      })),
    []
  );

  const handleChangeDownloadFormat = (format) => {
    setFormValues((prev) => ({ ...prev, format: format.value }));
  };

  const handleChangeFaceType = (faceType) => {
    setFormValues((prev) => ({ ...prev, faceType: faceType.value }));
  };

  return (
    <>
      <div className="flex h-full mt-20 items-center">
        <div className="relative h-screen w-2/3 mr-4 mb-5">
          <Canvas
            style={{ background: "#f9f9f9", borderRadius: "10px" }}
            gl={{ preserveDrawingBuffer: true }}
            ref={canvasRef}
            linear
            flat
          >
            <PerspectiveCamera
              ref={cameraRef}
              position={[300, 200, 700]}
              fov={35}
              near={10}
              far={40000}
              zoom={
                200 /
                (formValues.length > BOX_EDIT_DEFAULT_VALUES.length
                  ? formValues.length
                  : BOX_EDIT_DEFAULT_VALUES.length)
              }
              makeDefault={is3dRenderMode}
            />
            <OrthographicCamera
              zoom={
                200 /
                (formValues.length > BOX_EDIT_DEFAULT_VALUES.length
                  ? formValues.length * 0.5
                  : BOX_EDIT_DEFAULT_VALUES.length)
              }
              makeDefault={!is3dRenderMode}
            />

            <group ref={lightGroup}>
              <ambientLight color={0xffffff} intensity={0.55} />
              <pointLight
                ref={topLight}
                color={0xffffff}
                intensity={0.3}
                position={[-30, 200, 0]}
                castShadow
              />
              <pointLight
                ref={sideLight}
                color={0xffffff}
                intensity={0.5}
                position={[50, 0, 550]}
                castShadow
              />
            </group>
            {is3dRenderMode && (
              <>
                <OrbitControls />
                {/* {isPreviewAnimation && (
                  <BoxAnimation
                    {...formValues}
                    faceColor={formValues.color}
                    faceTexture={
                      formValues.faceType === FACE_TYPES.MATERIAL ||
                      formValues.faceType === FACE_TYPES.CUSTOM
                        ? formValues.texture
                        : ""
                    }
                    isPreviewMockup={isPreviewMockup}
                    lightGroup={lightGroup}
                    is3dRenderMode={is3dRenderMode}
                  />
                )} */}
                {!isPreviewMockup && (
                  <Box3d
                    {...formValues}
                    faceColor={formValues.color}
                    faceTexture={
                      formValues.faceType === FACE_TYPES.MATERIAL ||
                      formValues.faceType === FACE_TYPES.CUSTOM
                        ? formValues.texture
                        : ""
                    }
                    isPreviewMockup={isPreviewMockup}
                    lightGroup={lightGroup}
                    is3dRenderMode={is3dRenderMode}
                  />
                )}
                {isPreviewMockup && (
                  <BoxAnimationVer2
                    {...formValues}
                    faceColor={formValues.color}
                    faceTexture={
                      formValues.faceType === FACE_TYPES.MATERIAL ||
                      formValues.faceType === FACE_TYPES.CUSTOM
                        ? formValues.texture
                        : ""
                    }
                    isPreviewMockup={isPreviewMockup}
                    lightGroup={lightGroup}
                    is3dRenderMode={is3dRenderMode}
                    isPreviewAnimation={isPreviewAnimation}
                  />
                )}
              </>
            )}
            {!is3dRenderMode && (
              <>
                <BoxDieline {...formValues} lineColor={0xfe5959} />
              </>
            )}
          </Canvas>
          <div className="absolute top-0 right-0 flex flex-col justify-end">
            <Button
              onClick={onChangeRenderMode}
              className={`text-white bg-amber-500 p-2 w-fit flex items-start justify-center rounded-md self-end`}
            >
              {is3dRenderMode ? "Toggle Dieline" : "Toggle 3D"}
            </Button>
            {is3dRenderMode && (
              <Button
                onClick={() => setIsPreviewMockup((prev) => !prev)}
                className={`text-white bg-emerald-500 mt-2 p-2 w-fit items-start justify-center rounded-md block`}
              >
                View Alt Version
              </Button>
            )}
            {is3dRenderMode && (
              <Button
                onClick={() => setIsPreviewAnimation((prev) => !prev)}
                className={`text-white bg-pink-500 mt-2 p-2 w-fit items-start justify-center rounded-md block self-end`}
              >
                View Animation
              </Button>
            )}
          </div>
        </div>
        <div className="h-full flex flex-col justify-center w-1/4">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center justify-between">
                <div className="mr-2">
                  <Input
                    id="length"
                    label="Length (L)"
                    type="number"
                    defaultValue={formValues.length}
                  />
                </div>
                <div className="mr-2">
                  <Input
                    id="width"
                    label="Width (W)"
                    type="number"
                    defaultValue={formValues.width}
                  />
                </div>
                <Input
                  id="height"
                  label="Height (H)"
                  type="number"
                  defaultValue={formValues.height}
                />
              </div>
              <div className="mt-2">
                <Input
                  id="thickness"
                  label="Thickness"
                  type="number"
                  defaultValue={formValues.thickness}
                />
              </div>
              <div className="mt-2">
                <Select
                  id="faceType"
                  label="Face type"
                  placeholder="Choose face type"
                  options={faceTypeOptions}
                  defaultValue={faceTypeOptions[0]}
                  handleChangeValue={handleChangeFaceType}
                />
              </div>
              {formValues.faceType === FACE_TYPES.MATERIAL && (
                <>
                  <div className="mt-2">
                    <Select
                      id="material"
                      label="Material"
                      placeholder="Choose custom material"
                      options={materialOptions}
                      defaultValue={materialOptions[0]}
                    />
                  </div>
                </>
              )}
              {formValues.faceType === FACE_TYPES.CUSTOM && (
                <div className="mt-2">
                  <Dropzone
                    label="Custom Texture"
                    id="material"
                    helperText="Drop your image here"
                    accept="image/png, image/jpg, image/jpeg"
                  />
                </div>
              )}
              {formValues.faceType === FACE_TYPES.COLOR && (
                <div className="mt-2">
                  <Input
                    id="color"
                    label="Color"
                    type="color"
                    defaultValue={formValues.color}
                    className="p-4"
                  />
                </div>
              )}
              <Button
                type="submit"
                className="text-white bg-teal-500 p-2 mt-3 w-full flex items-start justify-center rounded-md"
              >
                Apply
              </Button>
              <div className="mt-2">
                <Select
                  id="format"
                  label="Download Formats"
                  placeholder="Choose custom material"
                  options={formatOptions}
                  defaultValue={formatOptions[0]}
                  handleChangeValue={handleChangeDownloadFormat}
                />
                <BoxExporter
                  cameraRef={cameraRef}
                  canvasRef={canvasRef}
                  downloadFormat={formValues.format}
                  isColorFace={formValues.faceType === FACE_TYPES.COLOR}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default BoxEditable;

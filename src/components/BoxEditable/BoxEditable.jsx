import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../../common/Button/Button";
import Input from "../../common/Input/Input";
import Select from "../../common/Select/Select";
import {
  BOX_EDIT_DEFAULT_VALUES,
  MATERIALS,
  RENDER_MODE,
} from "../../constants/constants";
import Box3d from "../Box3d/Box3d";
import BoxDieline from "../BoxDieline/BoxDieline";
import { capitalize } from "lodash";

const BoxEditable = () => {
  const [renderMode, setRenderMode] = useState(RENDER_MODE.RENDER_2D);
  const [formValues, setFormValues] = useState(BOX_EDIT_DEFAULT_VALUES);
  const methods = useForm({ mode: "onTouched" });
  const { handleSubmit } = methods;
  const onSubmit = (data) => {
    setFormValues({
      length: Number(data.length),
      width: Number(data.width),
      height: Number(data.height),
      thickness: Number(data.thickness),
      texture: data.material.value,
    });
  };

  const onChangeRenderMode = () => {
    if (renderMode === RENDER_MODE.RENDER_2D)
      setRenderMode(RENDER_MODE.RENDER_3D);
    else setRenderMode(RENDER_MODE.RENDER_2D);
  };

  const is3dRenderMode = useMemo(
    () => renderMode === RENDER_MODE.RENDER_3D,
    [renderMode]
  );

  const materialOptions = useMemo(() =>
    Object.keys(MATERIALS).map((label) => ({
      label: capitalize(label),
      value: MATERIALS[label],
    }))
  );

  return (
    <>
      <div className="flex h-full mt-20 items-center">
        <div className="relative h-screen w-1/2 mr-4 mb-5">
          <Canvas
            shadows
            flat
            linear
            style={{ background: "#f9f9f9", borderRadius: "10px" }}
          >
            <Suspense fallback={null}>
              <PerspectiveCamera
                position={[300, 200, 700]}
                fov={25}
                near={0.1}
                far={4000}
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
              <ambientLight intensity={1} />
              {is3dRenderMode && (
                <>
                  <OrbitControls />
                  <Box3d
                    {...formValues}
                    faceTexture={formValues.texture}
                    lineColor={0xfe5959}
                  />
                </>
              )}
              {!is3dRenderMode && (
                <>
                  <BoxDieline {...formValues} lineColor={0xfe5959} />
                </>
              )}
            </Suspense>
          </Canvas>
          <div className="absolute top-0 right-0">
            <Button
              onClick={onChangeRenderMode}
              className={`text-white bg-amber-500 p-2 w-fit flex items-start justify-center rounded-md`}
            >
              {is3dRenderMode ? "Toggle Dieline" : "Toggle 3D"}
            </Button>
          </div>
        </div>
        <div className="h-full flex flex-col justify-center">
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
                  label="Thickness (0.5 - 3)"
                  type="number"
                  defaultValue={formValues.thickness}
                />
              </div>
              <div className="mt-2">
                <Select
                  id="material"
                  label="Material"
                  placeholder="Choose custom material"
                  options={materialOptions}
                  defaultValue={materialOptions[0]}
                />
              </div>
              <Button
                type="submit"
                className="text-white bg-teal-500 p-2 mt-3 w-full flex items-start justify-center rounded-md"
              >
                Apply
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default BoxEditable;

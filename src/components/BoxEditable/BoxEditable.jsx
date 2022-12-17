import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../../common/Button/Button";
import Input from "../../common/Input/Input";
import BoxDieline from "../BoxDieline/BoxDieline";

const BoxEditable = () => {
  const [formValues, setFormValues] = useState({
    length: 200,
    width: 100,
    height: 60,
  });
  const methods = useForm({ mode: "onTouched" });
  const { handleSubmit } = methods;
  const onSubmit = (data) => {
    setFormValues({
      length: Number(data.length),
      width: Number(data.width),
      height: Number(data.height),
    });
  };
  return (
    <div className="flex h-full mt-20">
      <Canvas orthographic camera={{ zoom: 1 }}>
        {/* <OrbitControls /> */}
        <BoxDieline {...formValues} />
      </Canvas>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center justify-between"
        >
          <Input
            id="length"
            label="Length"
            type="number"
            defaultValue={formValues.length}
          />
          <Input
            id="width"
            label="Width"
            type="number"
            defaultValue={formValues.width}
          />
          <Input
            id="height"
            label="Height"
            type="number"
            defaultValue={formValues.height}
          />
          <Button type="submit">Apply</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default BoxEditable;

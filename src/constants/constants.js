const RENDER_MODE = {
  RENDER_2D: "2d",
  RENDER_3D: "3d",
};

const MATERIALS = {
  CARDBOARD: "/src/assets/textures/cardboard.jpg",
  PAPER: "/src/assets/textures/paper.jpg",
  PATTERN: "/src/assets/textures/pattern.jpg",
};

const EXPORT_FORMATS = {
  PNG: "image/png",
  JPEG: "image/jpeg",
  PDF: "pdf",
  // SVG: "svg",
  // SVG: "image/svg+xml",
};

const DEFAULT_EXPORT_NAME = "gy-template-01";

// TO BE JSON FROM BE
const BOX_EDIT_DEFAULT_VALUES = {
  length: 200,
  width: 100,
  height: 60,
  thickness: 0.5,
  texture: MATERIALS.CARDBOARD,
  format: EXPORT_FORMATS.PNG,
};

const BOX_FACE_NAMES = {
  BOTTOM: "bottom",
  BOTTOM_LEFT: "bottomLeft",
  BOTTOM_RIGHT: "bottomRight",
  BELOW_FRONT: "belowFront",
  UPPER_FRONT: "upperFront",
  UPPER: "upper",
};

export {
  RENDER_MODE,
  MATERIALS,
  BOX_EDIT_DEFAULT_VALUES,
  BOX_FACE_NAMES,
  EXPORT_FORMATS,
  DEFAULT_EXPORT_NAME,
};

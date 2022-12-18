const RENDER_MODE = {
  RENDER_2D: "2d",
  RENDER_3D: "3d",
};

const MATERIALS = {
  CARDBOARD: "/src/assets/textures/cardboard.jpg",
  PAPER: "/src/assets/textures/paper.jpg",
  PATTERN: "/src/assets/textures/pattern.jpg",
};

// TO BE JSON FROM BE
const BOX_EDIT_DEFAULT_VALUES = {
  length: 200,
  width: 100,
  height: 60,
  thickness: 0.5,
  texture: MATERIALS.CARDBOARD,
};

export { RENDER_MODE, MATERIALS, BOX_EDIT_DEFAULT_VALUES };

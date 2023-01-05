const RENDER_MODE = {
  RENDER_2D: "2d",
  RENDER_3D: "3d",
};

const MATERIALS = {
  CARDBOARD: "/assets/textures/cardboard.jpg",
  PAPER: "/assets/textures/paper.jpg",
  PATTERN: "/assets/textures/pattern.jpg",
};

const EXPORT_FORMATS = {
  PNG: "image/png",
  JPEG: "image/jpeg",
  PDF: "pdf",
  SVG: "svg",
  // SVG: "image/svg+xml",
};

const FACE_TYPES = {
  COLOR: "color",
  MATERIAL: "material",
  CUSTOM: "custom",
};

const DEFAULT_EXPORT_NAME = "gy-template-01";
const DEFAULT_COLOR = "#EDDA74";

// TO BE JSON FROM BE
const BOX_EDIT_DEFAULT_VALUES = {
  length: 200,
  width: 100,
  height: 60,
  thickness: 5, // mm
  texture: MATERIALS.CARDBOARD,
  format: EXPORT_FORMATS.PNG,
  faceType: FACE_TYPES.COLOR,
  color: DEFAULT_COLOR,
};

const BOX_FACE_NAMES = {
  BOTTOM: "bottom",
  BOTTOM_LEFT: "bottomLeft",
  BOTTOM_RIGHT: "bottomRight",
  BELOW_FRONT: "belowFront",
  UPPER_FRONT: "upperFront",
  UPPER: "upper",
  UPPER_RIGHT_FLAP: "upperRightFlap",
  UPPER_LEFT_FLAP: "upperLeftFlap",
  UPPER_FRONT_RIGHT_FLAP: "upperFrontRightFlap",
  UPPER_FRONT_LEFT_FLAP: "upperFrontLeftFlap",
};

const SHAPE_TYPES = {
  LINE: "line",
  BEZIER_CURVE: "bezierCurve",
  ABS_ARC: "absarc",
  QUADRATIC_CURVE: "quadraticCurveTo",
};

const SAMPLE_FACE_RADIUS = 10;

const getDefaultRectangleShape = (width, height) => [
  { type: SHAPE_TYPES.LINE, coordinates: [0, height] },
  { type: SHAPE_TYPES.LINE, coordinates: [width, height] },
  { type: SHAPE_TYPES.LINE, coordinates: [width, 0] },
];

const getSampleFlapShape = (width, height) => [
  {
    type: SHAPE_TYPES.BEZIER_CURVE,
    coordinates: [width, height, 0, height, 0, width, 0],
  },
];

const getRoundedFlapShape = (width, height, radius = 20) => {
  // remove the corner radius if need to flaten the edge
  // each corner will have the radius to remove
  return [
    { type: SHAPE_TYPES.LINE, coordinates: [0, height - radius] }, // ( x, y + height - radius )
    // top left corner radius
    {
      type: SHAPE_TYPES.QUADRATIC_CURVE,
      coordinates: [0, height, 0, height], // ( x, y + height, x + radius, y + height )
    },
    { type: SHAPE_TYPES.LINE, coordinates: [width - radius, height] }, // ( x + width - radius, y + height )
    // top right corner radius
    {
      type: SHAPE_TYPES.QUADRATIC_CURVE, // ( x + width, y + height, x + width, y + height - radius )
      coordinates: [width, height, width, height - radius],
    },
    { type: SHAPE_TYPES.LINE, coordinates: [width, radius] }, // ( x + width, y + radius )
    // bottom left corner radius
    {
      type: SHAPE_TYPES.QUADRATIC_CURVE, // ( x + width, y, x + width - radius, y )
      coordinates: [width, 0, width - radius, 0],
    },
    { type: SHAPE_TYPES.LINE, coordinates: [radius, 0] }, // ( x + radius, y )
    // bottom right corner radius
    {
      type: SHAPE_TYPES.QUADRATIC_CURVE,
      coordinates: [0, 0, 0, 0], // ( x, y, x, y + radius )
    },
  ];
};

const getRoundedFlapTrapezoldShape = (width, height, radius = 20) => {
  // remove the corner radius if need to flaten the edge
  // each corner will have the radius to remove
  return [
    { type: SHAPE_TYPES.LINE, coordinates: [0, height - radius] }, // ( x, y + height - radius )
    // top left corner radius
    {
      type: SHAPE_TYPES.QUADRATIC_CURVE,
      coordinates: [0, height, 0, height], // ( x, y + height, x + radius, y + height )
    },
    {
      type: SHAPE_TYPES.LINE,
      coordinates: [width - radius / 3, height - radius],
    }, // ( x + width - radius, y + height )
    // top right corner radius
    {
      type: SHAPE_TYPES.QUADRATIC_CURVE, // ( x + width, y + height, x + width, y + height - radius )
      coordinates: [width, height - radius, width, height - radius * 2],
    },
    { type: SHAPE_TYPES.LINE, coordinates: [width, radius] }, // ( x + width, y + radius )
    // bottom left corner radius
    {
      type: SHAPE_TYPES.QUADRATIC_CURVE, // ( x + width, y, x + width - radius, y )
      coordinates: [width, 0, width - radius / 8, 0],
    },
    { type: SHAPE_TYPES.LINE, coordinates: [0, -radius] }, // ( x + radius, y )
    // bottom right corner radius
    {
      type: SHAPE_TYPES.QUADRATIC_CURVE,
      coordinates: [0, 0, 0, 0], // ( x, y, x, y + radius )
    },
  ];
};

export {
  RENDER_MODE,
  MATERIALS,
  BOX_EDIT_DEFAULT_VALUES,
  BOX_FACE_NAMES,
  EXPORT_FORMATS,
  DEFAULT_EXPORT_NAME,
  FACE_TYPES,
  DEFAULT_COLOR,
  SHAPE_TYPES,
  SAMPLE_FACE_RADIUS,
  getDefaultRectangleShape,
  getSampleFlapShape,
  getRoundedFlapShape,
  getRoundedFlapTrapezoldShape,
};

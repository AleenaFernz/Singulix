module.exports = {
  // Existing webpack configuration from Create React App
  ignoreWarnings: [
    {
      module: /@mediapipe/,
    },
    {
      module: /tasks-vision/,
    },
  ],
};
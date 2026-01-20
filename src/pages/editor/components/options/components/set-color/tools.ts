// Calculate angle between two points (radians)
export function calculateAngle(x1, y1, x2, y2) {
  var deltaX = x2 - x1;
  var deltaY = y2 - y1;
  var angleRad = Math.atan2(deltaY, deltaX);
  var an = radianToDegree(angleRad) + 360;
  return an % 360;
}

// Convert radians to degrees
export function radianToDegree(radian) {
  return Number((radian * (180 / Math.PI)).toFixed(0));
}

// Given angle, calculate coordinates of two points (normalized)
export function calculatePoints(angle) {
  // Convert angle to radians
  var angleRad = angle * (Math.PI / 180);

  // Calculate point 1 coordinates
  var x1 = (Math.cos(angleRad) + 1) / 2; // Ensure between 0 and 1
  var y1 = (Math.sin(angleRad) + 1) / 2; // Ensure between 0 and 1

  // Calculate point 2 coordinates (180 degrees from point 1)
  var x2 = (Math.cos(angleRad + Math.PI) + 1) / 2; // Ensure between 0 and 1
  var y2 = (Math.sin(angleRad + Math.PI) + 1) / 2; // Ensure between 0 and 1

  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ];
}

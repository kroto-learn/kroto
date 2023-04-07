export const generateRandomGradientImages = () => {
  function getRandomColor() {
    // Generate random RGB color
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Return CSS color string
    return `rgb(${r}, ${g}, ${b})`;
  }
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Define canvas dimensions
  canvas.width = 400;
  canvas.height = 200;

  // Define gradient
  const gradient = context.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
  );
  gradient.addColorStop(0, getRandomColor());
  gradient.addColorStop(1, getRandomColor());

  // Apply gradient to canvas
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Get base64 string
  const base64String = canvas.toDataURL();
  return base64String;
};

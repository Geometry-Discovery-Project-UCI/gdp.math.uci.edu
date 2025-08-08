// utils/useFabricCanvas.ts
import { fabric } from "fabric";
import { createFadingText } from "./canvas";

export function useFabricCanvas(
  elementId: string,
  options: fabric.ICanvasOptions = {},
  text?: string,
  location?: { left: number; top: number }
) {
  const canvas = new fabric.Canvas(elementId,{
    selection: false,
    ...options,
  });
  createFadingText(canvas, text || "drag the points to begin exploring", location || { left: 150, top: 25 });
  return canvas;
}

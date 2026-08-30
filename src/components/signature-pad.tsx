"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PEN_COLOR = "#111111";
const STROKE_WIDTH = 2.5;

function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx) return true;
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
      return false;
    }
  }
  return true;
}

function paintCanvasBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
}

export function SignaturePad({
  value,
  onChange,
  clearLabel,
  className,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  clearLabel: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const loadedValueRef = useRef<string | null | undefined>(undefined);

  function setupCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = PEN_COLOR;
    ctx.lineWidth = STROKE_WIDTH;
    paintCanvasBackground(ctx, rect.width, rect.height);

    return { canvas, ctx, width: rect.width, height: rect.height };
  }

  function exportValue() {
    const canvas = canvasRef.current;
    if (!canvas || isCanvasBlank(canvas)) {
      loadedValueRef.current = null;
      onChange(null);
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");
    loadedValueRef.current = dataUrl;
    onChange(dataUrl);
  }

  useEffect(() => {
    if (value === loadedValueRef.current) return;
    loadedValueRef.current = value;

    if (!value) {
      setupCanvas();
      return;
    }

    const image = new Image();
    image.onload = () => {
      const setup = setupCanvas();
      if (!setup) return;
      setup.ctx.drawImage(image, 0, 0, setup.width, setup.height);
    };
    image.src = value;
  }, [value]);

  function pointerPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function startStroke(event: React.PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    lastPointRef.current = pointerPoint(event);
  }

  function continueStroke(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const last = lastPointRef.current;
    if (!canvas || !ctx || !last) return;

    const point = pointerPoint(event);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function endStroke(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    canvasRef.current?.releasePointerCapture(event.pointerId);
    exportValue();
  }

  function clearPad() {
    const setup = setupCanvas();
    if (!setup) return;
    loadedValueRef.current = null;
    onChange(null);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <canvas
        ref={canvasRef}
        className="h-36 w-full touch-none rounded-xl border border-input bg-white"
        onPointerDown={startStroke}
        onPointerMove={continueStroke}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
        aria-label={clearLabel}
      />
      <Button type="button" variant="outline" size="sm" onClick={clearPad}>
        {clearLabel}
      </Button>
    </div>
  );
}

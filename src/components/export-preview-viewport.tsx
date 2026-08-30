"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { InvoiceExport } from "@/components/invoice-export";
import type { Invoice, Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.7795275591;
const TAP_MOVE_THRESHOLD = 8;

/** Keeps preview size consistent on tall phones (matches 430px app shell width). */
export const exportPreviewPaneClass =
  "max-h-[min(100%,calc(min(100vw-1.5rem,430px)*297/210))]";

function computeFitZoom(container: HTMLElement): number {
  const pad = 16;
  const width = container.clientWidth - pad;
  const height = container.clientHeight - pad;
  if (width <= 0 || height <= 0) return 0.35;

  const pageWidth = A4_WIDTH_MM * MM_TO_PX;
  const pageHeight = A4_HEIGHT_MM * MM_TO_PX;

  return Math.min(width / pageWidth, height / pageHeight);
}

function pageSizePx(zoom: number) {
  return {
    width: A4_WIDTH_MM * MM_TO_PX * zoom,
    height: A4_HEIGHT_MM * MM_TO_PX * zoom,
  };
}

function clampPan(
  pan: { x: number; y: number },
  zoom: number,
  container: HTMLElement,
) {
  const { width: pw, height: ph } = pageSizePx(zoom);
  const cw = container.clientWidth;
  const ch = container.clientHeight;

  function clampAxis(offset: number, containerSize: number, pageSize: number) {
    if (pageSize <= containerSize) return 0;
    const min = (containerSize - pageSize) / 2;
    const max = (pageSize - containerSize) / 2;
    return Math.min(max, Math.max(min, offset));
  }

  return {
    x: clampAxis(pan.x, cw, pw),
    y: clampAxis(pan.y, ch, ph),
  };
}

function zoomAtFocalPoint(
  currentZoom: number,
  currentPan: { x: number; y: number },
  nextZoom: number,
  focal: { x: number; y: number },
  container: HTMLElement,
) {
  const ratio = nextZoom / currentZoom;
  const cx = container.clientWidth / 2;
  const cy = container.clientHeight / 2;

  return {
    zoom: nextZoom,
    pan: clampPan(
      {
        x: currentPan.x * ratio + (focal.x - cx) * (1 - ratio),
        y: currentPan.y * ratio + (focal.y - cy) * (1 - ratio),
      },
      nextZoom,
      container,
    ),
  };
}

export function ExportPreviewViewport({
  invoice,
  locale,
  companyLogo,
  companyName,
  companyPhone,
  companyEmail,
  companySignature,
  maxZoom = 1.25,
  className,
  onTap,
  active = true,
}: {
  invoice: Invoice;
  locale: Locale;
  companyLogo: string | null;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companySignature: string | null;
  maxZoom?: number;
  className?: string;
  onTap?: () => void;
  active?: boolean;
}) {
  const [zoom, setZoom] = useState(0.35);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [canPan, setCanPan] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<{
    distance: number;
    zoom: number;
    pan: { x: number; y: number };
  } | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const tapRef = useRef<{ x: number; y: number } | null>(null);
  const minZoomRef = useRef(0.35);

  function clampZoom(value: number) {
    return Math.min(maxZoom, Math.max(minZoomRef.current, value));
  }

  function refreshMinZoom() {
    if (!previewRef.current) return;
    minZoomRef.current = computeFitZoom(previewRef.current);
  }

  function applyInitialFit() {
    refreshMinZoom();
    setZoom(minZoomRef.current);
    setPan({ x: 0, y: 0 });
  }

  useLayoutEffect(() => {
    if (!active) return;
    let cancelled = false;

    async function refitAfterLocaleChange() {
      await document.fonts.ready;
      if (cancelled) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          applyInitialFit();
        });
      });
    }

    void refitAfterLocaleChange();
    return () => {
      cancelled = true;
    };
  }, [active, locale, maxZoom]);

  useEffect(() => {
    if (!active || !previewRef.current) return;
    const container = previewRef.current;
    const observer = new ResizeObserver(() => {
      refreshMinZoom();
      setZoom((current) => clampZoom(current));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [active, maxZoom]);

  useEffect(() => {
    const node = previewRef.current;
    if (!node || !active) return;

    const onNativeTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };
    const onNativeWheel = (event: WheelEvent) => {
      event.preventDefault();
    };

    node.addEventListener("touchmove", onNativeTouchMove, { passive: false });
    node.addEventListener("wheel", onNativeWheel, { passive: false });
    return () => {
      node.removeEventListener("touchmove", onNativeTouchMove);
      node.removeEventListener("wheel", onNativeWheel);
    };
  }, [active]);

  function applyPan(next: { x: number; y: number }) {
    const container = previewRef.current;
    if (!container) {
      setPan(next);
      return;
    }
    setPan(clampPan(next, zoom, container));
  }

  useEffect(() => {
    if (!active || !previewRef.current) return;
    setPan((current) => clampPan(current, zoom, previewRef.current!));
    const el = previewRef.current;
    const { width, height } = pageSizePx(zoom);
    setCanPan(width > el.clientWidth || height > el.clientHeight);
  }, [active, zoom]);

  function endDrag() {
    dragRef.current = null;
    setDragging(false);
  }

  function onPreviewWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const container = previewRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const nextZoom = clampZoom(zoom - event.deltaY * 0.003);
    if (nextZoom === zoom) return;

    const { zoom: appliedZoom, pan: appliedPan } = zoomAtFocalPoint(
      zoom,
      pan,
      nextZoom,
      {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
      container,
    );
    setZoom(appliedZoom);
    setPan(appliedPan);
  }

  function onPreviewPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    tapRef.current = { x: event.clientX, y: event.clientY };

    if (event.button !== 0) return;

    const container = previewRef.current;
    const startPan = container ? clampPan(pan, zoom, container) : pan;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: startPan.x,
      panY: startPan.y,
    };

    const zoomedIn = minZoomRef.current > 0 && zoom > minZoomRef.current + 0.001;
    if (canPan || zoomedIn) {
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function onPreviewPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (
      tapRef.current &&
      Math.hypot(
        event.clientX - tapRef.current.x,
        event.clientY - tapRef.current.y,
      ) > TAP_MOVE_THRESHOLD
    ) {
      tapRef.current = null;
    }

    if (!canPan && zoom <= minZoomRef.current + 0.001) return;

    if (!dragging) setDragging(true);
    applyPan({
      x: drag.panX + event.clientX - drag.startX,
      y: drag.panY + event.clientY - drag.startY,
    });
  }

  function onPreviewPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (
      tapRef.current &&
      onTap &&
      !pinchRef.current &&
      Math.hypot(
        event.clientX - tapRef.current.x,
        event.clientY - tapRef.current.y,
      ) <= TAP_MOVE_THRESHOLD
    ) {
      onTap();
    }
    tapRef.current = null;
    endDrag();
  }

  return (
    <div
      ref={previewRef}
      dir="ltr"
      className={cn(
        "relative touch-none overflow-hidden",
        onTap && !dragging && "cursor-pointer",
        dragging ? "cursor-grabbing" : canPan ? "cursor-grab" : "cursor-default",
        className,
      )}
      onWheel={onPreviewWheel}
      onPointerDown={onPreviewPointerDown}
      onPointerMove={onPreviewPointerMove}
      onPointerUp={onPreviewPointerUp}
      onPointerCancel={onPreviewPointerUp}
      onTouchStart={(event) => {
        if (event.touches.length !== 2) return;
        tapRef.current = null;
        endDrag();
        const [a, b] = [event.touches[0], event.touches[1]];
        pinchRef.current = {
          distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
          zoom,
          pan,
        };
      }}
      onTouchMove={(event) => {
        const pinch = pinchRef.current;
        const container = previewRef.current;
        if (!pinch || !container || event.touches.length !== 2) return;
        event.preventDefault();
        tapRef.current = null;
        const [a, b] = [event.touches[0], event.touches[1]];
        const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        const rect = container.getBoundingClientRect();
        const nextZoom = clampZoom(pinch.zoom * (distance / pinch.distance));
        const { zoom: appliedZoom, pan: appliedPan } = zoomAtFocalPoint(
          pinch.zoom,
          pinch.pan,
          nextZoom,
          {
            x: (a.clientX + b.clientX) / 2 - rect.left,
            y: (a.clientY + b.clientY) / 2 - rect.top,
          },
          container,
        );
        setZoom(appliedZoom);
        setPan(appliedPan);
        pinchRef.current = {
          distance,
          zoom: appliedZoom,
          pan: appliedPan,
        };
      }}
      onTouchEnd={() => {
        pinchRef.current = null;
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 shrink-0"
        style={{
          transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))`,
        }}
      >
        <div
          className="shrink-0"
          style={{
            width: `calc(${A4_WIDTH_MM}mm * ${zoom})`,
            height: `calc(${A4_HEIGHT_MM}mm * ${zoom})`,
          }}
        >
          <div
            className="origin-top-left"
            style={{
              transform: `scale(${zoom})`,
              width: `${A4_WIDTH_MM}mm`,
              height: `${A4_HEIGHT_MM}mm`,
            }}
          >
            <div
              className="shadow-sm"
              style={{
                width: `${A4_WIDTH_MM}mm`,
                height: `${A4_HEIGHT_MM}mm`,
              }}
            >
              <InvoiceExport
                invoice={invoice}
                locale={locale}
                companyLogo={companyLogo}
                companyName={companyName}
                companyPhone={companyPhone}
                companyEmail={companyEmail}
                companySignature={companySignature}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

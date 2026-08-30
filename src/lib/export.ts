import { toJpeg, toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export async function captureA4(
  element: HTMLElement,
  format: "png" | "jpeg" = "png",
): Promise<string> {
  await document.fonts.ready;
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  const options = {
    pixelRatio: 3,
    cacheBust: true,
    backgroundColor: "#ffffff",
  };

  if (format === "jpeg") {
    return toJpeg(element, { ...options, quality: 0.92 });
  }

  return toPng(element, options);
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export function imageToPdf(dataUrl: string): Blob {
  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const format = dataUrl.includes("image/jpeg") ? "JPEG" : "PNG";
  pdf.addImage(dataUrl, format, 0, 0, 210, 297, undefined, "MEDIUM");
  const blob = pdf.output("blob");
  return blob.type === "application/pdf"
    ? blob
    : new Blob([blob], { type: "application/pdf" });
}

export async function downloadBlob(blob: Blob, filename: string): Promise<void> {
  const mimeType = filename.endsWith(".pdf")
    ? "application/pdf"
    : blob.type || "application/octet-stream";
  const fileBlob =
    blob.type === mimeType ? blob : new Blob([blob], { type: mimeType });
  const url = URL.createObjectURL(fileBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  // iOS Safari ignores programmatic download; open the PDF so the user can save it.
  const isIos =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIos && filename.endsWith(".pdf")) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  window.setTimeout(() => URL.revokeObjectURL(url), 120_000);
}

export async function shareBlob(
  blob: Blob,
  filename: string,
  title: string,
): Promise<void> {
  if (!navigator.share) {
    throw new Error("Share not supported");
  }

  const mimeType = filename.endsWith(".pdf")
    ? "application/pdf"
    : blob.type || "application/octet-stream";
  const fileBlob =
    blob.type === mimeType ? blob : new Blob([blob], { type: mimeType });
  const file = new File([fileBlob], filename, { type: mimeType });

  try {
    await navigator.share({ files: [file], title });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      throw new Error("Share not supported");
    }
    throw error;
  }
}

export async function shareOrDownload(
  blob: Blob,
  filename: string,
  title: string,
): Promise<void> {
  const file = new File([blob], filename, { type: blob.type });

  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title });
      return;
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return;
  }

  await downloadBlob(blob, filename);
}

export async function fileToDataUrl(file: File, max = 512): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const scale = Math.min(1, max / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not read image");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

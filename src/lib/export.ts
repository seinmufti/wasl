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
  const format = dataUrl.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
  pdf.addImage(dataUrl, format, 0, 0, 210, 297, undefined, "FAST");
  return pdf.output("blob");
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

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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

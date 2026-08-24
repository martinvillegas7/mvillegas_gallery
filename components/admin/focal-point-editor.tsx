"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  clampFocalPoint,
  DEFAULT_FOCAL_POINT,
  focalPointStyle,
  type FocalPoint,
  type GalleryImage,
} from "@/lib/gallery-types";

type FocalPointEditorProps = {
  image: GalleryImage;
  onChange: (point: FocalPoint) => void;
  onClose: () => void;
};

type ImageBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function containedImageBox(
  container: DOMRect,
  naturalWidth: number,
  naturalHeight: number
): ImageBox {
  const widthRatio = container.width / Math.max(naturalWidth, 1);
  const heightRatio = container.height / Math.max(naturalHeight, 1);
  const scale = Math.min(widthRatio, heightRatio);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  return {
    left: (container.width - width) / 2,
    top: (container.height - height) / 2,
    width,
    height,
  };
}

function pointFromPointer(
  clientX: number,
  clientY: number,
  container: DOMRect,
  box: ImageBox
): FocalPoint {
  const x = ((clientX - container.left - box.left) / box.width) * 100;
  const y = ((clientY - container.top - box.top) / box.height) * 100;
  return clampFocalPoint({ x, y });
}

export default function FocalPointEditor({
  image,
  onChange,
  onClose,
}: FocalPointEditorProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragging = useRef(false);
  const [point, setPoint] = useState<FocalPoint>(
    image.focalPoint ?? DEFAULT_FOCAL_POINT
  );
  const [box, setBox] = useState<ImageBox>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const measure = useCallback(() => {
    const frame = frameRef.current;
    const img = imageRef.current;
    if (!frame || !img || !img.naturalWidth) {
      return;
    }
    setBox(
      containedImageBox(
        frame.getBoundingClientRect(),
        img.naturalWidth,
        img.naturalHeight
      )
    );
  }, []);

  const updatePoint = useCallback(
    (clientX: number, clientY: number) => {
      const frame = frameRef.current;
      const img = imageRef.current;
      if (!frame || !img || !img.naturalWidth) {
        return;
      }
      const frameRect = frame.getBoundingClientRect();
      const nextBox = containedImageBox(
        frameRect,
        img.naturalWidth,
        img.naturalHeight
      );
      const next = pointFromPointer(clientX, clientY, frameRect, nextBox);
      setPoint(next);
      onChange(next);
    },
    [onChange]
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", measure);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", measure);
    };
  }, [measure, onClose]);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!dragging.current) {
        return;
      }
      updatePoint(event.clientX, event.clientY);
    };
    const handleUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [updatePoint]);

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="Ajustar recorte de la miniatura"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl p-5 md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold">Recorte de miniatura</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Haz clic o arrastra el punto sobre la foto para elegir qué parte se
              ve en las miniaturas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-5 items-start">
          <div
            ref={frameRef}
            className="relative bg-muted rounded-xl overflow-hidden h-[280px] md:h-[420px] cursor-crosshair"
            onPointerDown={(event) => {
              event.preventDefault();
              dragging.current = true;
              updatePoint(event.clientX, event.clientY);
            }}
          >
            <img
              ref={imageRef}
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
              onLoad={measure}
            />
            {box.width > 0 ? (
              <span
                className="absolute w-5 h-5 rounded-full border-2 border-white bg-foreground/70 shadow pointer-events-none"
                style={{
                  left: box.left + (point.x / 100) * box.width - 10,
                  top: box.top + (point.y / 100) * box.height - 10,
                }}
              />
            ) : null}
          </div>

          <div>
            <p className="text-sm font-serif mb-2">Miniatura</p>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted">
              <img
                src={image.src}
                alt=""
                className="w-full h-full object-cover"
                style={focalPointStyle(point)}
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full px-4 py-2.5 bg-foreground text-background font-serif text-sm rounded-full hover:opacity-85 cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

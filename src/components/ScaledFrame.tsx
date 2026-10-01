import { useLayoutEffect, useRef, useState } from "react";

type ScaledFrameProps = {
  src: string;
  title: string;
  width: number;
  height: number;
  /* "width": fills its box's width; "contain": fits inside its box, never above 100 % */
  fit: "width" | "contain";
  className?: string;
};

/* A page shown at the exact size of a device, scaled down to its box */
export function ScaledFrame({ src, title, width, height, fit, className }: ScaledFrameProps) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    const measure = () =>
      setScale(
        fit === "width"
          ? element.clientWidth / width
          : Math.min(1, element.clientWidth / width, element.clientHeight / height),
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [fit, width, height]);

  return (
    <div ref={box} className={className}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        tabIndex={-1}
        style={{
          width,
          height,
          transform: fit === "width" ? `scale(${scale})` : `translate(-50%, -50%) scale(${scale})`,
        }}
      />
    </div>
  );
}

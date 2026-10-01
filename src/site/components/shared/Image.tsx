import type { CSSProperties } from "react";

type ImageProps = {
  src: string | { src: string };
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  /* Loads at once instead of when it scrolls into view */
  preload?: boolean;
  placeholder?: string;
};

/* An image; "fill" makes it cover its positioned parent */
export default function Image({ src, alt, fill, sizes, className, style, width, height, preload }: ImageProps) {
  return (
    <img
      src={typeof src === "string" ? src : src.src}
      alt={alt}
      sizes={sizes}
      width={width}
      height={height}
      className={className}
      loading={preload ? "eager" : "lazy"}
      decoding="async"
      style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style}
    />
  );
}

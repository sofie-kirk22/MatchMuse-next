import Image from "next/image";

type IconProps = {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  size?: number;
  className?: string;
};

export default function Icon({
  lightSrc,
  darkSrc,
  alt,
  size = 24,
  className = "",
}: IconProps) {
  return (
    <picture>
      {/* Dark mode */}
      <source
        srcSet={darkSrc}
        media="(prefers-color-scheme: dark)"
      />

      {/* Light mode fallback */}
      <Image
        src={lightSrc}
        alt={alt}
        width={size}
        height={size}
        className={className}
        priority
      />
    </picture>
  );
}
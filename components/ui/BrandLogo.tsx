interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className, size = 36 }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Outer circle — uses the accent CSS variable */}
      <circle
        cx="18"
        cy="18"
        r="17"
        stroke="var(--accent)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* K letterform — uses currentColor (inherits text color) */}
      <line
        x1="11" y1="9" x2="11" y2="27"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="11" y1="18" x2="22" y2="9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="11" y1="18" x2="23" y2="27"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Accent dot */}
      <circle cx="26" cy="18" r="2" fill="var(--accent)" />
    </svg>
  );
}

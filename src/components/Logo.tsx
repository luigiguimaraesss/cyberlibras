export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        d="M24 5 40 11v12c0 9.600-6.800 16.300-16 19.500C14.800 39.300 8 32.600 8 23V11L24 5Z"
        fill="#2563EB"
        stroke="#60A5FA"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="m16.500 24 5.500 5.500L32 18.500" fill="none" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

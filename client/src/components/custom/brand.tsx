export default function Brand({
  brandText,
  className,
}: {
  brandText: string;
  className?: string;
}) {
  return (
    <h1
      style={{
        fontFamily: "'Poppins', serif",
      }}
      className={`brand ${className} w-full h-full`}
    >
      {brandText}
    </h1>
  );
}

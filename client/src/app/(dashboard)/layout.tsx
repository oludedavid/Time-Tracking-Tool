export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <h1>Dashboard Layout</h1>
      {children}
    </div>
  );
}

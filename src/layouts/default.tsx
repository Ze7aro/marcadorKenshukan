export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <main>{children}</main>
      <footer className="w-full h-8 flex gap-4 absolute z-[9999] bottom-0 items-center justify-start px-10" />
    </div>
  );
}

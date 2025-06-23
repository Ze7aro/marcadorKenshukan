import { Image } from "@heroui/react";
import Logo from "@/assets/images/Logo-2.png";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <main>{children}</main>
      <footer className="w-full flex gap-4 absolute z-[9999] bottom-0 items-center justify-start px-10">
        <span className="bg-gradient-to-r from-white via-gray-300 to-blue-500 bg-clip-text text-transparent font-semibold italic">
          Designed by
        </span>
        <Image alt="Logo" height={60} src={Logo} width={50} />
      </footer>
    </div>
  );
}

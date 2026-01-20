import SideNav from "@/app/ui/side_nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="h-screen flex flex-row w-screen">{children}</div>
    </>
  );
}

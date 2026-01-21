import MiddleWare from "../lib/middleware";
import SideNav from "../ui/side_nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <div className="h-screen flex flex-row w-screen">
        <SideNav />
        {children}
      </div>
    </>
  );
}

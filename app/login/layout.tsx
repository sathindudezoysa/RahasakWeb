import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh w-screen">
      <div className="flex-1" style={{ position: "relative" }}>
        <Image
          src={"/wallpaper.jpg"}
          fill
          style={{ objectFit: "cover" }}
          className="hidden md:block"
          alt="walpaper"
        />
      </div>
      <div className="mx-8">
        <div className="flex flex-col">
          <div className="flex justify-start items-center my-20">
            <div>
              <Image src={"/logo.png"} width={50} height={50} alt="logo" />
            </div>
            <div>
              <p style={{ fontWeight: "bold", fontSize: "14pt" }}>Rahasak</p>
            </div>
          </div>
          <div className="flex flex-col items-center">{children}</div>
        </div>
      </div>
    </div>
  );
}

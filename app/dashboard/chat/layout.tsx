import ChatList from "@/app/ui/chatwindow/chatlist";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row w-full h-full">
      <ChatList />
      {children}
    </div>
  );
}

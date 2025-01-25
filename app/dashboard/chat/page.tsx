import ChatBox from "@/app/ui/chatwindow/chatbox";
import ChatContent from "@/app/ui/chatwindow/chatcontent";
import ChatHeader from "@/app/ui/chatwindow/chatheader";

export default function Chat() {
  return (
    <>
      <div className="flex-1 bg-slate-100  ml-4 flex flex-col w-full min-w-[400px]">
        <ChatHeader />
        <div className="ml-10 mr-10 flex flex-col h-full">
          <ChatContent />
          <ChatBox />
        </div>
      </div>
    </>
  );
}

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function ChatBox() {
  return (
    <>
      <div className="flex items-center pt-2 pb-2 h-15">
        <form className="flex items-center justify-center w-full">
          <input
            className="flex w-full h-10 rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
            placeholder="Type your message"
          />
          <button className=" ml-2 inline-flex size-10 items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] ">
            <PaperAirplaneIcon className="size-6 " />
          </button>
        </form>
      </div>
    </>
  );
}

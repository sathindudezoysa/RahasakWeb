export default function ChatHeader({ name }: { name: string }) {
  return (
    <>
      <div className="flex  min-h-[93px] w-full border-b-2 ">
        <div className=" flex flex-row h-full ml-4">
          <div className="flex-1 self-center font-semibold text-lg">{name}</div>
        </div>
      </div>
    </>
  );
}

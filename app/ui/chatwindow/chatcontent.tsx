export default function ChatContent({ query }: { query: string }) {
  return (
    <>
      <div className="flex-1 h-full flex flex-col">
        <div className="flex flex-row mt-5 bg-slate-200 rounded-tl-3xl  rounded-r-3xl self-start">
          <div className="p-5">Hello this is a message</div>
        </div>
        <div className="flex flex-row mt-5 bg-blue-700 text-white rounded-tr-3xl  rounded-l-3xl self-end ">
          <div className="p-5">This is the second message</div>
        </div>
      </div>
    </>
  );
}

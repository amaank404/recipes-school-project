export default function Popup({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-opacity-50 bg-black w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center">
      {children}
    </div>
  );
}

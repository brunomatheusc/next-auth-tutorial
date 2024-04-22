import Navbar from "./_components/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen h-full flex flx-col gap-y-10 items-center justify-center main-bg">
      <Navbar />
      
      {children}
    </div>
  );
}

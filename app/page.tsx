import MunicipalCodeChat from "@/components/MunicipalCodeChat";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-8">Chat with MuniCode</h1>
      <MunicipalCodeChat />
    </div>
  );
}

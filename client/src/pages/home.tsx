import { Card, CardContent } from "@/components/ui/card";
import FileUploader from "@/components/FileUploader";
import FolderList from "@/components/FolderList";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 space-y-8">
      <header className="text-center space-y-4">
        <img 
          src="/Logo_AAAJ-Basquet-01.png" 
          alt="AAAJ Basquet Logo" 
          className="h-32 mx-auto"
        />
        <h1 className="text-4xl font-bold text-[#E31B23] mb-2">AAAJ Basquet Fotos</h1>
        <p className="text-[#1B3C84]">
          Arrastra y suelta tus fotos y videos o selecciónalos desde tu dispositivo
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <Card className="border-2 border-[#E31B23]/10">
          <CardContent className="p-6">
            <FileUploader />
          </CardContent>
        </Card>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-center text-[#1B3C84]">
            Todas las fotos de los bichitos
          </h2>
          <FolderList />
        </section>
      </main>
    </div>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import FileUploader from "@/components/FileUploader";
import FolderList from "@/components/FolderList";
import { useState } from "react";

export default function Home() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#EB2D2E] text-white p-8 space-y-4">
        {!logoError ? (
          <img 
            src="/Logo_AAAJ-Basquet-01.png" 
            alt="AAAJ Basquet Logo" 
            className="h-32 w-auto mx-auto object-contain"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="h-32 flex items-center justify-center">
            <span className="text-2xl font-bold">AAAJ BASQUET</span>
          </div>
        )}
        <h1 className="text-4xl font-bold text-center">AAAJ Basquet Fotos</h1>
        <p className="text-center text-white/90">
          Arrastra y suelta tus fotos y videos o selecciónalos desde tu dispositivo
        </p>
      </header>

      <main className="flex-1">
        <section className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="border-2 border-[#EB2D2E]/10">
              <CardContent className="p-6">
                <FileUploader />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-[#005DA3] py-12">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">
              Todas las fotos
            </h2>
            <FolderList />
          </div>
        </section>
      </main>
    </div>
  );
}
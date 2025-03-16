import { Card, CardContent } from "@/components/ui/card";
import FileUploader from "@/components/FileUploader";
import FolderList from "@/components/FolderList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">AAAJ Basquet Fotos</h1>
        <p className="text-muted-foreground">
          Arrastra y suelta tus fotos y videos o selecciónalos desde tu dispositivo
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="p-6">
            <FileUploader />
          </CardContent>
        </Card>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Todas las fotos de los bichitos
          </h2>
          <FolderList />
        </section>
      </main>
    </div>
  );
}

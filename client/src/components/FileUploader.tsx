import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

function FileUploader() {
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        const reader = new FileReader();

        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            const cleanBase64 = result.split(",")[1]; // Remueve encabezado tipo "data:image/jpeg;base64,"
            resolve(cleanBase64);
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        const payload = {
          file: base64,
          type: file.type,
          name: file.name,
        };

        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbxOJ6V6UyGOUU24vrEd3H0046HsbZDGS8exM2CYR-L0QUTzIX2RtRAw4Fckmy6CH6aA/exec",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const resultado = await res.json();

        if (resultado.message) {
          return resultado;
        } else {
          throw new Error(resultado.error || "Error desconocido");
        }
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "¡Éxito!",
        description: "Archivo subido correctamente: " + data.name,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo subir el archivo",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        uploadMutation.mutate(file);
      });
    },
    [uploadMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "video/*": [".mp4", ".mov", ".avi"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors
        ${isDragActive ? "border-[#E31B23] bg-[#E31B23]/5" : "border-[#1B3C84]/20"}
        ${uploadMutation.isPending ? "pointer-events-none opacity-50" : ""}
      `}
    >
      <input {...getInputProps()} />
      <Upload
        className={`mx-auto h-12 w-12 mb-4 ${
          isDragActive ? "text-[#E31B23]" : "text-[#1B3C84]"
        }`}
      />
      {isDragActive ? (
        <p className="text-lg text-[#E31B23]">Suelta los archivos aquí</p>
      ) : (
        <p className="text-lg text-[#1B3C84]">
          Arrastrá y soltá archivos aquí, o hacé clic para seleccionar
        </p>
      )}
      <p className="text-sm text-[#1B3C84]/70 mt-2">
        Formatos aceptados: JPG, PNG, GIF, MP4, MOV, AVI
      </p>
      {uploadMutation.isPending && (
        <div className="mt-4">
          <Progress value={33} className="h-2" />
          <p className="text-sm text-[#1B3C84]/70 mt-2">Subiendo archivo...</p>
        </div>
      )}
    </div>
  );
}

export default FileUploader;

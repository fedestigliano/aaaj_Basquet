import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function FileUploader() {
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiRequest("POST", "/api/files", formData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Éxito!",
        description: "Archivo subido correctamente",
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
    [uploadMutation],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors
        ${isDragActive ? "border-primary bg-primary/10" : "border-muted"}
        ${uploadMutation.isPending ? "pointer-events-none opacity-50" : ""}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      {isDragActive ? (
        <p className="text-lg">Suelta los archivos aquí</p>
      ) : (
        <p className="text-lg">
          Arrastra y suelta archivos aquí, o haz clic para seleccionar
        </p>
      )}
      <p className="text-sm text-muted-foreground mt-2">
        Formatos aceptados: JPG, PNG, GIF, MP4, MOV, AVI
      </p>
      {uploadMutation.isPending && (
        <div className="mt-4">
          <Progress value={33} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Subiendo archivo...</p>
        </div>
      )}
    </div>
  );
}

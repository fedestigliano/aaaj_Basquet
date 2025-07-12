import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function FileUploader() {
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbwUBdAOEUAa5iu3qR2hM3XH36XQoTQYp6DqlMArU3f8kfQFRXk7CiJv0ea845b-jNxx/exec",
          {
            method: "POST",
            body: formData,
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
    [uploadMutation],
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
        className

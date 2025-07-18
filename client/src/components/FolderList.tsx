import { useQuery } from "@tanstack/react-query";
import { Folder } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Folder as FolderType } from "@shared/schema";

export default function FolderList() {
  const { data: folders, isLoading } = useQuery<FolderType[]>({
    queryKey: ["/api/folders"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-white border-white/10">
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full bg-[#1B3C84]/10" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!folders?.length) {
    return (
      <Card className="bg-white border-white/10">
        <CardContent className="p-6 text-center text-[#1B3C84]">
          No hay carpetas disponibles
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {folders.map((folder) => (
        <Card key={folder.id} className="bg-white border-white/10 hover:border-[#E31B23]/20 transition-colors">
          <CardContent className="p-6 flex items-center gap-3">
            <Folder className="h-8 w-8 text-[#E31B23]" />
            <span className="font-medium text-[#1B3C84]">{folder.name}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
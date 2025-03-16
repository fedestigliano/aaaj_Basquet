import { files, folders, type File, type InsertFile, type Folder, type InsertFolder } from "@shared/schema";

export interface IStorage {
  createFile(file: InsertFile): Promise<File>;
  listFiles(): Promise<File[]>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  listFolders(): Promise<Folder[]>;
}

export class MemStorage implements IStorage {
  private files: Map<number, File>;
  private folders: Map<number, Folder>;
  private currentFileId: number;
  private currentFolderId: number;

  constructor() {
    this.files = new Map();
    this.folders = new Map();
    this.currentFileId = 1;
    this.currentFolderId = 1;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.currentFileId++;
    const file: File = {
      ...insertFile,
      id,
      uploadedAt: new Date(),
    };
    this.files.set(id, file);
    return file;
  }

  async listFiles(): Promise<File[]> {
    return Array.from(this.files.values());
  }

  async createFolder(insertFolder: InsertFolder): Promise<Folder> {
    const id = this.currentFolderId++;
    const folder: Folder = {
      ...insertFolder,
      id,
    };
    this.folders.set(id, folder);
    return folder;
  }

  async listFolders(): Promise<Folder[]> {
    return Array.from(this.folders.values());
  }
}

export const storage = new MemStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { google } from "googleapis";
import multer from "multer";
import { insertFileSchema, insertFolderSchema } from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  app.post('/api/files', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No se ha enviado ningún archivo" });
      }

      const fileMetadata = {
        name: req.file.originalname,
        parents: [parentFolderId!],
      };

      const media = {
        mimeType: req.file.mimetype,
        body: req.file.buffer,
      };

      const driveFile = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id',
      });

      const fileData = insertFileSchema.parse({
        name: req.file.originalname,
        driveId: driveFile.data.id!,
        mimeType: req.file.mimetype,
      });

      const file = await storage.createFile(fileData);
      res.json(file);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al subir el archivo" });
    }
  });

  app.get('/api/folders', async (_req, res) => {
    try {
      const response = await drive.files.list({
        q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
      });

      const folders = response.data.files || [];
      
      for (const folder of folders) {
        const folderData = insertFolderSchema.parse({
          name: folder.name!,
          driveId: folder.id!,
        });
        await storage.createFolder(folderData);
      }

      const storedFolders = await storage.listFolders();
      res.json(storedFolders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener las carpetas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

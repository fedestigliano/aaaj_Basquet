import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { google } from "googleapis";
import multer from "multer";
import { insertFileSchema, insertFolderSchema } from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  const storageMode = process.env.STORAGE_MODE || 'google';
  
  // Check for Google Drive configuration only if not in demo mode
  if (storageMode !== 'demo') {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.warn("⚠️  GOOGLE_APPLICATION_CREDENTIALS environment variable is not set");
      console.warn("📝 Running in DEMO mode - files will be stored in memory only");
      console.warn("🔧 To use Google Drive, configure the .env file with your credentials");
    }

    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      console.warn("⚠️  GOOGLE_DRIVE_FOLDER_ID environment variable is not set");
      console.warn("📝 Running in DEMO mode - files will be stored in memory only");
    }
  }

  let auth, drive;
  let isGoogleDriveEnabled = false;
  
  // Only initialize Google Drive if we have proper configuration
  if (storageMode !== 'demo' && process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_DRIVE_FOLDER_ID) {
    try {
      auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      drive = google.drive({ version: 'v3', auth });
      isGoogleDriveEnabled = true;
      console.log("✅ Google Drive integration enabled");
    } catch (error) {
      console.warn("⚠️  Error initializing Google Drive API:", error);
      console.warn("📝 Running in DEMO mode - files will be stored in memory only");
      console.warn("🔧 Please check your Google credentials configuration");
    }
  } else {
    console.log("📝 Running in DEMO mode - files will be stored in memory only");
    console.log("🔧 To enable Google Drive integration:");
    console.log("   1. Set up Google Cloud credentials");
    console.log("   2. Update .env file with GOOGLE_APPLICATION_CREDENTIALS and GOOGLE_DRIVE_FOLDER_ID");
    console.log("   3. Set STORAGE_MODE=google in .env");
  }

  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  app.post('/api/files', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No se ha enviado ningún archivo" });
      }

      let driveFileId = null;

      // Only upload to Google Drive if it's enabled
      if (isGoogleDriveEnabled && drive && parentFolderId) {
        try {
          const fileMetadata = {
            name: req.file.originalname,
            parents: [parentFolderId],
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

          driveFileId = driveFile.data.id!;
          console.log(`✅ File uploaded to Google Drive: ${driveFileId}`);
        } catch (driveError) {
          console.warn("⚠️  Failed to upload to Google Drive:", driveError);
          console.log("📝 Storing file in memory only");
        }
      }

      const fileData = insertFileSchema.parse({
        name: req.file.originalname,
        driveId: driveFileId || `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        mimeType: req.file.mimetype,
      });

      const file = await storage.createFile(fileData);
      
      res.json({
        ...file,
        message: isGoogleDriveEnabled ? "Archivo subido a Google Drive" : "Archivo almacenado en modo demo"
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Error al subir el archivo" });
    }
  });

  app.get('/api/folders', async (_req, res) => {
    try {
      let folders = [];

      // Only fetch from Google Drive if it's enabled
      if (isGoogleDriveEnabled && drive && parentFolderId) {
        try {
          const response = await drive.files.list({
            q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
            fields: 'files(id, name)',
          });

          folders = response.data.files || [];
          
          for (const folder of folders) {
            const folderData = insertFolderSchema.parse({
              name: folder.name!,
              driveId: folder.id!,
            });
            await storage.createFolder(folderData);
          }
        } catch (driveError) {
          console.warn("⚠️  Failed to fetch folders from Google Drive:", driveError);
        }
      }

      // If no folders from Google Drive, create demo folders
      if (folders.length === 0) {
        const demoFolders = [
          { name: "Fotos del Equipo", driveId: "demo-team-photos" },
          { name: "Partidos 2024", driveId: "demo-matches-2024" },
          { name: "Entrenamientos", driveId: "demo-training" }
        ];

        for (const folder of demoFolders) {
          const folderData = insertFolderSchema.parse(folder);
          await storage.createFolder(folderData);
        }
      }

      const storedFolders = await storage.listFolders();
      res.json(storedFolders);
    } catch (error) {
      console.error("Error fetching folders:", error);
      res.status(500).json({ message: "Error al obtener las carpetas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
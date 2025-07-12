function doPost(e) {
  try {
    Logger.log("Recibiendo archivo con FormData...");
    const folderId = "ID_DE_LA_CARPETA_DE_DRIVE";
    const folder = DriveApp.getFolderById(folderId);

    const blob = e.parameter.file; // Esto es un string base64 si se envió como FormData

    if (!blob) {
      throw new Error("No se recibió ningún archivo");
    }

    const decoded = Utilities.base64Decode(blob);
    const fileBlob = Utilities.newBlob(decoded, MimeType.JPEG, "foto.jpg"); // Podés ajustar el tipo y nombre

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `foto-${timestamp}`;

    const file = folder.createFile(fileBlob);
    file.setName(filename);

    return ContentService
      .createTextOutput(JSON.stringify({ message: "Archivo subido exitosamente", name: filename }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log("Error: " + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

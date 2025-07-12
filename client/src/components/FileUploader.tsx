function doPost(e) {
  try {
    Logger.log("Recibiendo archivo con FormData...");

    const folderId = "18SJdEhVyGe-OljU6oy-2MtLxvzaAJlJK";
    const folder = DriveApp.getFolderById(folderId);

    const blob = e.parameter.file;

    if (!blob) {
      throw new Error("No se recibió ningún archivo");
    }

    const decoded = Utilities.base64Decode(blob);
    const fileBlob = Utilities.newBlob(decoded, MimeType.JPEG, "foto.jpg");

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

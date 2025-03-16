# AAAJ Basquet Fotos

Aplicación web para cargar y gestionar fotografías de AAAJ Basquet, con subida directa a Google Drive.

## Características

- Subida de fotos y videos directamente a Google Drive
- Interfaz de usuario intuitiva en español
- Visualización de carpetas existentes
- Soporte para múltiples formatos de archivo (JPG, PNG, GIF, MP4, MOV, AVI)

## Requisitos

- Node.js (versión 20 o superior)
- Credenciales de Google Drive API
- ID de carpeta de Google Drive para almacenamiento

## Configuración

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd aaaj-basquet-fotos
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
- Crear un archivo `.env` en la raíz del proyecto
- Agregar las siguientes variables:
```
GOOGLE_APPLICATION_CREDENTIALS=ruta/al/archivo/credenciales.json
GOOGLE_DRIVE_FOLDER_ID=id_de_la_carpeta
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Tecnologías

- React
- TypeScript
- Google Drive API
- Express
- TailwindCSS
- Shadcn/ui

## Licencia

Este proyecto es privado y para uso exclusivo de AAAJ Basquet.

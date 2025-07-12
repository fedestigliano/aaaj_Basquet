# AAAJ Basquet Fotos

Aplicación web para cargar y gestionar fotografías de AAAJ Basquet, con subida directa a Google Drive.

## Características

- Subida de fotos y videos directamente a Google Drive (opcional)
- Modo demo para pruebas sin configuración
- Interfaz de usuario intuitiva en español
- Visualización de carpetas existentes
- Soporte para múltiples formatos de archivo (JPG, PNG, GIF, MP4, MOV, AVI)

## Modos de Funcionamiento

### 🚀 Modo Demo (Recomendado para empezar)
- **Sin configuración necesaria**
- Los archivos se almacenan temporalmente en memoria
- Perfecto para probar la aplicación
- Carpetas de ejemplo incluidas 

### ☁️ Modo Google Drive (Para producción)
- Requiere configuración de Google Cloud
- Los archivos se suben a Google Drive
- Acceso compartido para múltiples usuarios
- Almacenamiento permanente

## Instalación Rápida

1. **Clonar el repositorio:**
```bash
git clone [URL_DEL_REPOSITORIO]
cd aaaj-basquet-fotos
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar en modo demo:**
```bash
npm run dev
```

¡Listo! La aplicación estará disponible en http://localhost:5000

## Configuración para Google Drive (Opcional)

Si quieres que los archivos se guarden permanentemente en Google Drive:

### Paso 1: Configurar Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Drive
4. Crea credenciales de cuenta de servicio
5. Descarga el archivo JSON de credenciales

### Paso 2: Configurar variables de entorno
1. Renombra el archivo de credenciales a `credentials.json`
2. Colócalo en la raíz del proyecto
3. Edita el archivo `.env`:

```env
# Cambiar de 'demo' a 'google' para habilitar Google Drive
STORAGE_MODE=google
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
GOOGLE_DRIVE_FOLDER_ID=tu_id_de_carpeta_aqui
```

### Paso 3: Obtener ID de carpeta de Google Drive
1. Ve a Google Drive
2. Crea una carpeta para las fotos
3. Abre la carpeta y copia el ID de la URL
   - Ejemplo: `https://drive.google.com/drive/folders/1ABC123...`
   - El ID es: `1ABC123...`

## Tecnologías

- React + TypeScript
- Express.js
- Google Drive API (opcional)
- TailwindCSS
- Shadcn/ui

## Solución de Problemas

### Error: "GOOGLE_APPLICATION_CREDENTIALS not set"
- **Solución**: La aplicación está funcionando en modo demo. No es un error real.
- **Para usar Google Drive**: Sigue la configuración de Google Drive arriba.

### Error: "Could not load default credentials"
- **Solución**: Verifica que el archivo `credentials.json` esté en la raíz del proyecto.
- **Alternativa**: Mantén `STORAGE_MODE=demo` para usar sin Google Drive.

### Las fotos no aparecen después de reiniciar
- **En modo demo**: Es normal, los archivos se almacenan en memoria.
- **Solución**: Configura Google Drive para almacenamiento permanente.

## Licencia

Este proyecto es privado y para uso exclusivo de AAAJ Basquet. 

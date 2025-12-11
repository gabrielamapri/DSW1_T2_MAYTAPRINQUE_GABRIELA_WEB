Aplicación (Libros + Préstamos)

Descripción breve:
- Hecho con React + TypeScript, empaquetado con Vite.
- Usa `axios` para llamadas HTTP y `react-router` para rutas.
- Código enfocado a CRUD de Libros y gestión de Préstamos.
- Consume las APIs REST del backend (prefijo `/api`).
- Paquetes / prerequisitos: Node.js (v16+) y `npm` (ejecutar `npm install` dentro de `frontend`).

Instrucciones mínimas

- Puertos por defecto:
- Frontend (Vite dev): http://localhost:5173
- Backend (API .NET): http://localhost:5185 (en el repositorio https://github.com/gabrielamapri/DSW1_T2_MAYTAPRINQUE_GABRIELA_API)

  Nota rápida: asegúrate de arrancar ambos (API y frontend). Si la UI no carga, comprueba que la API está en `VITE_API_URL` (por defecto `http://localhost:5185`).


```powershell
# Preferible: arrancar primero la API (backend) en otra terminal (terminal del backend)
cd path\to\DSW1_T2_MAYTAPRINQUE_GABRIELA_API\
dotnet run --project src\Library.API\Library.API.csproj
```

Pasos para ejecutar este frontend (terminal del frontend — IMPORTANTE que este en Command Prompt):

```cmd
# 1) Ir al directorio del frontend (IMPORTANTE)
cd frontend

# 2) Instalar dependencias (solo la primera vez o si cambias package.json)
npm install

# 3) (Opcional) Si tu backend corre en otro puerto distinto de 5185

Si la API no está en `http://localhost:5185`, crea un archivo `frontend/.env` con esta línea y ajusta la URL al puerto correcto:

```text
VITE_API_URL=http://localhost:5185
```

# 4) Arrancar el dev server (Vite)
npm run dev
```

# 5) Abrir la aplicación en el navegador
Abre `http://localhost:5173` en tu navegador y utiliza la interfaz (Libros + Préstamos). 

-

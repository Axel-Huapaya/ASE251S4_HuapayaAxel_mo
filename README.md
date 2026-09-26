# AgroPacayales Mobile

Aplicación móvil del proyecto **Agro Pacayales S.A.C.** (Equipo 5, ASE251S4 – Sprint 7) para la gestión agrícola: acceso de usuarios, panel de inicio, **CRUD maestro de Parcelas** y gestión de Cultivos.

- **Estudiante:** Huapaya Huari, Axel Victor
- **Unidad didáctica:** DAM – Desarrollo de Aplicaciones Móviles
- **Repositorio individual:** `ASE251S4_HuapayaHuariAxelVictor_mo` (rama `develop`)
- **Repositorio grupal:** `ASE251S4_T05_mo` (rama `develop`)

## Tecnologías

| Componente | Tecnología | Versión |
|---|---|---|
| Plataforma | Expo SDK | ~54.0.35 |
| Interfaz móvil | React Native | 0.81.5 |
| Lenguaje | TypeScript / React | ~5.9.2 / 19.1.0 |
| Navegación | Expo Router + React Navigation (bottom-tabs) | ~6.0.24 / ^7.x |
| Sesión local | AsyncStorage | 2.2.0 |
| Exportación | expo-print, expo-sharing, expo-file-system | ~15.0.8 / ~14.0.8 / ~19.0.23 |

## Funcionalidades

- **Login:** validación de campos, mensajes de error (credenciales inválidas / sin conexión) y sesión guardada localmente.
- **Inicio:** fecha del día, totales de cultivos, parcelas y usuarios, y accesos a los módulos.
- **Parcelas (CRUD maestro):** listar, registrar, editar, eliminación lógica, restauración, filtro activos/inactivos y exportación a PDF y Excel (CSV).
- **Cultivos:** CRUD dependiente de la parcela asociada, con eliminación lógica y restauración.
- **Cerrar sesión** con confirmación; borra la sesión guardada.

## Estructura del proyecto

Organizada por capas, según la estructura definida para el Proyecto Móvil del 4.º semestre.

```
app/                        # Expo Router: cada archivo = una pantalla
├── (tabs)/
│   ├── _layout.tsx         # Pestañas: iconos, títulos, cierre de sesión
│   ├── index.tsx           # Inicio
│   ├── cultivos.tsx        # Gestión de cultivos
│   ├── parcelas.tsx        # CRUD maestro de parcelas
│   └── logout.tsx          # Pestaña que dispara el cierre de sesión
├── _layout.tsx             # Layout raíz: Stack + proveedores (tema y sesión)
└── login.tsx               # Pantalla pública
components/
├── common/                 # Reutilizables globales
│   ├── app-button.tsx  app-input.tsx  app-header.tsx  screen-container.tsx
│   └── index.ts
└── ui/                     # Visuales específicos (tarjetas, modal de formulario, filtros)
constants/                  # colors.ts · config.ts (BASE_URL, timeout, claves) · theme.ts
hooks/                      # use-auth · use-theme · use-parcelas · use-cultivos
services/                   # Llamadas HTTP y AsyncStorage: http · auth · parcela · cultivo · usuario · exportación
store/                      # Estado global con Context: auth.store.tsx · theme.store.tsx
types/                      # Interfaces TypeScript por entidad + index.ts
utils/                      # storage.ts · validators.ts · formatters.ts
assets/images/              # Íconos, logos y fondos
```

## Requisitos

- Node.js LTS y npm
- App **Expo Go** (SDK 54) en el celular, o un emulador Android/iOS
- Backend del proyecto encendido y accesible desde la red del dispositivo

## Instalación y ejecución

```bash
npm install
npx expo start
```

Escanea el código QR con Expo Go o presiona `a` (Android) / `i` (iOS).

## Configuración de la API

La dirección del backend se define en un solo lugar: `constants/config.ts` (`BASE_URL`). Para cambiarla sin tocar el código, copia `.env.example` como `.env.local` y ajusta la IP:

```
EXPO_PUBLIC_API_URL=http://192.168.1.50
```

Reinicia con `npx expo start -c` para que Expo tome la variable.

## API consumida (Parcelas)

| Operación | Método y ruta |
|---|---|
| Listar | `GET /api/parcelas` |
| Registrar | `POST /api/parcelas` |
| Editar | `PUT /api/parcelas/{idParcela}` |
| Eliminar (lógico) | `PATCH /api/parcelas/{idParcela}/eliminar` |
| Restaurar | `PATCH /api/parcelas/{idParcela}/restaurar` |

## Flujo de ramas

`main` guarda versiones estables; el trabajo diario se integra en `develop`.

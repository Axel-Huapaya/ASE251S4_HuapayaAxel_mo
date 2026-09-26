# AgroPacayales Mobile

Aplicación móvil del proyecto **Agro Pacayales S.A.C.** para la gestión agrícola: autenticación, panel de inicio con métricas en tiempo real, **CRUD maestro de Usuarios**, **CRUD maestro de Parcelas** y **CRUD de Cultivos**.

- **Estudiante:** Huapaya Huari, Axel Victor
- **Unidad didáctica:** DAM – Desarrollo de Aplicaciones Móviles
- **Repositorio individual:** `ASE251S4_HuapayaHuariAxelVictor_mo` (rama `develop`)

---

## 🛠️ Tecnologías

| Componente | Tecnología | Versión |
|---|---|---|
| Plataforma | Expo SDK | `~54.0.35` |
| Interfaz móvil | React Native | `0.81.5` |
| Lenguaje | TypeScript / React | `~5.9.2` / `19.1.0` |
| Navegación | Expo Router + React Navigation | `~6.0.24` / `^7.x` |
| Sesión local | AsyncStorage | `2.2.0` |
| Exportación | expo-print, expo-sharing, expo-file-system | `~15.0.8` / `~14.0.8` / `~19.0.23` |

---

## ✨ Funcionalidades

- **🔐 Login:** Validación de credenciales en tiempo real (`POST /api/auth/login`), mensajes descriptivos de error y persistencia de sesión en almacenamiento local.
- **📊 Inicio (Dashboard):** Fecha en formato largo, indicadores en tiempo real (totales de Cultivos, Parcelas y Usuarios) y resiliencia con `Promise.allSettled()`.
- **👥 Usuarios (CRUD Maestro):** Listar, registrar, editar, desactivar y restaurar usuarios. Incluye filtro por estado (Activos/Inactivos) y búsqueda instantánea por nombre, correo o rol.
- **🌱 Parcelas (CRUD Maestro):** Listar, registrar, editar, eliminación y restauración lógica, filtros y exportación a formatos PDF y CSV (Excel).
- **🌿 Cultivos:** CRUD reactivo vinculado a parcelas operativas, con eliminación lógica y restauración.
- **🚪 Cerrar Sesión:** Modal de confirmación con limpieza de credenciales locales.

---

## 📁 Estructura del Proyecto

Organizada por capas según las buenas prácticas de arquitectura React Native / Expo:

```text
app/                        # Expo Router (Rutas y Pantallas)
├── (tabs)/
│   ├── _layout.tsx         # Pestañas inferiores (Inicio, Cultivos, Parcelas, Usuarios, Salir)
│   ├── index.tsx           # Dashboard de Inicio
│   ├── cultivos.tsx        # Gestión de Cultivos
│   ├── parcelas.tsx        # CRUD Maestro de Parcelas
│   ├── usuarios.tsx        # CRUD Maestro de Usuarios
│   └── logout.tsx          # Confirmación de salida
├── _layout.tsx             # Layout raíz (Stack y proveedores de contexto)
└── login.tsx               # Pantalla de inicio de sesión
components/
├── common/                 # Componentes genéricos (AppButton, AppInput, AppHeader, ScreenContainer)
└── ui/                     # Componentes visuales (EntityCard, EstadoBadge, EstadoToggle, FormModal, ListHeader, ModuleCard, StatCard)
constants/                  # Configuración (colors.ts, config.ts, theme.ts)
hooks/                      # Hooks personalizados (use-auth, use-usuarios, use-parcelas, use-cultivos)
services/                   # Capa de consumo de API REST HTTP (auth, usuario, parcela, cultivo, exportación)
types/                      # Interfaces TypeScript (auth, usuario, parcela, cultivo)
utils/                      # Utilidades (validators.ts, formatters.ts, storage.ts)
```

---

## 🚀 Requisitos e Instalación

1. **Requisitos:** Node.js LTS, npm y la aplicación **Expo Go** (SDK 54) en un teléfono inteligente o emulador.
2. **Instalación:**
   ```bash
   npm install
   ```
3. **Ejecución:**
   ```bash
   npx expo start
   ```

---

## 🌐 Configuración de la API Backend

La dirección del backend se configura mediante variables de entorno en el archivo `.env.local`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.50:8081
```

*Reinicia el servidor de Expo con `npx expo start -c` para recargar la configuración.*

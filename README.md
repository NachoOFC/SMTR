# SMTR - Sistema de Monitoreo en Tiempo Real

Sistema de monitoreo en tiempo real para activos eléctricos. Supervisa, gestiona y rastrea el estado y rendimiento de infraestructura eléctrica mediante sensores y dashboards interactivos.

## Descripción

SMTR permite el monitoreo de componentes eléctricos como tableros de distribución, bancos de baterías UPS, motores de portón y lámparas. El sistema clasifica los activos en categorías de estado (Crítico, Precaución, Bueno) basándose en umbrales configurables de temperatura, consumo, vibración y otros parámetros.

## Características principales

- **Monitoreo en tiempo real** de activos eléctricos con clasificación de estado automática
- **Dashboard interactivo** con gráficos de líneas, áreas, barras y radar
- **Sistema de alertas** con acciones (generar reporte, marcar resuelto, notificar técnico)
- **Gestión de mantenimiento** con sincronización en tiempo real (Firestore)
- **Generación de reportes PDF** desde detalles de activos
- **Autenticación** con Firebase Auth (email/password)
- **Modo oscuro/claro** con persistencia en localStorage
- **Diseño responsivo** con sidebar en desktop y navbar inferior en móvil
- **Simulación de datos** con script en Python que envía datos a Firebase

## Roles de usuario

| Rol | Permisos |
|-----|----------|
| **Usuario** | Ver activos, alertas, gráficos, reportes, mantenimiento |
| **Técnico** | Todo lo anterior + gestión de solicitudes de soporte |

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Framework | Nuxt 3 (Vue 3) |
| UI | Bootstrap 5 + Bootstrap Icons |
| Gráficos | Chart.js + vue-chartjs |
| Base de datos | Firebase Realtime Database + Firestore |
| Autenticación | Firebase Auth |
| PDF | jsPDF + html2pdf.js |
| Simulación | Python (Firebase Admin SDK) |

## Estructura del proyecto

```
SMTR/
├── pages/                    # 11 rutas de páginas
│   ├── login.vue             # Inicio de sesión
│   ├── principal.vue         # Dashboard principal
│   ├── graficos.vue          # Gráficos y análisis
│   ├── alertas.vue           # Centro de alertas
│   ├── historial.vue         # Historial de alertas
│   ├── reportes.vue          # Gestión de reportes
│   ├── mantenimientos.vue    # Registros de mantenimiento
│   ├── solicitudes.vue       # Solicitudes (solo técnico)
│   └── ayuda.vue             # Centro de ayuda
├── components/               # 15 componentes reutilizables
│   ├── Sidebar.vue           # Navegación lateral
│   ├── Topbar.vue            # Barra superior
│   ├── AlertList.vue         # Panel de alertas
│   ├── AssetCard.vue         # Tarjeta de activo
│   ├── StatusGraph.vue       # Gráfico de estado
│   └── charts/               # Componentes de gráficos
├── composables/              # Lógica reutilizable
│   ├── useAssets.js          # Obtención de activos desde Firebase
│   └── useTemperatureData.js # Motor de simulación de datos
├── plugins/                  # Plugins de Nuxt
│   ├── firebase.js           # Inicialización de Firebase
│   └── auth.js               # Guard de autenticación
├── middleware/
│   └── auth.js               # Middleware de rutas protegidas
├── store/
│   └── demoData.js           # Almacenamiento reactivo con localStorage
├── CodigoSimulacion/         # Simulador de datos en Python
│   ├── SimuladorDatos.py     # Generador de datos de sensores
│   └── test_simulator.py     # Tests unitarios
└── public/                   # Assets estáticos (logo, APK, imágenes)
```

## Instalación

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Simulación de datos

El directorio `CodigoSimulacion/` contiene un script en Python que genera datos de sensores y los envía a Firebase cada 2 segundos.

```bash
cd CodigoSimulacion
pip install firebase-admin
python SimuladorDatos.py
```

## Build para producción

```bash
pnpm build
pnpm preview
```

## Licencia

Proyecto académico - Universidad

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Plataforma Consolidada de Indicadores - Carrera de Software

Aplicación web unificada que integra cuatro sistemas de indicadores académicos para la carrera de Ingeniería en Software, desarrollada con **React**, **TypeScript**, **Vite** y **Tailwind CSS**.

[Ver en AI Studio](https://ai.studio/apps/drive/1d9-1FUOVvouFtNgeOgfw93WtVxkraRL-)

## 📋 Descripción

Esta plataforma permite la visualización y análisis consolidado de indicadores de:

- **📊 Evaluación Docente** - Métricas y resultados de evaluaciones del profesorado
- **🎓 Titulación** - Seguimiento de trabajos de titulación y proyectos finales
- **🤝 Vinculación** - Gestión de proyectos de vinculación con la comunidad
- **📈 Indicadores Académicos** - Visión académica y de calidad de la carrera

## ✨ Características

- ✅ **Arquitectura Modular** - Cada módulo está encapsulado en carpetas independientes (`src/modules/`)
- ✅ **Navegación Unificada** - Selector de módulos en el header con menú lateral dinámico
- ✅ **Diseño Consistente** - Experiencia de usuario uniforme basada en Tailwind CSS
- ✅ **Visualización de Datos** - Gráficas interactivas con Recharts
- ✅ **TypeScript** - Código tipado para mayor mantenibilidad
- ✅ **Hot Reload** - Desarrollo ágil con Vite

## 🚀 Ejecución Local

### Prerrequisitos

- **Node.js** (versión recomendada: 18.x o superior)
- **npm** o **pnpm**

### Pasos de Instalación

1. **Clonar el repositorio** (si aplica):
   ```bash
   git clone <url-del-repositorio>
   cd plataforma-indicadores-sw
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   
   Crea un archivo `.env.local` en la raíz del proyecto y configura tu clave de API:
   ```env
   GEMINI_API_KEY=tu_clave_de_api_aqui
   ```

4. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con hot reload |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Vista previa de la build de producción |

## 🏗️ Estructura del Proyecto

```
plataforma-indicadores-sw/
├── src/
│   ├── core/              # Componentes compartidos y configuración global
│   │   ├── App.tsx        # Componente principal con estado global
│   │   ├── components/    # Header, Sidebar y componentes UI comunes
│   │   ├── main.tsx       # Punto de entrada de la aplicación
│   │   └── types.ts       # Tipos TypeScript compartidos
│   └── modules/           # Módulos por dominio
│       ├── evaluacion_docente/
│       ├── titulacion/
│       ├── vinculacion/
│       └── indicadores/
├── public/                # Assets estáticos
├── docs/                  # Documentación del proyecto
├── scripts/               # Scripts utilitarios
└── credentials/           # Credenciales (no commitear a Git)
```

## 🔧 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.2.0 | Framework UI |
| TypeScript | ~5.8.2 | Tipado estático |
| Vite | ^6.2.0 | Build tool y dev server |
| Tailwind CSS | - | Estilos utility-first |
| Recharts | ^3.2.1 | Gráficas y visualización |
| Lucide React | ^0.544.0 | Iconos |
| Heroicons React | ^2.2.0 | Iconos adicionales |
| React Markdown | ^10.1.0 | Renderizado de Markdown |
| Google GenAI | ^1.22.0 | Integración con IA |
| BigQuery | ^8.1.1 | Consultas de datos |

## 📄 Documentación Adicional

- [Plan de Implementación](docs/implementation_plan.md) - Plan detallado de la arquitectura
- [Walkthrough](docs/walkthrough.md) - Guía paso a paso del proceso de migración
- [Task Documentation](docs/task.md) - Documentación de tareas específicas

## 🔐 Configuración de Credenciales

Para la conexión con BigQuery, asegúrate de tener el archivo de credenciales en:
```
credentials/bq-key.json
```

⚠️ **Importante:** Nunca commits archivos con credenciales reales al repositorio.

## 🤝 Contribución

1. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
2. Realiza tus cambios y commit (`git commit -m 'Añadir nueva funcionalidad'`)
3. Push a la rama (`git push origin feature/nueva-funcionalidad`)
4. Abre un Pull Request

## 📝 Licencia

Este proyecto es parte de los sistemas internos de la carrera de Ingeniería en Software.

---

<div align="center">
  <p>Desarrollado con ❤️ para la Carrera de Ingeniería en Software</p>
</div>

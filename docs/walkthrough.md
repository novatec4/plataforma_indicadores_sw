# Plataforma Consolidada de Indicadores SW

## Objetivo
El usuario solicitó unificar cuatro proyectos independientes (Evaluación Docente, Titulación, Proyectos de Vinculación e Indicadores Académicos) en un solo sistema para la carrera de Software, manteniendo el estilo y experiencia de usuario del dashboard de "Evaluación Docente".

## Proceso de Migración

### 1. Creación del "Shell" Principal
Se utilizó como base el proyecto `evaluacion_docente_sw-main` copiándolo en una nueva carpeta `plataforma_indicadores_sw`. Esto aseguró heredar la configuración Vite, tailwindcss y dependencias (Recharts, Lucide, Google GenAI) con el estilo base solicitado.

### 2. Refactorización para Arquitectura Modular
- Se implementó un estado global (`AppModule`) en [App.tsx](file:///c:/Users/PC/Desktop/INDICADORES%20SW/plataforma_indicadores_sw/App.tsx) para coordinar qué módulo se encuentra activo.
- Se agregó un "Selector de Módulos" en el componente [Header.tsx](file:///c:/Users/PC/Desktop/INDICADORES%20SW/plataforma_indicadores_sw/components/Header.tsx).
- El componente [Sidebar.tsx](file:///c:/Users/PC/Desktop/INDICADORES%20SW/plataforma_indicadores_sw/components/Sidebar.tsx) ahora es dinámico y ajusta sus opciones de navegación dependiendo del módulo seleccionado.

### 3. Encapsulamiento de los 4 Proyectos en Componentes Modulares
Se movió el código principal (`App.tsx`) de cada aplicación a un componente aislado responsable de renderizar únicamente su propio contenido, manteniendo su lógica de obtención de datos y estados independientes, pero utilizando el cascarón visual principal.
- **[EvaluacionDocenteModule.tsx](file:///c:/Users/PC/Desktop/INDICADORES%20SW/plataforma_indicadores_sw/components/EvaluacionDocenteModule.tsx)**: Para Evaluación Docente.
- **[TitulacionModule.tsx](file:///c:/Users/PC/Desktop/INDICADORES%20SW/plataforma_indicadores_sw/components/TitulacionModule.tsx)**: Contiene la lógica, buscador y gráficas de los Trabajos de Titulación. (Archivos importados en `components/titulacion/` y `services/titulacion/`).
- **[VinculacionModule.tsx](file:///c:/Users/PC/Desktop/INDICADORES%20SW/plataforma_indicadores_sw/components/VinculacionModule.tsx)**: Maneja los datos y resúmenes de proyectos de vinculación de forma encapsulada.
- **[IndicadoresModule.tsx](file:///c:/Users/PC/Desktop/INDICADORES%20SW/plataforma_indicadores_sw/components/IndicadoresModule.tsx)**: Contiene la "Visión Académica" y "Visión de Calidad".

### 4. Resolución de Dependencias
Durante la integración se identificaron dependencias adicionales utilizadas por los otros módulos incompatibles inicialmente con el esqueleto. Se resolvieron mediante la instalación de (`@heroicons/react`, `react-markdown` y `react-is`).

## Resultados y Verificación
✅  El sistema es ahora un monorepo Vite donde el usuario puede alternar entre las 4 áreas temáticas a través del Header, mientras que el menú lateral actualiza sus atajos acorde a ello.
✅  Todas las gráficas y componentes base ahora comparten las directrices de CSS dictadas por el proyecto maestro original de Evaluación Docente.

### 5. Estructuración Modular (`src/core` y `src/modules`)
Por petición del usuario, se ejecutó una refactorización profunda de todo el repositorio abandonando la estructura plana en la raíz e implementando una arquitectura fundamentada en dominios (Feature-Based):
1. **`src/core/`**: Se movieron aquí componentes genéricos (`Header.tsx`, `Sidebar.tsx`, etc.), así como las configuraciones globales, `index.css`, y tipos de la interfaz unificada.
2. **`src/modules/`**: Cada uno de los sistemas cuenta ahora con una carpeta completamente aislada:
   - `@evaluacion_docente` 
   - `@titulacion` 
   - `@vinculacion`
   - `@indicadores`

Para lograr esto sin generar rutas relativas complejas, se crearon **Alias** (Path Mapping) en TypeScript (`tsconfig.json`) y Vite (`vite.config.ts`), mejorando inmensamente la trazabilidad y mantenimiento del código.

## Resultados Finales
✅ La aplicación es ahora 100% modular y permite seguir desarrollando funcionalidades en carpetas aisladas sin riesgo de interferencias cruzadas.
✅ El código de los 4 proyectos compila exitosamente como una sola aplicación Vite (puerto modificado bajo demanda, default `3000`).

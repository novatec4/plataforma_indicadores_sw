# Refactorización a Arquitectura Modular (Feature-Based)

## Objetivo
Reestructurar el repositorio `plataforma_indicadores_sw` para que tenga una arquitectura modular limpia y escalable. Actualmente, el proyecto principal ("Evaluación Docente") ensucia la raíz del proyecto y la carpeta global de `components/`. El objetivo es aislar cada aplicación en su propia carpeta bajo `/src/modules/` y dejar un núcleo compartido en `/src/core/`.

## Cambios Propuestos

### 1. Migración a directorio `src/`
Todo el código fuente se moverá a una carpeta unificada `src/`. Esto mejorará la organización en la raíz del proyecto.

### 2. Estructura de Directorios

Se definirá la siguiente estructura:

```text
plataforma_indicadores_sw/
├── src/
│   ├── core/                  # El cascarón principal (Shell) y componentes compartidos
│   │   ├── components/        # Header, Sidebar, ErrorBoundary, genéricos
│   │   ├── types/             # Tipos globales (AppModule, Page)
│   │   ├── App.tsx            # Enrutador principal de los módulos
│   │   └── main.tsx           # Punto de entrada de Vite
│   │
│   ├── modules/               # Todos los módulos aislados de manera equitativa
│   │   ├── evaluacion_docente/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   ├── titulacion/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   ├── vinculacion/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   └── indicadores/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types.ts
│   │
│   ├── index.css              # Estilos globales de Tailwind
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 3. Pasos de Ejecución
1. Crear la estructura de carpetas en `src/`.
2. Mover todos los archivos genéricos (`App.tsx`, `main.tsx`, `Header.tsx`, `Sidebar.tsx`, `index.css`) a `src/core/` (y ajustar `main.tsx`/`App.tsx` en `index.html` y configuraciones).
3. Agrupar la lógica específica de Evaluación Docente en `src/modules/evaluacion_docente/`.
4. Mover la lógica de Titulación desde `components/TitulacionModule.tsx` y `components/titulacion/` a `src/modules/titulacion/`.
5. Mover la lógica de Vinculación a `src/modules/vinculacion/`.
6. Mover la lógica de Indicadores Académicos a `src/modules/indicadores/`.
7. **Resolución Masiva de Imports**: Dado que toda la estructura cambiará, se utilizarán alias e importaciones relativas ajustadas (`@/core/`, `@/modules/`) configurando `tsconfig.json` y `vite.config.ts`.

## User Review Required
> [!IMPORTANT]
> Esta es una reestructuración profunda que modificará casi todos los archivos para ajustar sus ramas de importación (imports/exports). El servidor de desarrollo se romperá temporalmente durante el proceso hasta completar todas las migraciones de módulos.
>
> ¿Estás de acuerdo con esta arquitectura de `src/core/` y `src/modules/` para organizar el repositorio?

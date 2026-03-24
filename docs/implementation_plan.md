# Plan de Implementación: Consolidación de Módulos de Información

## Descripción del Objetivo
El objetivo es unificar cuatro aplicaciones independientes ("Proyectos de vinculación", "Evaluación docente", "Indicadores académicos", "Titulación") en una sola plataforma unificada para la carrera de Software. La plataforma resultante mantendrá el estilo visual, la experiencia de usuario y la arquitectura base del módulo de "Evaluación docente".

## User Review Required
> [!IMPORTANT]
> **Revisión de Arquitectura**
> La estrategia actual es usar el código de `evaluacion_docente_sw-main` como el esqueleto principal (layout, estilos de Tailwind, componentes base como Header, Sidebar, modales de IA). 
> Se añadirá un **Selector de Módulo** en la cabecera (Header) que permitirá cambiar entre las 4 áreas (Evaluación Docente, Indicadores Académicos, Vinculación, Titulación). 
> Al cambiar de módulo, el Sidebar actualizará dinámicamente sus opciones de navegación y el área principal mostrará los gráficos correspondientes a ese módulo. ¿Está de acuerdo con este flujo de navegación?

## Proposed Changes

### 1. Creación de la Plataforma Base
Se definirá un nuevo directorio `plataforma_indicadores_sw` basado íntegramente en la estructura y dependencias de `evaluacion_docente_sw-main`.

#### [NEW] `plataforma_indicadores_sw/` (Basado en evaluacion_docente_sw-main)
Se copiarán todos los archivos base (`vite.config.ts`, `package.json`, `index.html`, etc.).

---

### 2. Refactorización de Navegación y Estado Global (Contexto)
Para soportar múltiples módulos, necesitamos un estado global que determine qué aplicación estamos viendo.

#### [MODIFY] `src/App.tsx`
- Integrar un estado `currentModule` (ej: `'evaluacion' | 'indicadores' | 'vinculacion' | 'titulacion'`).
- Modificar el renderizado para cargar los componentes/datos específicos del módulo activo.

#### [MODIFY] `src/components/Header.tsx`
- Añadir un selector visual (ej. botones o un dropdown elegante) para alternar entre los 4 módulos principales.

#### [MODIFY] `src/components/Sidebar.tsx`
- Hacer que la lista de elementos en la barra lateral (`navItems`) dependa del módulo actualmente seleccionado en el Header.

#### [MODIFY] `src/types.ts`
- Añadir definiciones de tipos para los nuevos módulos (ej. `ModuleType`, `TitituloData`, `VinculacionData`, etc.).

---

### 3. Integración de Módulos Restantes
Se moverán los componentes (páginas), hooks (lógica de obtención y procesamiento de datos) y servicios de las otras 3 aplicaciones.

#### [NEW] `src/hooks/useTititulaciónData.ts`
- Migrar lógica de carga de `fetch_sheet.js` y `sheet_data.json` del proyecto de Titulación.

#### [NEW] `src/hooks/useVinculacionData.ts`
- Migrar lógica de datos del proyecto de Proyectos de Vinculación.

#### [NEW] `src/hooks/useIndicadoresData.ts`
- Migrar lógica estática/JSON o llamadas del proyecto de Indicadores Académicos.

#### [NEW] Páginas y Componentes de cada Módulo
- Se migrarán las diferentes "vistas" o "páginas" mapeándolas al nuevo `PageRenderer.tsx` extendido.

## Verification Plan

### Verificación Automatizada
- Se iniciará el servidor de desarrollo Vite localmente (`npm run dev`).
- Se verificará que no existan errores de compilación de TypeScript tras la integración masiva de tipos.

### Verificación Manual
1. **Navegación General**: Probar el cambio entre módulos en el Header. Confirmar que el Sidebar se actualiza correctamente.
2. **Estética**: Asegurar que las nuevas páginas integradas respetan al 100% los componentes Genéricos (Tarjetas, Gráficos de Recharts, Modales de IA) del diseño original de Evaluación Docente.
3. **Flujo de Datos**: Validar que los datos de Titulación y Vinculación se desplieguen correctamente en sus respectivas gráficas sin interferir con Evaluación Docente.
4. **Resposividad**: Verificar en distintos tamaños de ventana que la UI consolidada funcione correctamente tanto en versión móvil como escritorio.

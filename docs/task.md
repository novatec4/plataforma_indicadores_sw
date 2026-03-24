# Task Breakdown: Consolidating Information Modules

## Objective
Consolidate four separate applications (Proyectos de Vinculación, Evaluación Docente, Indicadores Académicos, Titulación) into a single system for the Software Career, maintaining the style and user experience of the "Evaluación Docente" module across the whole platform.

## Tasks
- [x] Analyze existing applications
  - [x] Review `evaluacion_docente_sw-main` to understand its tech stack, architecture, and styling constraints.
  - [x] Discover the entry points and structure for `indicadores academicos-sw`.
  - [x] Discover the entry points and structure for `proyectos_vinculacion-main`.
  - [x] Discover the entry points and structure for `titulación`.
- [x] Design consolidation architecture
  - [x] Create an `implementation_plan.md` outlining how to integrate these four modules into a single web application or container platform.
  - [x] Propose a unified navigation and layout that respects the "evaluación docente" design language.
  - [x] Submit plan to user for review.
- [x] Refactor and merge modules
  - [x] Set up the base shell application utilizing the "evaluación docente" styling.
  - [x] Port `titulación` logic to the unified system.
  - [x] Port `indicadores_academicos` logic to the unified system.
  - [x] Port `proyectos_vinculacion` logic to the unified system.
- [x] System Verification and Testing
  - [x] Verify functionality of all 4 modules.
  - [x] Check cross-module navigation.
  - [x] Write `walkthrough.md`.
- [x] Modular Architecture Refactor
  - [x] Create `src/core/` and `src/modules/` directories.
  - [x] Move global shell files to `src/core/`.
  - [x] Move `Evaluacion Docente` files to `src/modules/evaluacion_docente/`.
  - [x] Move `Titulacion` files to `src/modules/titulacion/`.
  - [x] Move `Vinculacion` files to `src/modules/vinculacion/`.
  - [x] Move `Indicadores` files to `src/modules/indicadores/`.
  - [x] Bulk update import statements across the entire project.
  - [x] Configure `vite.config.ts`, `tsconfig.json` and `index.html`.

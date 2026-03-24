# AI Development Rules

This document outlines the rules and conventions for the AI to follow when developing this application. The goal is to maintain code quality, consistency, and predictability.

## Tech Stack

The application is built with the following technologies:

-   **Framework**: React with TypeScript for building the user interface and application logic.
-   **Build Tool**: Vite for a fast and modern development experience.
-   **Styling**: Tailwind CSS for all styling, using a utility-first approach.
-   **UI Components**: shadcn/ui is the primary library for pre-built, accessible, and customizable UI components.
-   **Data Visualization**: Recharts is used for creating all charts and graphs.
-   **Icons**: Lucide React provides the icon set for the application.
-   **AI Integration**: The Google Gemini API, via the `@google/genai` package, powers all generative AI features.
-   **Data Source**: Data is fetched from public Google Sheets using the Google Visualization API.

## Library Usage Rules

To ensure consistency, please adhere to the following rules when choosing libraries for specific tasks.

### 1. UI Components

-   **Rule**: **ALWAYS** use `shadcn/ui` components for common UI elements like Buttons, Modals, Dialogs, Selects, Inputs, etc.
-   **Reasoning**: This maintains a consistent and professional design, ensures accessibility, and reduces the need to build and style common components from scratch. Do not create custom components if a suitable `shadcn/ui` component exists.

### 2. Styling

-   **Rule**: Use **Tailwind CSS utility classes** for all styling.
-   **Reasoning**: This keeps styling co-located with the component markup, enforces the design system, and avoids the complexity of managing separate CSS files. Avoid inline `style` attributes unless absolutely necessary for dynamic values that cannot be handled by Tailwind.

### 3. Icons

-   **Rule**: Use icons exclusively from the **`lucide-react`** library.
-   **Reasoning**: This provides a single source for high-quality, consistent icons. Do not use inline SVGs or icons from other libraries.

### 4. Charts & Data Visualization

-   **Rule**: Use **`Recharts`** for all charts and graphs.
-   **Reasoning**: It is the established and integrated charting library for this project, offering a wide range of responsive and customizable chart types.

### 5. State Management

-   **Rule**: Use React's built-in hooks (`useState`, `useCallback`, `useMemo`, `useEffect`) for all state management.
-   **Reasoning**: The application's complexity does not require a dedicated state management library like Redux or Zustand. Keeping state local and using React's native hooks is simpler and more efficient.

### 6. Data Fetching

-   **Rule**: Use the native **`fetch` API** for all HTTP requests.
-   **Reasoning**: It is a browser standard, requires no external dependencies, and is sufficient for the application's current data fetching needs.

### 7. AI Functionality

-   **Rule**: All interactions with the Gemini AI model must be handled through the **`@google/genai`** package.
-   **Reasoning**: This is the official and already integrated library for interacting with the AI service.
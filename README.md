# Kanban Board

A simple and interactive Kanban board built with React, TypeScript, and Vite. This project allows users to create columns, manage tasks within columns, and move tasks around using drag-and-drop functionality.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sudevo7/kanban-board.git
2. **Navigate into the project directory:**
   ```bash
   cd kanban-board
3. **Install the dependencies:**
   ```bash
   npm install
3. **Start the development server:**
   ```bash
   npm run dev
Open the project in your browser: Open the provided link to view the project, for me it was http://localhost:5173.

## Technology Choices and Rationale:
-React: For building the user interface due to its flexibility and component-based architecture.
-TypeScript: Provides type safety, which helps reduce bugs and improves developer experience.
-Vite: A fast and modern build tool for development and bundling, providing a great development experience with fast hot module replacement (HMR).
-@dnd-kit: A drag-and-drop library for React that enables seamless and accessible drag-and-drop functionality.
-Local Storage: To persist columns and tasks data even after a page reload.

## Known Limitations / Trade-offs:
-Drag-and-Drop Performance: While drag-and-drop is a core feature, complex boards with many tasks may face performance issues.
-No Backend: This project uses only local storage for persistence. A real-world app would benefit from a backend to store data persistently across devices.
-Limited Accessibility: Although the app supports basic keyboard accessibility for drag-and-drop, some improvements can be made for full accessibility compliance.

## Future Improvements:
-Backend Integration: Implement a backend (e.g., Node.js + Express or Firebase) to store and manage columns and tasks.
-User Authentication: Add user authentication to allow multiple users to use the board simultaneously and save their data.
-Advanced Task Filtering: Introduce advanced task filtering options (e.g., by deadline, priority, etc.).
-Task Comments/Attachments: Allow users to add comments or attachments to tasks for better collaboration.

## Time Spent

- **Project Setup**: 1 hours
  - Initial setup with Vite and React.
  - Configuring TypeScript support.

- **UI Design and Layout**: 3.5 hours
  - Designing the Kanban board layout.
  - Styling the columns and task cards.

- **Implementing Functionality**: 5 hours
  - Adding drag-and-drop functionality with `@dnd-kit`.
  - Setting up task and column management features (add, delete, update).
  - Implementing local storage to persist data.

- **Bug Fixing and Testing**: 2 hours
  - Debugging issues with task movements and local storage.
  - Testing responsiveness and overall functionality.

- **Documentation**: 0.5 hour
  - Writing the README file with setup instructions and project details.

### Total Time Spent: 12 hours

## Live Demo

Check out the live demo of the Kanban Board: [Live Demo Link] (https://sudevo7.github.io/kanban-board/) 

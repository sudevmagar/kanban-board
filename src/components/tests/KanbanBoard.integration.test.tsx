import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import KanbanBoard from "../KanbanBoard";

// Mock the implementation for `createPortal` since it's used to render overlays
jest.mock('react-dom', () => ({
  createPortal: (children: any) => children,
}));

describe("KanbanBoard Integration Test", () => {

  test("should add a new column and render it", async () => {
    render(<KanbanBoard />);
    
    // Check that the initial state doesn't have any columns
    expect(screen.queryByText(/Column 1/i)).not.toBeInTheDocument();

    // Click the "Add Column" button
    const addColumnButton = screen.getByText(/Add Column/i);
    userEvent.click(addColumnButton);

    // Wait for the new column to appear
    await waitFor(() => screen.getByText(/Column 1/i));

    // Verify that a new column was added
    expect(screen.getByText(/Column 1/i)).toBeInTheDocument();
  });

  test("should create a new task in a column", async () => {
    render(<KanbanBoard />);
    
    // Add a new column
    const addColumnButton = screen.getByText(/Add Column/i);
    userEvent.click(addColumnButton);

    // Get the Add Task button from the new column
    const addTaskButton = screen.getByText(/Add Task/i);

    // Create a task by clicking the button
    userEvent.click(addTaskButton);

    // Check if the task is created inside the column
    const taskContent = await screen.findByText(/Task 1/i);
    expect(taskContent).toBeInTheDocument();
  });

  test("should delete a task", async () => {
    render(<KanbanBoard />);
    
    // Add a new column
    const addColumnButton = screen.getByText(/Add Column/i);
    userEvent.click(addColumnButton);

    // Add a new task
    const addTaskButton = screen.getByText(/Add Task/i);
    userEvent.click(addTaskButton);

    // Find the delete button for the task and click it
    const deleteTaskButton = screen.getByRole('button', { name: /trash/i });
    userEvent.click(deleteTaskButton);

    // Verify the task has been deleted
    await waitFor(() => {
      expect(screen.queryByText(/Task 1/i)).not.toBeInTheDocument();
    });
  });

  test("should delete a column and its tasks", async () => {
    render(<KanbanBoard />);
    
    // Add a new column
    const addColumnButton = screen.getByText(/Add Column/i);
    userEvent.click(addColumnButton);

    // Add a task to the new column
    const addTaskButton = screen.getByText(/Add Task/i);
    userEvent.click(addTaskButton);

    // Find the delete column button
    const deleteColumnButton = screen.getByRole('button', { name: /trash/i });
    userEvent.click(deleteColumnButton);

    // Verify that the column and its tasks are deleted
    await waitFor(() => {
      expect(screen.queryByText(/Column 1/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Task 1/i)).not.toBeInTheDocument();
    });
  });

  test("should drag a task from one column to another", async () => {
    render(<KanbanBoard />);
    
    // Add two columns
    const addColumnButton = screen.getByText(/Add Column/i);
    userEvent.click(addColumnButton);
    userEvent.click(addColumnButton);

    // Add a task to the first column
    const addTaskButton1 = screen.getByText(/Add Task/i);
    userEvent.click(addTaskButton1);

    // Drag the task from the first column to the second column
    const task = await screen.findByText(/Task 1/i);
    const firstColumn = screen.getByText(/Column 1/i);
    const secondColumn = screen.getByText(/Column 2/i);

    // Simulate dragging (this might need you to implement a custom drag simulation)
    fireEvent.dragStart(task);
    fireEvent.dragEnter(secondColumn);
    fireEvent.dragEnd(task);

    // Check if the task has moved to the second column
    await waitFor(() => expect(secondColumn).toContainElement(task));
    expect(firstColumn).not.toContainElement(task);
  });

});

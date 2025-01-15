import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import KanbanBoard from '../KanbanBoard';  // Adjust the path accordingly
import '@testing-library/jest-dom';

// Mocking localStorage to avoid actual browser storage interactions during tests
beforeEach(() => {
  // Mocking the localStorage methods to simulate existing data in local storage
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
    if (key === 'kanban_columns') {
      return JSON.stringify([
        { id: 1, title: 'TODO' },
        { id: 2, title: 'Work in Progress' },
        { id: 3, title: 'Tasks Done' },
      ]);
    }
    if (key === 'kanban_tasks') {
      return JSON.stringify([
        { id: 1, columnId: 1, content: 'Define project scope' },
        { id: 2, columnId: 1, content: 'Gather requirements' },
        { id: 3, columnId: 2, content: 'Develop wireframes' },
        { id: 4, columnId: 2, content: 'Set up backend API' },
        { id: 5, columnId: 3, content: 'Complete initial design' },
        { id: 6, columnId: 3, content: 'Submit MVP for review' },
      ]);
    }
    return null;
  });
});

describe('KanbanBoard Component', () => {
  it('renders predefined columns', () => {
    render(<KanbanBoard />);

    // Check if the columns are rendered from localStorage
    expect(screen.getByText('TODO')).toBeInTheDocument();
    expect(screen.getByText('Work in Progress')).toBeInTheDocument();
    expect(screen.getByText('Tasks Done')).toBeInTheDocument();
  });

  it('renders predefined tasks', () => {
    render(<KanbanBoard />);

    // Check if tasks for each column are rendered from localStorage
    expect(screen.getByText('Define project scope')).toBeInTheDocument();
    expect(screen.getByText('Gather requirements')).toBeInTheDocument();
    expect(screen.getByText('Develop wireframes')).toBeInTheDocument();
    expect(screen.getByText('Set up backend API')).toBeInTheDocument();
    expect(screen.getByText('Complete initial design')).toBeInTheDocument();
    expect(screen.getByText('Submit MVP for review')).toBeInTheDocument();
  });

  it('can add a new column', async () => {
    render(<KanbanBoard />);

    const addColumnButton = screen.getByText(/Add Column/i);

    fireEvent.click(addColumnButton);

    await waitFor(() => expect(screen.getByText(/Column 4/i)).toBeInTheDocument());
  });

  it('renders columns from localStorage', () => {
    render(<KanbanBoard />);

    // Check if the columns are loaded from localStorage and rendered
    expect(screen.getByText('TODO')).toBeInTheDocument();
    expect(screen.getByText('Work in Progress')).toBeInTheDocument();
    expect(screen.getByText('Tasks Done')).toBeInTheDocument();
  });

  it('renders tasks from localStorage', () => {
    render(<KanbanBoard />);

    // Check if tasks for each column are loaded from localStorage and rendered
    expect(screen.getByText('Define project scope')).toBeInTheDocument();
    expect(screen.getByText('Gather requirements')).toBeInTheDocument();
    expect(screen.getByText('Develop wireframes')).toBeInTheDocument();
    expect(screen.getByText('Set up backend API')).toBeInTheDocument();
    expect(screen.getByText('Complete initial design')).toBeInTheDocument();
    expect(screen.getByText('Submit MVP for review')).toBeInTheDocument();
  });
});

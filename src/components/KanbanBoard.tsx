import { useMemo, useState, useEffect } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
  // Helper function to generate a random ID
  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  const predefinedColumns: Column[] = [
    { id: generateId(), title: "TODO" },
    { id: generateId(), title: "Work in Progress" },
    { id: generateId(), title: "Tasks Done" },
  ];

  const predefinedTasks: Task[] = [
    { id: generateId(), columnId: predefinedColumns[0].id, content: "Define project scope" },
    { id: generateId(), columnId: predefinedColumns[0].id, content: "Gather requirements" },
    { id: generateId(), columnId: predefinedColumns[1].id, content: "Develop wireframes" },
    { id: generateId(), columnId: predefinedColumns[1].id, content: "Set up backend API" },
    { id: generateId(), columnId: predefinedColumns[2].id, content: "Complete initial design" },
    { id: generateId(), columnId: predefinedColumns[2].id, content: "Submit MVP for review" },
  ];

  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = localStorage.getItem("kanban_columns");
    return savedColumns ? JSON.parse(savedColumns) : predefinedColumns;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("kanban_tasks");
    return savedTasks ? JSON.parse(savedTasks) : predefinedTasks;
  });

  const [columnCounter, setColumnCounter] = useState(() => {
    const savedCounter = localStorage.getItem("kanban_column_counter");
    return savedCounter ? parseInt(savedCounter, 10) : predefinedColumns.length;
  });

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem("kanban_columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("kanban_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("kanban_column_counter", columnCounter.toString());
  }, [columnCounter]);

  return (
    <div
      className="
        bg-mainBackgroundColor
        text-textColor
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-10
      "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="
              h-[60px]
              w-[350px]
              min-w-[350px]
              cursor-pointer
              rounded-lg
              bg-buttonBackground
              border-2
              border-columnBackgroundColor
              p-4
              hover:bg-accentColor
              flex
              gap-2
              items-center
              justify-center
              text-textColor
            "
          >
            <PlusIcon /> Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  // Function to create a new column and update the state
  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columnCounter + 1}`,
    };

    setColumns([...columns, columnToAdd]);
    setColumnCounter((prev) => prev + 1);
  }

  // Function to create a task in the specified column
  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  // Function to delete a task
  function deleteTask(id: Id) {
    const newTask = tasks.filter((task) => task.id !== id);
    setTasks(newTask);
  }

  // Function to update task content
  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  // Function to delete a column and associated tasks
  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  // Function to update a column's title
  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  // Handler for when drag starts (sets the active column or task)
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  // Handler for when drag ends (moves column or task to new position)
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Reordering columns
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeId
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.id === overId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  // Handler for drag over (determines where the task or column should be moved)
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    // Handling task-to-task movement
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Handling task-to-column movement
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

export default KanbanBoard;
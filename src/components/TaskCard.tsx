import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard(props: Props) {
  const { task, deleteTask, updateTask } = props;

  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  // If the task is being dragged, return an empty task card with reduced opacity
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          bg-taskBackgroundColor 
          p-2.5 
          h-[100px]
          min-h-[100px] 
          flex 
          items-center 
          text-left 
          rounded-xl 
          border-2 
          border-accentColor 
          cursor-grab 
          relative 
          opacity-30
        "
      />
    );
  }

  // If in edit mode, render a textarea for editing task content
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="
          bg-taskBackgroundColor 
          p-2.5 
          h-[100px]
          min-h-[100px] 
          flex 
          items-center 
          text-left 
          rounded-xl 
          hover:ring-2 
          hover:ring-inset 
          hover:ring-accentColor 
          cursor-grab 
          relative
        "
      >
        <textarea
          className="
            h-[90%] 
            w-full 
            resize-none 
            border-none 
            rounded 
            bg-transparent 
            text-textColor 
            focus:outline-none
          "
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
          maxLength={250}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="
        bg-taskBackgroundColor 
        p-2.5 
        h-[100px] 
        min-h-[100px] 
        flex 
        items-center 
        text-left 
        rounded-xl 
        hover:ring-2 
        hover:ring-inset 
        hover:ring-accentColor 
        cursor-grab 
        relative
      "
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-textColor">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          aria-label="Delete Task"
          className="
            stroke-gray-500 
            hover:stroke-white 
            absolute 
            right-4 
            top-1/2 
            -translate-y-1/2 
            bg-buttonBackground 
            p-2 
            rounded 
            opacity-60 
            hover:opacity-100
          "
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;

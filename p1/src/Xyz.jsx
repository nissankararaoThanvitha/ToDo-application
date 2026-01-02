import { useEffect, useState } from "react";
import "./App.css";

const Xyz = () => {
  const [toDo, setToDo] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setToDo(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(toDo));
  }, [toDo]);

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleAddTodo = () => {
    const newTask = input.trim();
    if (!newTask) return;

    const exists = toDo.some(
      (todo) => todo.text.toLowerCase() === newTask.toLowerCase()
    );

    if (exists) {
      alert("This task already exists!");
      setInput("");
      return;
    }

    setToDo([
      ...toDo,
      { id: Date.now(), text: newTask, completed: false }
    ]);

    setInput("");
  };

  const handleToggleToDo = (id) => {
    setToDo(
      toDo.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (confirmDelete) {
      setToDo(toDo.filter((t) => t.id !== id));
    }
  };

  const filteredToDo = toDo
    .filter((todo) =>
      filter === "all"
        ? true
        : filter === "completed"
        ? todo.completed
        : !todo.completed
    )
    .filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    );

  const completedCount = toDo.filter((t) => t.completed).length;
  const totalCount = toDo.length;

  return (
    <div className="app">
      <div className="todo-container">
        <h1>React To-Do Application</h1>

        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={handleInput}
            placeholder="Add a new task"
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          />
          <button onClick={handleAddTodo} disabled={!input.trim()}>
            Add
          </button>
        </div>

        {toDo.length === 0 && (
          <center>
            <p>No tasks yet — add one 😊</p>
          </center>
        )}

        <p className="status">
          Completed: {completedCount} / {totalCount}
        </p>

        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <ul>
          {filteredToDo.map((todoItem, index) => (
            <li
              key={todoItem.id}
              className={todoItem.completed ? "completed" : ""}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                const updated = [...toDo];
                const draggedItem = updated[dragIndex];

                updated.splice(dragIndex, 1);
                updated.splice(index, 0, draggedItem);

                setDragIndex(null);
                setToDo(updated);
              }}
            >
              {editingId === todoItem.id ? (
                <input
                  value={editText}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setToDo((toDoList) =>
                        toDoList.map((t) =>
                          t.id === todoItem.id
                            ? { ...t, text: editText }
                            : t
                        )
                      );
                      setEditingId(null);
                    }
                  }}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => {
                    setToDo((toDoList) =>
                      toDoList.map((t) =>
                        t.id === todoItem.id
                          ? { ...t, text: editText }
                          : t
                      )
                    );
                    setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <span>{todoItem.text}</span>
              )}

              <div className="actions">
                <button
                  className="icon-btn"
                  onClick={() => handleToggleToDo(todoItem.id)}
                >
                  {todoItem.completed ? "⤺" : "✔"}
                </button>

                <button
                  className="icon-btn"
                  onClick={() => {
                    setEditingId(todoItem.id);
                    setEditText(todoItem.text);
                  }}
                >
                  ✎
                </button>

                <button
                  className="icon-btn"
                  onClick={() => handleDelete(todoItem.id)}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Xyz;

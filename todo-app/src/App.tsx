import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { TextField, Button, Checkbox, List, ListItem, ListItemText, IconButton, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers";

function App() {
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState(2);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined); // Store due date as a string or undefined
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("all");

  const tasks = useQuery(api.tasks.get) || [];
  const addTask = useMutation(api.tasks.add);
  const toggleTask = useMutation(api.tasks.toggle);
  const deleteTask = useMutation(api.tasks.remove);
  const editTask = useMutation(api.tasks.edit);
  const updatePriority = useMutation(api.tasks.updatePriority);

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask({ text: newTask, priority, dueDate });
      setNewTask("");
      setPriority(2);
      setDueDate(undefined); // Reset to undefined
    }
  };

  return (
    <div className="App" style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Todo List</h1>
      <TextField
        label="New Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
        fullWidth
        margin="normal"
      />
      <Select value={priority} onChange={(e) => setPriority(e.target.value as number)} fullWidth>
        <MenuItem value={1}>High</MenuItem>
        <MenuItem value={2}>Medium</MenuItem>
        <MenuItem value={3}>Low</MenuItem>
      </Select>
      <DatePicker
        label="Due Date"
        value={dueDate ? dayjs(dueDate) : null} // Convert string to dayjs object
        onChange={(newDate) => setDueDate(newDate ? newDate.toISOString() : undefined)} // Store as ISO string or undefined
        slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
      />
      <Button onClick={handleAddTask} variant="contained" color="primary" fullWidth style={{ marginBottom: "20px" }}>
        Add Task
      </Button>
      <TextField
        label="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Select value={filter} onChange={(e) => setFilter(e.target.value)} fullWidth>
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
        <MenuItem value="incomplete">Incomplete</MenuItem>
      </Select>
      <List>
        {tasks
          .filter((task) => task.text.toLowerCase().includes(searchText.toLowerCase()))
          .filter((task) => {
            if (filter === "all") return true;
            return filter === "completed" ? task.isCompleted : !task.isCompleted;
          })
          .map((task) => (
            <ListItem key={task._id} dense style={{ border: "1px solid #ccc", marginBottom: "8px", borderRadius: "8px" }}>
              <Checkbox
                checked={task.isCompleted}
                onChange={() => toggleTask({ id: task._id, isCompleted: !task.isCompleted })}
              />
              <ListItemText
                primary={task.text}
                secondary={task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
                style={{
                  textDecoration: task.isCompleted ? "line-through" : "none",
                  color: task.priority === 1 ? "red" : task.priority === 2 ? "orange" : "green",
                }}
              />
              <Select
                value={task.priority}
                onChange={(e) => updatePriority({ id: task._id, priority: e.target.value as number })}
                style={{ marginRight: "16px" }}
              >
                <MenuItem value={1}>High</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>Low</MenuItem>
              </Select>
              <IconButton onClick={() => deleteTask({ id: task._id })} edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
      </List>
    </div>
  );
}

export default App;

import logo from "./logo.svg";
// import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

const URL = "https://api-nodejs-todolist.herokuapp.com";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDQ2MGZhNGIxZDg3NTAwMTczOGQwOTkiLCJpYXQiOjE2MTU0NjAzODB9.DQuOWsCVJoiCx6OIM3SCIZ8XdRQKLDlifWaFkCE1vlU";
const axiosConfig = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState({ isEdit: false, taskId: "" });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTask();
  }, []);

  async function fetchTask() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${URL}/task`, axiosConfig);
      setTasks(data.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditTask(e, taskId) {
    if (e.code === "Enter") {
      setLoading(true);
      try {
        await axios.put(
          `${URL}/task/${taskId}`,
          { description: input },
          axiosConfig
        );
        await fetchTask();
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
        setEditMode({ isEdit: false, taskId: "" });
      }
    }
  }

  return (
    <div className="App">
      <ul>
        {loading ? (
          <div>Loading...</div>
        ) : (
          tasks.map((task) => {
            return (
              <li
                key={task._id}
                onDoubleClick={() => {
                  setEditMode({ isEdit: true, taskId: task._id });
                  setInput(task.description);
                }}
                onKeyUp={(e) => handleEditTask(e, task._id)}
              >
                {editMode.taskId === task._id && editMode.isEdit ? (
                  <input
                    /*defaultValue={task.description}*/ value={input}
                    onChange={(e) => {
                      console.log("input", input);
                      setInput(e.target.value);
                    }}
                  />
                ) : (
                  <span>{task.description}</span>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default App;

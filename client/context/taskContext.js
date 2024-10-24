import React, { createContext } from 'react';
import { useUserContext } from './userContext';

const TasksContext = createContext();

const serverUrl = "http://localhost:8000/api/v1";

export const TasksProvider = ({ children }) => {
    const userId = useUserContext().user._id;

    const [tasks, setTasks] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [task, setTask] = React.useState({});

    const [priority, setPriority] = React.useState("all");

    // get tasks
    const getTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/tasks`);

            setTasks(response.data);
        }   catch (error) {
            console.log("Error getting tasks", error);
        }
        setLoading(false);
    };

    // get task
    const getTask = async (taskId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverurl}/task/${taskId}`);

            setTask(response.data);
        }   catch (error) {
            console.log("Error getting tasks", error);
        }
        setLoading(false);
        
    };

    const createTask = async (task) => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverurl}/task/create`, task);

            setTasks([...tasks, res.data]);
        }   catch (error) {
            console.log("Error getting tasks", error);
        }
        setLoading(false);
    };

    const updateTask = async (task) => {
        setLoading(true);
        try {
            const res = await axios.patch(`${serverurl}/task/${task._id}`, task);

            // update the task in the tasks array
            const newTasks = tasks.map((tsk) => {
                return tsk._id === res.data._id ? res.data : tsk;
            });

            setTasks(newTasks);
        }   catch (error) {
            console.log("Error getting tasks", error);
        }
    }

        const deleteTask = async (taskId) => {
            setLoading(true);
            try {
                await axios.delete(`${serverUrl}/task/${taskId}`);

                // remove the task from the tasks array
                const newTasks = tasks.filter((tsk) => tsk._id !== taskId);

                setTasks(newTasks);
            }   catch (error) {
                console.log("Error deleting task", error);
            }
        };

    useEffect(() => {
        getTasks();
    }, [userId]);


    return (
        <TasksContext.Provider
            value={{
                tasks,
                loading,
                task,
                getTasks,
                createTask,
                updateTask,
                deleteTask,
                priority,
                setPriority,
            }}
        >
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => {
    return React.useContext(TasksContext);
}
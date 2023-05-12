import { useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import moment from "moment/moment";

const url = "http://localhost:3000/api/task";

export default function Home(props) {
	const [tasks, setTasks] = useState(props.tasks);
	const [todo, setTodo] = useState({ todo: "", description: "", createDate: "" });

	const handleChange = ({ currentTarget: input }) => {
		input.value === ""
			? setTodo({ todo: "" })
			: setTodo((prev) => ({ ...prev, 
				todo: input.value, 
				description: input.value, 
				createDate: moment(new Date()).format("YYYY-MM-DD hh:mm:ss a"),// new Date(),
			 }),);
	};

	const addTask = async (e) => {
		e.preventDefault();
		try {
			if (todo._id) {
				const { data } = await axios.put(url + "/" + todo._id, {
					todo: todo.todo,
				});
				const originalTasks = [...tasks];
				const index = originalTasks.findIndex((t) => t._id === todo._id);
				originalTasks[index] = data.data;
				setTasks(originalTasks);
				setTodo({ todo: "" });
				console.log(data.message);
			} else {
				const { data } = await axios.post(url, todo);
				console.log(data)
				console.log(todo)
				setTasks((prev) => [...prev, data.data]);
				setTodo({ todo: "", description: "" });
				console.log(data.message);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const editTask = (id) => {
		const currentTask = tasks.filter((task) => task._id === id);
		setTodo(currentTask[0]);
	};

	const updateTask = async (id) => {
		try {
			const originalTasks = [...tasks];
			const index = originalTasks.findIndex((t) => t._id === id);
			const { data } = await axios.put(url + "/" + id, {
				isCompleted: !originalTasks[index].isCompleted,
			});
			originalTasks[index] = data.data;
			setTasks(originalTasks);
			console.log(data.message);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteTask = async (id) => {
		try {
			const { data } = await axios.delete(url + "/" + id);
			setTasks((prev) => prev.filter((task) => task._id !== id));
			console.log(data.message);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main className={styles.main}>
			<h1 className={styles.heading}>TO-DO</h1>
			<div className={styles.container}>
				<form onSubmit={addTask} className={styles.form_container}>
					<input
						className={styles.input}
						type="text"
						placeholder="Task to be done..."
						onChange={handleChange}
						value={todo.todo}
					/>
					<button type="submit" className={styles.submit_btn}>
						{todo._id ? "Update" : "Add"}
					</button>
				</form>
				{tasks.map((task) => (
					<div className={styles.task_container} key={task._id}>
						<input
							type="checkbox"
							className={styles.check_box}
							checked={task.isCompleted}
							onChange={() => updateTask(task._id)}
						/>
						<p
							className={
								task.isCompleted
									? styles.task_text + " " + styles.line_through
									: styles.task_text
							}
						>
							{task.todo}
						</p>
						<button
							onClick={() => editTask(task._id)}
							className={styles.edit_task}
						>
							&#9998;
						</button>
						<button
							onClick={() => deleteTask(task._id)}
							className={styles.remove_task}
						>
							&#10006;
						</button>
					</div>
				))}
				{tasks.length === 0 && <h2 className={styles.no_tasks}>No tasks</h2>}
			</div>
		</main>
	);
}

export const getServerSideProps = async () => {
	const { data } = await axios.get(url);
	return {
		props: {
			tasks: data.data,
		},
	};
};

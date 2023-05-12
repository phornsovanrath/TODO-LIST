import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
	todo: { type: String, default: ""},
	description: {type: String , required: true},
	isCompleted: { type: Boolean, default: false },
	createDate: {type: String, default: ""},
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task

import mongoose, { mongo } from "mongoose";

const projectSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,

    },
    summary: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }

}, { timestamps: true })

const Project = mongoose.model("Project", projectSchema)

export default Project
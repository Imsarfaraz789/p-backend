import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB)
        console.log("connection success")
    } catch (error) {
        console.log(error)

    }
}


export default connectDB
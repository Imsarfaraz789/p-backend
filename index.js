import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db/db.connection.js"
import cors from "cors"

dotenv.config()

app.use(cors())
connectDB()

app.listen(process.env.PORT, () => {
    console.log(`server is running at port: ${process.env.PORT}`)
})
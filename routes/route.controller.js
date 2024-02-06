import express from "express";
import User from "../model/user.model.js"
import multer from "multer"
import uploadOnCloudanry from "../utils/cloudnary.js";
import Project from "../model/project.model.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import nodemailer from "nodemailer"

const router = express.Router()
dotenv.config()


// register api
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: " Email and password is required" })
        }

        const userExist = await User.findOne(
            {
                $or: [
                    { email },
                    { password }
                ],
            }
        )

        if (userExist) {
            return res.status(400).json({ message: "User already exist" })
        }

        const newUser = await User.create({
            email,
            password
        })


        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ message: "User registered successfully", token });

    } catch (error) {
        console.log(error)
    }
})


// login api
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (user && user.password === password) {
            return res.json({ message: 'Login successful', user });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


// create new post api
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

router.post("/newpost", upload.single('image'), async (req, res) => {
    try {
        const { title, summary, value } = req.body
        console.log('Request Body:', req.body);

        const imageFile = req.file;
        const imagaeUpload = await uploadOnCloudanry(imageFile)
        if (!imagaeUpload) {
            console.log("failed to upload image on cloudany", imagaeUpload)
        }

        const projectRes = await Project.create({
            image: imagaeUpload.url,
            title,
            summary,
            description: value
        })

        return res.status(200).json({ message: 'Post created successfully', projectRes });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


// get projects details
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// single post
router.get('/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const singlePost = await Project.findById(projectId);

        if (!singlePost) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(singlePost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// send gmail
router.post("/sendgmail", async (req, res) => {
    try {
        const { email, subject, message } = req.body

        if (!email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'Incomplete data. Please provide all required fields.' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sarfaraztech786@gmail.com',
                pass: 'vdnk pecx fnvq drvb',
            },
        });
        const mailOptions = {
            from: email,
            to: 'sarfaraz6562@gmail.com',
            subject: subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error sending email.' });
    }
})

export default router
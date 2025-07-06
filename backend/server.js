const express = require("express");
const app = express();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')
const { notFound, errorHandler } = require("./middlewares/errorHandler");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

//DB connection
database.connect();

// middlewares 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(cookieParser());
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        credentials:true,
    })
);

app.use("/api/auth" , authRoutes);
app.use("/api/project" , projectRoutes);
app.use("/api/task" , taskRoutes);
app.use("/api/user" , userRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/" , (req, res) => {
 res.send(`Server is running at PORT ${PORT}`);
})

app.listen(PORT , () => {
    console.log(`Server running at PORT ${PORT}`);
})


const express = require('express');
const app = express();
const connectDB = require('./database/database')
const cookieparser = require('cookie-parser');
const authRouter = require('./Routes/auth');
const cors = require("cors");
const profileRouter = require('./Routes/profile')
const bookRoutes = require('./Routes/bookRoutes')
const dotenv = require('dotenv')

app.use(cookieparser())

dotenv.config();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
  process.env.FRONTEND_URL,


];

app.use(cors({
  origin:true,
  credentials: true,
}));


app.use(express.json())
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/api/books", bookRoutes);


const PORT = process.env.PORT || 2222;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});

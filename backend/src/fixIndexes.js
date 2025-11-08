import mongoose from "mongoose";
import User from "./models/user.js"; 
const MONGO_URI = process.env.MONGO_URI
    ;

const fixIndexes = async () => {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log("Connected to MongoDB");

        await User.collection.dropIndex("emailId_1").catch(err => {
            if (err.codeName === "IndexNotFound") {
                console.log("Index emailId_1 not found, skipping.");
            } else {
                throw err;
            }
        });

        console.log("Dropped old index successfully");

        await User.syncIndexes();

        console.log("Rebuilt indexes successfully");
    } catch (err) {
        console.error("Error fixing indexes:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

fixIndexes();

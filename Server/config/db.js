import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.MONGO_URI, {
        //     dbName: "CodeBuddy",
        // });
        await mongoose.connect(
            `mongodb+srv://malkarroshan7:${process.env.ATLAS_DB_PASSWORD}@cluster0.aqopn.mongodb.net/?appName=Cluster0`
        );
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB failed", err.message);
        process.exit(1);
    }
};

export default connectDB;

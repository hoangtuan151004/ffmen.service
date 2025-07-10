import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoConnect = async (): Promise<void> => {
  try {
    const mongoUri = process.env.Database_URL || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Database_URL or MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connect to database successfully!");
  } catch (error: any) {
    console.error("❌ Connect to database failed:", error.message);
  }
};

export default mongoConnect;

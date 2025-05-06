import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const connection = mongoose.connection;

        // Event listener for successful connection
        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        // Event listener for connection errors
        connection.on("error", (error) => {
            console.error("MongoDB failed to connect", error);
        });

    } catch (error) {
        // Catch any error that happens during connection
        console.error("Database server problem:", error);
       
    }
};

export { dbConnect };

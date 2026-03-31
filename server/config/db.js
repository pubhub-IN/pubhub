import mongoose from "mongoose";

const DEFAULT_OPTIONS = {
	serverSelectionTimeoutMS: 15000,
	maxPoolSize: 10,
};

export async function connectDatabase() {
	const mongoUri = process.env.MONGO_URI;

	if (!mongoUri) {
		throw new Error("MONGO_URI is missing in environment variables");
	}

	mongoose.connection.on("connected", () => {
		console.log("MongoDB connected");
	});

	mongoose.connection.on("error", (error) => {
		console.error("MongoDB connection error:", error.message);
	});

	mongoose.connection.on("disconnected", () => {
		console.warn("MongoDB disconnected");
	});

	await mongoose.connect(mongoUri, DEFAULT_OPTIONS);
}

export async function disconnectDatabase() {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}
}

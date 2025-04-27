import mongoose from "mongoose";

export async function connectDb() {
    try {
        await mongoose.connect("mongodb+srv://vishesh:vishesh123@cluster0.o1khkyo.mongodb.net/secondBrain");
        console.log("listening on port 3000")
    } catch (error) {
        console.log("there is some error", error)
    }
}
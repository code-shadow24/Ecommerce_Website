import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { Counter } from "../models/counterCollection.model.js";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MONGODB connected !!! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Failed to connect to MongoDB: " , error)
        process.exit(1);
    }
}

const initializeCounter = async () => {


    const counter = new Counter({
        id: 'ticketId',
        seq: 0
    })

    await counter.save();
    console.log("Counter Initialised")

}

initializeCounter();

export default connectDB


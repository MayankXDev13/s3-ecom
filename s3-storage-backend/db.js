import mongoose from "mongoose";

export async function connectToDB () {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        // console.log(connect);
        
    } catch (err) {
        console.error(err);
        
        
    }
}

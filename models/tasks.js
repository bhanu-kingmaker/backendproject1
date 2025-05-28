import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tasksSchema=new Schema({
    task: {
        type: String,
        required:true
    },
    status: {
        type:String
    } ,
    deadline: {
        type:String
    }

})

export default mongoose.model("tasks", tasksSchema);
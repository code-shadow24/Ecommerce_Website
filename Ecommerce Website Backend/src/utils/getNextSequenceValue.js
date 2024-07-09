import { Counter } from "../models/counterCollection.model.js";
import { asyncHandler } from "./asyncHandle.js";

const getNextSequenceValue = asyncHandler( async(sequenceName)=>{
    const sequenceDocument = await Counter.findOneAndUpdate(
        {id: sequenceName},
        {$inc: {seq: 1}},
        {new: true, upsert: true}
    )

    return sequenceDocument.seq
})

export {
    getNextSequenceValue
}
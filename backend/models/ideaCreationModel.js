import mongoose from "mongoose";

const ideaCreationSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    media : {
        imageUrl : {
            type : String
        },
        videoUrl : {
            type : String
        }           
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    updatedAt : {
        type : Date,
        default : Date.now()
    },
    reaction : {
        like : {
            type : Number,
            default : 0
        },
        dislike : {
            type : Number,
            default : 0
        }
    },
    comments : [{
        userId: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        comment : {
            type : String,
            required : true
        },
        createdAt : {
            type : Date,
            default : Date.now()
        },
    }
    ],
});

export default mongoose.model("IdeaCreation", ideaCreationSchema);
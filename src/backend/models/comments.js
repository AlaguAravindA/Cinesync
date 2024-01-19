const moongose = require('mongoose');
const Schema = moongose.Schema;

const commentschema = new Schema({
    imdb_id: {
        type: String,
        required: true
    },

    comments: {
        type: String ,// Allow any type within the array
        required: true
    },
    userName:{
        type:String,
        required :true
    },
    createdAt:{
        type:String,
        default: ()=> new Date().toLocaleString()
      },
      likes: {
        type: Number, // Define likes as a numerical value
        default: 0,   // Set default value to 0
    },
    replies: [
        {
            username: {
                type: String,
                required: true
            },
            commentId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            replyText: {
                type: String,
                required: true
            },
            createdAt: {
                type:String,
                default:()=> new Date().toLocaleString()
            }
        },
        
    ]
}, {
    
});

const Comment = moongose.model('Comment', commentschema);
module.exports = Comment;

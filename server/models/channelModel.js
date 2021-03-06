import mongoose from 'mongoose'

const channelShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    description: {
        type: String,
        maxlength: 100
    },
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            text: String,
            timestamp: String,
            media: [String],
            isRead: {
                type: Boolean,
                default: false
            }
        },
    ],
});

const Channel = mongoose.model('Channel', channelShema)

export default Channel
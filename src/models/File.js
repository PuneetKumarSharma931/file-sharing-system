const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({

    path: {
        type: String,
        required: true
    },

    originalName: {
        type: String,
        required: true
    },

    password: String,

    downloadCount: {
        type: Number,
        required: true,
        default: 0
    }
});

const File = new mongoose.model("File", FileSchema);

module.exports = File;
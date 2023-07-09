const express = require('express');
const multer = require('multer');
require('./src/db/connection');
require('dotenv').config();
const File = require('./src/models/File');
const bcrypt = require('bcrypt');

const port = process.env.PORT || 3000;

const app = express();
const upload = multer({ dest: "uploads"});
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get('/', (req, res)=>{

    res.render('index');
});

app.post('/upload', upload.single("file"), async (req, res)=>{

    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname
    }

    if(req.body.password && req.body.password!="") {

        fileData.password = await bcrypt.hash(req.body.password, 12);
    }

    const file = await File.create(fileData);

    res.render("index", { fileLink: `${req.headers.origin}/file/${file._id}`});
});

app.get('/file/:id', async (req, res)=>{

    const file = await File.findById(req.params.id);

    if(file.password) {

        res.render("password");
        return;
    }

    file.downloadCount++;
    file.save();
    res.download(file.path, file.originalName);
});

app.post('/file/:id', async (req, res)=>{

    const file = await File.findById(req.params.id);
    const isMatch = await bcrypt.compare(req.body.password, file.password);
    if(!isMatch) {

        res.render("password", {error: true});
        return;
    }

    file.downloadCount++;
    file.save();
    res.download(file.path, file.originalName);
});


app.listen(port, ()=>{

    console.log(`The Server is running at port: ${port}`);
});
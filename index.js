const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const src = path.join(__dirname, "views");
app.use(express.static(src));

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, //Max file size 5MB
  },
});

let projectId = "sistem-terdistribusi-405404"; // Dapatkan melalui Google Cloud -> Project Settings -> Project ID
let keyFilename = "key.json"; // Dapatkan melalui Google Cloud -> API & Services -> Credentials -> Service Account -> Manage Service Account -> Create Key -> JSON (Download then move to root folder)
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("sister-bucket"); // Dapatkan melalui Google Cloud -> Storage -> Browser/Bucket -> Create Bucket (Input nama bucket)

// Mendapatkan semua file dari Google Storage
app.get("/upload", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    res.send([files]);
    console.log("Success");
  } catch (error) {
    res.send("Error:" + error);
  }
});


// Mengupload file ke Google Storage
app.post("/upload", multer.single("imgfile"), (req, res) => {
  console.log("Made it /upload");
  try {
    if (req.file) {
      console.log("File found, trying to upload...");
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        res.status(200).send("Success");
        console.log("Success");
      });
      blobStream.end(req.file.buffer);
    } else throw "error with img";
  } catch (error) {
    res.status(500).send(error);
  }
});


// Mengirimkan file index.html ke client sebagai halaman utama
app.get("/", (req, res) => {
  res.sendFile(src + "/index.html");
});


// Memulai server di port 8080 (atau lainnya)
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});



app.use(express.json());


// Merename file di Google Storage bucket
app.post("/rename", async (req, res) => {
  console.log("Made it /rename"); 

  try {
    const { id, namabaru } = req.body;
    const file = bucket.file(id);
    await file.rename(namabaru);

    res.status(200).send("Success");
    console.log("File renamed successfully");
  } catch (error) {
    res.status(500).send(error);
    console.log("File rename ERROR",error);
  }
});

// Menghapus file di Google Storage bucket
app.post("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const file = bucket.file(id);
    await file.delete();

    res.status(200).send("Success");
    console.log("File deleted successfully");
  } catch (error) {
    res.status(500).send(error);
    console.log("File delete ERROR",error);
  }
});
### sharded clusters

hight availability
dedondancy
horizontaly

Config server:
metadata:
Shard locations
Chunk distribution
Shard keys

Queries: get metadata from config server

Grid store large files
store chuncks binary data PDF, Video... into chuncks/file

How GridFS Works

You upload a file.
GridFS splits it into chunks (binary data).
Metadata about the file (filename, length, chunk size, upload date, etc.) goes into fs.files.
Each chunk gets a sequential n value and goes into fs.chunks.
To download, GridFS reads chunks in order and reconstructs the file.

WHAT:
Images / Photos
Videos
PDFs
Audio files
Archives (ZIP, TAR, etc.)
Backups or exports

```javascript
async function upload() {
  const client = await MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("mydb");

  const bucket = new GridFSBucket(db, { bucketName: "videos" });
  fs.createReadStream("movie.mp4")
    .pipe(bucket.openUploadStream("movie.mp4"))
    .on("finish", () => console.log("File uploaded"));
}

upload();

// or download

bucket.openDownloadStreamByName("movie.mp4").pipe(fs.createWriteStream("./out.mp4"));
```

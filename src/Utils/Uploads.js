import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the destination folder for storing uploaded images
        cb(null, "./Uploads");
    },
    filename: (req, file, cb) => {
        // Define the filename for the uploaded image
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extname = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + extname);
    },
});
const upload = multer({ storage });
export default upload;

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: 'djj7farzy',
    api_key: '225418384165276',
    api_secret: 'eImY5APzUGpigJ35r9GxHkVJ8jA'
});




const uploadOnCloudanry = async (file) => {
    try {
        if (!file) return null;

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto"
        });

        // file has been uploaded on cloudinary
        console.log("uploaded successfully", response.url);
        fs.unlinkSync(file.path)
        return response;
    } catch (error) {
        console.error("Error during Cloudinary upload:", error);
        fs.unlinkSync(file.path)
        return null;
    }
}



export default uploadOnCloudanry
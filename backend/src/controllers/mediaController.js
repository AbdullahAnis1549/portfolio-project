const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = () => {
    return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
};

if (isCloudinaryConfigured()) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

const uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Failed to upload image' });
    }

    if (isCloudinaryConfigured()) {
        try {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'portfolio' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return res.status(500).json({ message: 'Failed to upload to Cloudinary' });
                    }
                    res.json({
                        message: 'Image uploaded successfully',
                        url: result.secure_url
                    });
                }
            );
            uploadStream.end(req.file.buffer);
        } catch (err) {
            console.error('Cloudinary upload exception:', err);
            res.status(500).json({ message: 'Cloudinary upload error' });
        }
    } else {
        // Fallback to local file upload if not configured (e.g. during local dev)
        try {
            const filename = `image-${Date.now()}${path.extname(req.file.originalname)}`;
            const filePath = path.join(__dirname, '../../uploads', filename);
            
            // Ensure directory exists
            const dir = path.join(__dirname, '../../uploads');
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(filePath, req.file.buffer);
            res.json({
                message: 'Image uploaded successfully (local)',
                url: `/uploads/${filename}`
            });
        } catch (err) {
            console.error('Local upload fallback error:', err);
            res.status(500).json({ message: 'Local upload fallback failed' });
        }
    }
};

const getMedia = async (req, res) => {
    let filesList = [];

    // 1. Read local files if they exist
    try {
        const directoryPath = path.join(__dirname, '../../uploads');
        if (fs.existsSync(directoryPath)) {
            const localFiles = fs.readdirSync(directoryPath);
            filesList = localFiles.map(file => ({
                name: file,
                url: `/uploads/${file}`,
                source: 'local'
            }));
        }
    } catch (err) {
        console.error('Error reading local files:', err);
    }

    // 2. Fetch from Cloudinary if configured
    if (isCloudinaryConfigured()) {
        try {
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: 'portfolio/',
                max_results: 100
            });
            const cloudinaryFiles = result.resources.map(file => ({
                name: file.public_id.split('/').pop(),
                url: file.secure_url,
                source: 'cloudinary'
            }));
            filesList = [...filesList, ...cloudinaryFiles];
        } catch (err) {
            console.error('Error fetching from Cloudinary:', err);
        }
    }

    res.json(filesList);
};

const deleteMedia = async (req, res) => {
    const fileId = req.params.id; // Could be local filename or Cloudinary public_id

    // Check if it's a Cloudinary file
    if (fileId.startsWith('portfolio/') && isCloudinaryConfigured()) {
        try {
            const result = await cloudinary.uploader.destroy(fileId);
            return res.json({ message: 'Cloudinary file deleted.', result });
        } catch (err) {
            console.error('Error deleting from Cloudinary:', err);
            return res.status(500).json({ message: 'Could not delete the file from Cloudinary' });
        }
    }

    // Otherwise treat as local file
    const directoryPath = path.join(__dirname, '../../uploads');
    const filePath = path.join(directoryPath, fileId);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not delete the file: ' + err.message });
        }
        res.json({ message: 'File is deleted.' });
    });
};

module.exports = { uploadImage, getMedia, deleteMedia };

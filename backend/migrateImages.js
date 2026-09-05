const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Models
const Home = require('./src/models/Home');
const Project = require('./src/models/Project');
const Setting = require('./src/models/Setting');

const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Upload a local file to Cloudinary
async function uploadToCloudinary(localUrl) {
    // Extract filename from URL like "http://localhost:5000/uploads/image-xxx.jpg"
    const filename = localUrl.split('/uploads/').pop();
    if (!filename) {
        console.log(`  ⚠️ Could not extract filename from: ${localUrl}`);
        return null;
    }

    const filePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️ File not found locally: ${filePath}`);
        return null;
    }

    try {
        console.log(`  ☁️ Uploading ${filename} to Cloudinary...`);
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'portfolio',
        });
        console.log(`  ✅ Uploaded! New URL: ${result.secure_url}`);
        return result.secure_url;
    } catch (err) {
        console.error(`  ❌ Cloudinary upload failed for ${filename}:`, err.message);
        return null;
    }
}

function isLocalhostUrl(url) {
    return url && (url.includes('localhost') || url.startsWith('/uploads/'));
}

async function migrateImages() {
    console.log('🚀 Starting Image Migration to Cloudinary...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    let updatedCount = 0;

    // 1. Fix Home heroImage
    console.log('--- Checking Home collection ---');
    const homes = await Home.find({});
    for (const home of homes) {
        if (isLocalhostUrl(home.heroImage)) {
            console.log(`  Found localhost image: ${home.heroImage}`);
            const newUrl = await uploadToCloudinary(home.heroImage);
            if (newUrl) {
                home.heroImage = newUrl;
                await home.save();
                updatedCount++;
                console.log(`  ✅ Home heroImage updated!\n`);
            }
        }
    }

    // 2. Fix Project images
    console.log('--- Checking Projects collection ---');
    const projects = await Project.find({});
    for (const project of projects) {
        if (isLocalhostUrl(project.image)) {
            console.log(`  Found localhost image in project "${project.title}": ${project.image}`);
            const newUrl = await uploadToCloudinary(project.image);
            if (newUrl) {
                project.image = newUrl;
                await project.save();
                updatedCount++;
                console.log(`  ✅ Project "${project.title}" image updated!\n`);
            }
        }
    }

    // 3. Fix Settings logo
    console.log('--- Checking Settings collection ---');
    const settings = await Setting.find({});
    for (const setting of settings) {
        if (isLocalhostUrl(setting.logo)) {
            console.log(`  Found localhost logo: ${setting.logo}`);
            const newUrl = await uploadToCloudinary(setting.logo);
            if (newUrl) {
                setting.logo = newUrl;
                await setting.save();
                updatedCount++;
                console.log(`  ✅ Settings logo updated!\n`);
            }
        }
    }

    // 4. Also upload logo.png to Cloudinary for Navbar
    console.log('--- Uploading logo.png to Cloudinary ---');
    const logoPath = path.join(UPLOADS_DIR, 'logo.png');
    if (fs.existsSync(logoPath)) {
        try {
            const result = await cloudinary.uploader.upload(logoPath, {
                folder: 'portfolio',
                public_id: 'logo',
            });
            console.log(`  ✅ logo.png uploaded to Cloudinary: ${result.secure_url}\n`);
        } catch (err) {
            console.log(`  ⚠️ logo.png upload failed: ${err.message}\n`);
        }
    }

    console.log('=================================');
    console.log(`✅ Migration complete! ${updatedCount} records updated.`);
    console.log('=================================');

    await mongoose.disconnect();
    process.exit();
}

migrateImages().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});

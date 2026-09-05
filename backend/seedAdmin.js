const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const myEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const myPassword = 'password123'; // Change this as needed
        const myUsername = 'admin';

        // Check if user already exists (by email OR username)
        const existingUser = await User.findOne({
            $or: [{ email: myEmail }, { username: myUsername }]
        });

        if (existingUser) {
            console.log(`Updating existing admin account...`);
            existingUser.email = myEmail;
            existingUser.password = myPassword; // The pre-save hook will re-hash this
            await existingUser.save();

            console.log('-----------------------------------');
            console.log('✅ Admin user updated successfully!');
            console.log(`📧 Email: ${myEmail}`);
            console.log(`🔑 Password: ${myPassword}`);
            console.log('-----------------------------------');
        } else {
            const admin = new User({
                username: myUsername,
                email: myEmail,
                password: myPassword,
                role: 'admin'
            });

            await admin.save();
            console.log('-----------------------------------');
            console.log('✅ New Admin user created successfully!');
            console.log(`📧 Email: ${myEmail}`);
            console.log(`🔑 Password: ${myPassword}`);
            console.log('-----------------------------------');
        }

        process.exit();
    } catch (err) {
        console.error('❌ Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();

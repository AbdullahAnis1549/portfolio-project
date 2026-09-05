const mongoose = require('mongoose');

/**
 * Serverless-safe MongoDB connection.
 *
 * On Vercel, this whole Express app is invoked as a serverless function.
 * A "cold start" spins up a fresh Node process and re-runs this module from
 * scratch; a "warm" invocation reuses the same process (and therefore the
 * same mongoose connection) for a later request.
 *
 * The important things for performance/reliability here are:
 *  1. Never open a new connection if one is already open on this process
 *     (readyState === 1) - reuse it. This is what makes warm invocations
 *     fast: no repeated connect handshake per request.
 *  2. If a connection attempt is already in progress, reuse that SAME
 *     promise instead of racing multiple concurrent mongoose.connect()
 *     calls when several requests land on a freshly-started cold instance
 *     at once.
 *  3. Never crash the process on a connection error. The original code
 *     called process.exit(1) on failure, which is fine for a traditional
 *     always-on server but is actively harmful in a serverless function -
 *     it kills the whole runtime for every request sharing that instance
 *     and forces Vercel to cold-start again, making failures cascade.
 *  4. Fail fast (serverSelectionTimeoutMS) instead of hanging - so a bad
 *     network path to Atlas surfaces as a quick, clear error rather than a
 *     multi-second stall for every request.
 */

let connectionPromise = null;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        // Already connected on this (warm) instance - nothing to do.
        return mongoose.connection;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(process.env.MONGODB_URI, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                bufferCommands: false,
            })
            .then((conn) => {
                console.log(`MongoDB Connected: ${conn.connection.host}`);
                return conn;
            })
            .catch((error) => {
                // Allow the next request to retry instead of caching a
                // permanent failure.
                connectionPromise = null;
                console.error(`MongoDB connection error: ${error.message}`);
                throw error;
            });
    }

    return connectionPromise;
};

module.exports = connectDB;

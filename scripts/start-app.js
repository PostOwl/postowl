import {server as app} from "./build/index.js"

function shutdownGracefully() {
    console.log("Server doing graceful shutdown");
    app.server.close();
}

// Shutdown gracefully when fly machine auto stops
process.on("SIGINT", shutdownGracefully);
process.on("SIGTERM", shutdownGracefully);

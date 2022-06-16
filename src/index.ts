import * as path from "path";
import { HttpServer } from "tsrpc";
import { MongoDB } from "./database";
import { serviceProto } from "./shared/protocols/serviceProto";

// Create the Server
const server = new HttpServer(serviceProto, {
    port: 3000,
    // Remove this to use binary mode (remove from the client too)
    cors: '*',
    logger: console
});

// Initialize before server start
async function init() {
    // Auto implement APIs
    await server.autoImplementApi(path.resolve(__dirname, 'api'));

    // init database
    await MongoDB.init(server.logger)
};

// Entry function
async function main() {
    await init();
    await server.start();
};
main().catch(err => {
    server.logger.error(err)
    process.exit(1);
});
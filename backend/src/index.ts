import Server from "./core/server";

new Server(Number(process.env.BACKEND_PORT)).listen();

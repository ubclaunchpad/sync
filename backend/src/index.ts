import Server from "./core/server";

new Server(Number(process.env.PORT)).listen();

import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/datbase.js";


const port = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error("PORT must be a number between 1 and 65535");
    }

    await connectDatabase();

    const server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

    server.on("error", (error) => {
      console.error("Server failed to start:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error(
      "Startup failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    process.exit(1);
  }
}

startServer();
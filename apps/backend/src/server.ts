import app from "./app";
import config from "./config/config";

const port = config.port;

const startServer = (): void => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

const main = (): void => {
  try {
    startServer();
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
};

main();

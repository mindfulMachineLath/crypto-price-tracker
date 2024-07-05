import app from "./app";
import config from "./config/config";
import priceService from "./service/priceService";

const port = config.port;

const startServer = (): void => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

const main = (): void => {
  try {
    priceService.run();
    startServer();
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
};

main();

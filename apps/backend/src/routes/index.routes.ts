import { Request, Response, Router } from "express";
import priceController from "../controllers/priceController";

const router = Router();

// Health check endpoint
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello, World!");
});

// Get price by coin ID
router.get("/price/:coinId", priceController.getPrice);

export default router;

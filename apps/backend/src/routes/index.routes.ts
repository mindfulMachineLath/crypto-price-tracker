import { Request, Response, Router } from "express";

const router = Router();

// Health check endpoint
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello, World!");
});

export default router;

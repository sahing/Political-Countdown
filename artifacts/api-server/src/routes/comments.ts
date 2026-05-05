import { Router, type IRouter } from "express";
import { Comment } from "../models/Comment";

const router: IRouter = Router();

router.get("/comments/:promiseId", async (req, res) => {
  try {
    const comments = await Comment.find({ promiseId: req.params.promiseId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(comments);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch comments");
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.post("/comments", async (req, res) => {
  try {
    const { promiseId, author, text, sentiment } = req.body as {
      promiseId: string;
      author: string;
      text: string;
      sentiment: "positive" | "negative" | "neutral";
    };
    if (!promiseId || !text?.trim()) {
      res.status(400).json({ error: "promiseId and text are required" });
      return;
    }
    const comment = await Comment.create({
      promiseId,
      author: author?.trim() || "Anonymous",
      text: text.trim(),
      sentiment: sentiment || "neutral",
    });
    res.status(201).json(comment);
  } catch (err) {
    req.log.error({ err }, "Failed to create comment");
    res.status(500).json({ error: "Failed to create comment" });
  }
});

router.delete("/comments/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete comment");
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;

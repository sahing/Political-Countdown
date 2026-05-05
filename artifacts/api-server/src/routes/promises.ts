import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { Promise as PromiseModel } from "../models/Promise";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] || "admin2025";

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const pwd = req.headers["x-admin-password"] as string | undefined;
  if (pwd !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/admin/verify", (req, res) => {
  const { password } = req.body as { password?: string };
  res.json({ valid: password === ADMIN_PASSWORD });
});

router.get("/promises", async (req, res) => {
  try {
    const promises = await PromiseModel.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(promises);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch promises");
    res.status(500).json({ error: "Failed to fetch promises" });
  }
});

router.post("/promises", requireAdmin, async (req, res) => {
  try {
    const body = req.body as {
      slug?: string;
      icon?: string;
      titleBengali?: string;
      titleEnglish?: string;
      descriptionBengali?: string;
      descriptionEnglish?: string;
      amount?: string;
      category?: string;
      status?: string;
      color?: string;
      order?: number;
    };

    if (!body.slug || !body.titleEnglish || !body.titleBengali || !body.amount) {
      res.status(400).json({ error: "slug, titleEnglish, titleBengali, and amount are required" });
      return;
    }

    const count = await PromiseModel.countDocuments();
    const promise = await PromiseModel.create({
      ...body,
      order: body.order ?? count,
    });
    res.status(201).json(promise);
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      res.status(409).json({ error: "A promise with that slug already exists" });
      return;
    }
    req.log.error({ err }, "Failed to create promise");
    res.status(500).json({ error: "Failed to create promise" });
  }
});

router.patch("/promises/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await PromiseModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) {
      res.status(404).json({ error: "Promise not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update promise");
    res.status(500).json({ error: "Failed to update promise" });
  }
});

router.delete("/promises/:id", requireAdmin, async (req, res) => {
  try {
    await PromiseModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete promise");
    res.status(500).json({ error: "Failed to delete promise" });
  }
});

export default router;

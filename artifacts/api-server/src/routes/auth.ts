import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const sessions = new Set<string>();

router.post("/admin/login", (req, res) => {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD || "effimero";

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: "Password non corretta." });
  }

  const token = randomUUID();
  sessions.add(token);

  res.json({ token });
});

router.post("/admin/logout", (req, res) => {
  const token = req.headers["x-admin-token"] as string;
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

router.get("/admin/verify", (req, res) => {
  const token = req.headers["x-admin-token"] as string;
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ valid: false });
  }
  res.json({ valid: true });
});

export default router;
export { sessions };

import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

async function getSetting(key: string): Promise<string | null> {
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
  return row?.value ?? null;
}

async function setSetting(key: string, value: string): Promise<void> {
  const existing = await getSetting(key);
  if (existing !== null) {
    await db.update(settingsTable).set({ value }).where(eq(settingsTable.key, key));
  } else {
    await db.insert(settingsTable).values({ key, value });
  }
}

router.get("/settings", async (_req, res) => {
  const wipEnabled = await getSetting("wip_enabled");
  const wipCountdown = await getSetting("wip_countdown");
  const wipMessage = await getSetting("wip_message");

  res.json({
    wipEnabled: wipEnabled === "true",
    wipCountdown: wipCountdown ?? null,
    wipMessage: wipMessage ?? null,
  });
});

router.put("/settings", async (req, res) => {
  const { wipEnabled, wipCountdown, wipMessage } = req.body;

  if (typeof wipEnabled === "boolean") {
    await setSetting("wip_enabled", wipEnabled ? "true" : "false");
  }
  if (wipCountdown !== undefined) {
    await setSetting("wip_countdown", wipCountdown ?? "");
  }
  if (wipMessage !== undefined) {
    await setSetting("wip_message", wipMessage ?? "");
  }

  const newWipEnabled = await getSetting("wip_enabled");
  const newWipCountdown = await getSetting("wip_countdown");
  const newWipMessage = await getSetting("wip_message");

  res.json({
    wipEnabled: newWipEnabled === "true",
    wipCountdown: newWipCountdown ?? null,
    wipMessage: newWipMessage ?? null,
  });
});

export default router;

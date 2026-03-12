import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, inquiriesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  CreateProductBody,
  ListProductsQueryParams,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
  CreateInquiryBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  try {
    const query = ListProductsQueryParams.parse(req.query);
    let conditions = [];

    if (query.category && query.category !== "all") {
      conditions.push(eq(productsTable.category, query.category));
    }
    if (query.featured !== undefined) {
      conditions.push(eq(productsTable.featured, query.featured));
    }

    const products =
      conditions.length > 0
        ? await db
            .select()
            .from(productsTable)
            .where(and(...conditions))
            .orderBy(productsTable.createdAt)
        : await db
            .select()
            .from(productsTable)
            .orderBy(productsTable.createdAt);

    res.json(products);
  } catch (err) {
    res.status(400).json({ error: "Invalid query parameters" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const [product] = await db
      .insert(productsTable)
      .values({
        name: body.name,
        description: body.description,
        category: body.category,
        imageUrl: body.imageUrl ?? null,
        sizes: body.sizes,
        featured: body.featured ?? false,
      })
      .returning();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid product data" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = GetProductParams.parse({ id: Number(req.params.id) });
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid product ID" });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const { id } = UpdateProductParams.parse({ id: Number(req.params.id) });
    const body = UpdateProductBody.parse(req.body);
    const [updated] = await db
      .update(productsTable)
      .set({
        name: body.name,
        description: body.description,
        category: body.category,
        imageUrl: body.imageUrl ?? null,
        sizes: body.sizes,
        featured: body.featured ?? false,
      })
      .where(eq(productsTable.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid product data" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = DeleteProductParams.parse({ id: Number(req.params.id) });
    const [deleted] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Invalid product ID" });
  }
});

router.post("/inquiries", async (req, res) => {
  try {
    const body = CreateInquiryBody.parse(req.body);
    const [inquiry] = await db
      .insert(inquiriesTable)
      .values({
        productId: body.productId,
        name: body.name,
        email: body.email,
        message: body.message ?? null,
        size: body.size ?? null,
      })
      .returning();
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ error: "Invalid inquiry data" });
  }
});

export default router;

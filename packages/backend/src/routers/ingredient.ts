import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  const result = await prisma.ingredient.findMany({
    include: {
      usedIn: true,
    },
  });
  res.json(result);
});

router.delete("/:id", async (req, res) => {
  console.log("Deleting Ingredient", req.params.id);
  try {
    await prisma.ingredient.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.end();
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

router.post("/", async (req, res) => {
  const content = req.body;
  try {
    await prisma.ingredient.create({ data: content });
    res.end();
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

export default router;

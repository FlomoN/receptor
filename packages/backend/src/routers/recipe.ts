import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = await prisma.recipe.findMany({
      include: { ingredients: { include: { Ingredient: true } } },
    });
    res.json(query);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

router.post("/", async (req, res) => {
  const content = req.body;
  try {
    await prisma.recipe.create({ data: content });
    res.end();
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

router.delete("/:id", async (req, res) => {
  console.log("deleting recipe", req.params.id);
  try {
    await prisma.recipe.delete({ where: { id: Number(req.params.id) } });
    res.end();
  } catch (e) {
    res.status(404).end();
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await prisma.recipe.findFirst({
      where: { id: Number(req.params.id) },
      include: { ingredients: { include: { Ingredient: true } } },
    });
    if (result == null) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  } catch (e) {
    res.status(500).end();
  }
});

router.put("/:id", async (req, res) => {
  type recipeUpdate = {
    name?: string;
    content?: string;
    image?: string;
    ingredients?: {
      create: {
        amount: number;
        ingredientId: any;
        unit?: string;
      }[];
    };
  };

  const updateObject: recipeUpdate = req.body;

  if (updateObject.ingredients) {
    updateObject.ingredients.create = await Promise.all(
      updateObject.ingredients.create.map(async (elem) => {
        const matchIngredient = await prisma.ingredient.findFirst({
          where: { name: elem.ingredientId },
        });
        if (matchIngredient == null) {
          const created = await prisma.ingredient.create({
            data: {
              name: elem.ingredientId,
              unit: elem.unit!,
            },
          });
          return {
            amount: elem.amount,
            ingredientId: created.id,
          };
        } else {
          return {
            amount: elem.amount,
            ingredientId: matchIngredient.id,
          };
        }
      })
    );

    //Delete old ingredientMapping
    const oldMappings = await prisma.recipe.findFirst({
      where: { id: Number(req.params.id) },
      include: {
        ingredients: true,
      },
    });

    await Promise.all(
      oldMappings!.ingredients.map(async (elem) => {
        await prisma.ingredientUsage.delete({ where: { id: elem.id } });
      })
    );

    console.log("updated ingredients", updateObject.ingredients);
  }

  try {
    const result = await prisma.recipe.update({
      where: { id: Number(req.params.id) },
      data: updateObject,
    });
    if (result == null) {
      res.status(404).end();
    } else {
      res.end();
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

export default router;

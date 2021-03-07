import express from "express";
import recipe from "./routers/recipe";
import ingredient from "./routers/ingredient";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const query = await prisma.recipe.findMany();
  res.json(query);
});

app.use("/recipe", recipe);
app.use("/ingredient", ingredient);

app.listen(3001, () => console.log("Listening on 3001"));

import express from "express";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
const app = express();

app.get("/", async (req, res) => {
  const query = await prisma.recipe.findMany();
  res.send(query);
});

app.listen(3001, () => console.log("Listening on 3001"));

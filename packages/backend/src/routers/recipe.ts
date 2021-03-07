import express from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = await prisma.recipe.findMany();
    res.json(query);
  } catch(e){
    console.log(e);
    res.status(500).end();
  }
});

router.post("/", async (req, res) => {
  const content = req.body;
  try {
    await prisma.recipe.create({data: content});
    res.end();
  } catch (e){
    console.log(e);
    res.status(500).end();
  }  
});


router.delete("/:id", async (req, res) => {
  console.log("deleting recipe", req.params.id);
  try{
    await prisma.recipe.delete({where: {id: Number(req.params.id)}});
    res.end();
  } catch(e){
    res.status(404).end();
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await prisma.recipe.findFirst({where: {id: Number(req.params.id)}});
    if(result == null){
      res.status(404).end();
    } else {
      res.json(result);
    }
  } catch (e) {
    res.status(500).end();
  }
});

export default router;
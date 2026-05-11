import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { minhasReservas, reservarLivro } from "../controllers/reserva.controller";

const router = Router()

router.get('/reservar/minhas', authMiddleware, minhasReservas)
router.post('/reservar', authMiddleware, reservarLivro)

export {router as reservaRouter}
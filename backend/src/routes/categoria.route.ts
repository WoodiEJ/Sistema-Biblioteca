import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { atualizarCategoria, cadastroCategoria, consultarCategoria, consultarCategorias, deletarCategoria } from "../controllers/categoria.controller";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router()

router.get('/categorias', authMiddleware, consultarCategorias)
router.get('/categorias/:id', authMiddleware, consultarCategoria)
router.post('/categorias', authMiddleware, adminMiddleware, cadastroCategoria)
router.put('/categorias/:id', authMiddleware, adminMiddleware, atualizarCategoria)
router.delete('/categorias/:id', authMiddleware, adminMiddleware, deletarCategoria)

export {router as categoriaRouter}
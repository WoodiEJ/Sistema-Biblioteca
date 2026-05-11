import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { atualizarLivro, cadastrarLivro, consultarLivro, consultarLivros, deletarLivro, devolverLivro, livrosPopulares } from "../controllers/livros.controller";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router()

router.get('/livro', authMiddleware, consultarLivros)
router.get('/livro/popular', authMiddleware, livrosPopulares)
router.get('/livro/:id', authMiddleware, consultarLivro)
router.post('/livro', authMiddleware, adminMiddleware, cadastrarLivro)
router.put('/livro/:id', authMiddleware, adminMiddleware, atualizarLivro)
router.delete('/livro/:id', authMiddleware, adminMiddleware, deletarLivro)
router.patch('/livro/:id', authMiddleware, adminMiddleware, devolverLivro)

export {router as livrosRouter}
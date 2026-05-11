import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { atualizarEmprestimo, consultarEmprestimo, consultarEmprestimos, excluirEmprestimo } from "../controllers/gerenciamento.controller";

const router = Router()

router.get('/gerenciar', authMiddleware, adminMiddleware, consultarEmprestimos)
router.get('/gerenciar/:id', authMiddleware, adminMiddleware, consultarEmprestimo)
router.put('/gerenciar/:id', authMiddleware, adminMiddleware, atualizarEmprestimo)
router.delete('/gerenciar/:id', authMiddleware, adminMiddleware, excluirEmprestimo)

export {router as gerenciamentoRouter}
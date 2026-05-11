import { Router } from "express";
import { logar } from "../controllers/login.controller";

const router = Router()

router.post('/login', logar)

export {router as loginRouter}
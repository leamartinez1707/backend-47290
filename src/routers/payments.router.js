import { Router } from "express";
import paymentsControl from "../controllers/paymentsControl.js";


const router = Router()


router.post('/create-checkout-session', paymentsControl.createSession)
router.get('/success', (req, res) => res.send('Session creada con éxito'))
router.get('/cancel', paymentsControl.failedSession)

export default router
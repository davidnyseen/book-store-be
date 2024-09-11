import { Router } from 'express';
import controller from './company.controller';

const router = Router();

router.get('/list', controller.getList);

export default router;

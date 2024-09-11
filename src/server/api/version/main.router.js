import { HttpStatus } from '@server/utils/status';
import { Router } from 'express';
import { version } from '../../../../package.json';

export function initVersion(router) {
  router.get('/version', (req, res) => res.JSON(HttpStatus.Ok, { version }));
}

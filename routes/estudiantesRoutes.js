const { Router } = require('express');
const controlador = require('../controllers/estudiantesController');

const router = Router();

router.get('/', controlador.listar);
router.post('/', controlador.registrar);

module.exports = router;

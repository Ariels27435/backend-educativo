const { Router } = require('express');
const controlador = require('../controllers/actividadesController');

const router = Router();

router.get('/', controlador.listar);

module.exports = router;

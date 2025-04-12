const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const boletoController = require('../controllers/boletoController');

router.post('/import',upload.single('file') ,boletoController.importCsv);
router.post('/rename',upload.single('file') ,boletoController.renamePdfs);
router.get('/', boletoController.index);

module.exports = router;

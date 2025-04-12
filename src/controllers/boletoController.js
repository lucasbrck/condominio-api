const boletoService = require('../services/boletoService');
const fs = require('fs/promises');

const importCsv = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo encontrado' });
    }
    await boletoService.importFromCsv(file.path);
    await fs.unlink(file.path);
    res.status(200).json({ message: 'CSV importado corretamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const renamePdfs = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo encontrado' });
    }
    await boletoService.renamePdfs(file.path);
    await fs.unlink(file.path)
    res.status(200).json({ message: 'PDFs processados corretamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const index = async (req, res) => {
  try {
    const filter = req.query;
    const boletos = await boletoService.index(filter);
    res.status(200).json(boletos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
module.exports = { importCsv, renamePdfs,index };

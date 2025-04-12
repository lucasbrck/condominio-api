const fs = require('fs/promises');
const path = require('path');
const boletoValidator = require('../validators/boletoValidators');
const parseCsv = require('../utils/csvParser');
const boletoRepository = require('../repositories/boletoRepository');
const boletoTransformer = require('../transformers/boletoTransformer');
const loteRepository = require('../repositories/loteRepository');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const pdfLib = require('pdf-lib');

const importFromCsv = async (filePath) => {
  const fileBuffer = await fs.readFile(filePath);

  const boletosArray = await parseCsv(fileBuffer);
  if(boletosArray.length === 0) {
    throw new Error('CSV vazio');
  }
  boletoValidator.validateHeaders(Object.keys(boletosArray[0]));
  const loteMap = await getLoteMapForCsv(boletosArray);
  console.log(loteMap);
  const formattedBoletos = boletosArray.map(boleto => {
    const loteId = loteMap.get(boleto.unidade);
    if (!loteId) {
      console.log(`Lote não encontrado: ${boleto.unidade}`);
      return null;
    }
  
    return boletoTransformer.toDomainModel(boleto, loteId);
  }).filter(Boolean);
  if (formattedBoletos.length === 0) {
    throw new Error('Nenhum boleto válido encontrado');
  }
  await boletoRepository.createMany(formattedBoletos);
};

const renamePdfs = async(filePath) => {
  const pdfBuffer = await fs.readFile(filePath);
  let pdfAux = [];

  await new Promise((resolve, reject) => {
    pdfExtract.extractBuffer(pdfBuffer, {}, (err, data) => {
      if (err) return reject(err);
      data.pages.forEach((page, index) => {
        //Para o arquivo gerado só possui um campo, em um caso real, o boleto teria uma chave de identificação algo como "Nome:"" poderia usar um REGEXP para encontrar o valor com page.content.filter ou find...
        console.log(page.content[0]?.str);
        const boletoName = page.content[0]?.str || `Page_${index}`;
        pdfAux.push({ newName: boletoName, page: index });
      });
      resolve();
    });
  });
  const pdfDoc = await pdfLib.PDFDocument.load(pdfBuffer);
  console.log('pdfAux,', pdfAux);

  for (const item of pdfAux) {
    const newPdf = await pdfLib.PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [item.page]);
    newPdf.addPage(copiedPage);

    const newPdfSplitted = await newPdf.save();
    await fs.mkdir('boletos', { recursive: true });
    const outputFilePath = path.join(
      'boletos',
      `${await getIdFromName(item.newName)}.pdf`
    );

    await fs.writeFile(outputFilePath, newPdfSplitted);
    // console.log(`Saved: ${outputFilePath}`);
  }
}

const getLoteMapForCsv = async (boletosArray) =>{
  const loteNames = [...new Set(boletosArray.map(b => b.unidade))];

  const loteRecords = await loteRepository.findManyByNames(loteNames);

  const loteMap = new Map();
  loteRecords.forEach(({ name, id }) => loteMap.set(parseInt(name).toString(), id));
  return loteMap
}

const index = async (filter) => {
  const boletos = await boletoRepository.index(filter);
  if (filter.relatorio) {
    const pdfDoc = await pdfLib.PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(pdfLib.StandardFonts.Helvetica);
    const fontSize = 12;

    const { height } = page.getSize();
    let y = height - 40;
    page.drawText('Relatório de Boletos', {
      x: 50,
      y,
      size: 18,
      font,
      color: pdfLib.rgb(0, 0, 0),
    });

    y -= 30;
    page.drawText('ID | Nome Sacado       | ID Lote | Valor   | Linha Digitável', {
      x: 50,
      y,
      size: fontSize,
      font,
    });
    y -= 15;
    page.drawText('---------------------------------------------------------------', {
      x: 50,
      y,
      size: fontSize,
      font,
    });
    y -= 20;
    boletos.forEach((boleto) => {
      const line = `${boleto.id.toString().padEnd(3)} | ${boleto.nome_sacado.padEnd(20)} | ${boleto.lote_id.toString().padEnd(7)} | R$ ${boleto.valor.toFixed(2).padEnd(7)} | ${boleto.linha_digitavel}`;
      if (y < 50) {
        y = height - 40;
        const newPage = pdfDoc.addPage();
        page = newPage;
      }
      page.drawText(line, {
        x: 50,
        y,
        size: fontSize,
        font,
      });
      y -= 15;
    });

    const pdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');

    return { base64: base64Pdf };
  }
  return boletos
}
const getIdFromName = async (name)=>{
  const boletos = await boletoRepository.findByNames(name);
  return boletos.id
}
module.exports = { importFromCsv, renamePdfs, index}
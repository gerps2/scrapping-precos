var OrquestradorDeScraping = require('./facilitadores/orquestrador');
var scrapingConcorrenteBarbosa = require('./facilitadores/concorrentesEstrategias/concorrenteBarbosa');
var scrapingConcorrenteBomLugar = require('./facilitadores/concorrentesEstrategias/concorrenteBomLugar');
const fs = require('fs');
const xlsx = require('xlsx');

var orquestrador = new OrquestradorDeScraping();

// Adicionando estratégias ao orquestrador
orquestrador.adicionarEstrategia('BOM_LUGAR', scrapingConcorrenteBomLugar);
orquestrador.adicionarEstrategia('BARBOSA', scrapingConcorrenteBarbosa);

let rawData = fs.readFileSync('./config.json');
let config = JSON.parse(rawData);

let resultados = {};

async function buscaPrecosConcorrentes() {
    for (let item of config.items_para_pesquisa) {
        let precos = [];

        for (let concorrente of config.concorrentes) {
            let preco = await orquestrador.executarEstrategia(concorrente.tipo_scraping, concorrente, item);
            precos.push({ "concorrente": concorrente.tipo_scraping, "preco": preco });
        }

        resultados[item] = precos;
    }
}

buscaPrecosConcorrentes().then(() => {
    let data = JSON.stringify(resultados, null, 2);
    fs.writeFileSync('./resultados.json', data);

    let rawData1 =fs.readFileSync('./resultados.json');
    let jsonData = JSON.parse(rawData1);

    let worksheetData = [];

    for (const produto in jsonData) {
        jsonData[produto].forEach(item => {
            worksheetData.push({
                Produto: produto,
                Concorrente: item.concorrente,
                Preco: item.preco
            });
        });
    }

    const worksheet = xlsx.utils.json_to_sheet(worksheetData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "precos");
    xlsx.writeFile(workbook, 'precos.xlsx');
    console.log('Resultados salvos em resultados.json');
}).catch(error => {
    console.error('Erro durante o scraping:', error);
});
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
const OrquestradorDeScraping = require('./facilitadores/orquestrador');
const { scrapingPorRequestConcorrenteBarbosa, scrapingPorRequestConcorrenteBomLugar } = require('./facilitadores/concorrentesEstrategiasPorRequest');
const { scrapingConcorrenteBarbosa, scrapingConcorrenteBomLugar } = require('./facilitadores/concorrentesEstrategias');

let rawData = fs.readFileSync('./config.json');
let config = JSON.parse(rawData);
let orquestrador = new OrquestradorDeScraping();
let resultados = {};

function adicionandoEstrategiasPorConfig(){
    if(config.buscarPrecoPorRequest){
        orquestrador.adicionarEstrategia('BOM_LUGAR', scrapingPorRequestConcorrenteBomLugar);
        orquestrador.adicionarEstrategia('BARBOSA', scrapingPorRequestConcorrenteBarbosa);
    }else{
        orquestrador.adicionarEstrategia('BOM_LUGAR', scrapingConcorrenteBomLugar);
        orquestrador.adicionarEstrategia('BARBOSA', scrapingConcorrenteBarbosa);
    }
}

function buscarInformacoesProdutosPorPlanilha(){
    const arquivoXLSX = 'assets/produtos.xlsx';

    if (!fs.existsSync(arquivoXLSX)) throw new Error('O arquivo XLSX não foi encontrado.');

    const arquivo = xlsx.readFile(arquivoXLSX);
    const primeiraPlanilha = arquivo.Sheets[arquivo.SheetNames[0]];
    const dados = xlsx.utils.sheet_to_json(primeiraPlanilha);

    return dados;
}

function codigoBarrasDosProdutos(){
    let produtos = buscarInformacoesProdutosPorPlanilha()
    return produtos.map(produto => produto.codigoBarras);
}

function salvaOsResultadosNumExcel(){
    const newWorkbook = xlsx.utils.book_new();
    let dataForSheet;

    if(config.buscaPorCodigoDeBarras){
        const dadosOriginais = buscarInformacoesProdutosPorPlanilha();
        dataForSheet = dadosOriginais.map((dadoOriginal) => {
          const produtoAtualizado = { ...dadoOriginal };
          config.concorrentes.forEach((concorrente) => {
            const resultadoConcorrente = resultados[concorrente.nome];
            const produtoEncontrado = resultadoConcorrente.find(
              (r) => r.produto === dadoOriginal.codigoBarras
            );

            produtoAtualizado[concorrente.nome] =
              produtoEncontrado && produtoEncontrado.preco > 0
                ? produtoEncontrado.preco
                : "Não disponível";
          });
          return produtoAtualizado;
        });
    }else{
        dataForSheet = config.items_para_pesquisa.map(nomeProduto => {
            const produto = { nomeProduto };
            config.concorrentes.forEach(concorrente => {
                const preco = resultados[concorrente.nome] && resultados[concorrente.nome][nomeProduto];
                produto[concorrente.nome] = preco || 'Não disponível';
            });
            return produto;
        });
    }

    const newWorksheet = xlsx.utils.json_to_sheet(dataForSheet);
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Resultados');

    const resultadosDir = path.join(__dirname, 'assets/resultados');
    if (!fs.existsSync(resultadosDir)) {
        fs.mkdirSync(resultadosDir, { recursive: true });
    }

    const filePath = path.join(resultadosDir, 'resultados_precos.xlsx');
    xlsx.writeFile(newWorkbook, filePath);
    console.log(`Arquivo salvo em: ${filePath}`);
}

async function buscaPrecosConcorrentes() {
    adicionandoEstrategiasPorConfig();
    let produtos = config.buscaPorCodigoDeBarras ? codigoBarrasDosProdutos() : config.items_para_pesquisa

    const buscaPrecos = config.concorrentes.map(concorrente => 
        orquestrador.executarEstrategia(concorrente.tipo_scraping, concorrente, produtos)
                    .then(precos => resultados[concorrente.nome] = precos)
    );

    await Promise.all(buscaPrecos);
}

buscaPrecosConcorrentes().then(() => {
    salvaOsResultadosNumExcel()
}).catch(error => {
    console.error('Erro durante o scraping:', error);
});
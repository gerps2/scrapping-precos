const axios = require('axios');
const cheerio = require('cheerio');

async function scrapingPorRequestConcorrenteBomLugar(informacoesConcorrente, nomeDoProduto) {
    try {
        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(100);

        const fetchProductData = async (produto) => {
            const url = `https://bomlugarzaia.lojaqui.com.br/Home/ResultadosPesquisa?termo=${produto}`;
            const config = {
                timeout: 5000
            };
            try {
                const response = await axios.get(url, config);
                const $ = cheerio.load(response.data);
                const precoSeletor = '.preco.preco-produto-grade'; 
                const precoElemento = $(precoSeletor).first();
                let preco = precoElemento.text().trim();
        
                preco = preco && preco.replace(/[^\d,.-]/g, '').replace(',', '.');
                const precoNumerico = preco ? parseFloat(preco) : 0;
        
                return {
                    produto,
                    preco: precoNumerico > 0 ? precoNumerico : 'Não disponível'
                };
            } catch (error) {
                console.error(`Erro ao buscar dados para o produto ${produto}:`, error);
                return { produto, preco: 'Não disponível' };
            }
        };

        const promises = nomeDoProduto.map(produto => limit(() => fetchProductData(produto)));
        const results = await Promise.all(promises);
        return results;
    } catch (error) {
        console.error('Erro durante o processo de scraping:', error);
        throw error;
    }
}

module.exports = scrapingPorRequestConcorrenteBomLugar;

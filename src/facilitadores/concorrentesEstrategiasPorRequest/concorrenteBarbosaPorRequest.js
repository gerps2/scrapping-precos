const axios = require('axios');

async function scrapingPorRequestConcorrenteBarbosa(informacoesConcorrente, nomeDoProduto) {
    try {
        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(100);

        const fetchProductData = async (produto) => {
            const url = 'https://bsm.applayos.com:6033/api/ecom/enav/buscarprodutos';

            const headers = {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Origin': 'https://www.barbosasupermercados.com.br',
                'Referer': 'https://www.barbosasupermercados.com.br/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            };

            const data = {
                filter: { text: produto },
                session: {
                    session: "83e0de6c3648c81704234558295",
                    time: 1704234609120,
                    userId: "",
                    username: "",
                    modality: "retirada",
                    info: {
                        cartqtd: 0,
                        cartvalue: 0,
                        wishlistqtd: 0,
                        lastcartqtd: 0
                    },
                    loja: {
                        id: "5d15091c8d659c4b40f1ac5f",
                        cnpj: "60437647002312",
                        numero: 12,
                        nome: "loja sales gomes",
                        end: {
                            endereco: "AV DOUTOR SALLES GOMES",
                            numero: "347",
                            complemento: "",
                            bairro: "CENTRO",
                            cep: "18270320",
                            cidade: "Tatuí",
                            uf: "SP"
                        },
                        distancia: 63.121
                    },
                    position: {
                        lat: -22.8278253,
                        lng: -47.5977167
                    },
                    origem: {
                        browser: "chrome",
                        platform: "web"
                    },
                    device: {
                        ip_address: "18.228.130.29",
                        device_id: "d520c7a8-421b-4563-b955-f5abc56b97ec"
                    },
                    dataText: "02/01/2024",
                    status: "Sessão Renovada",
                    ativo: true,
                    _id: "65948e3eb1a2c44b3ec7a178",
                    changePostion: true,
                    end: "av doutor salles gomes, 347",
                    sociallogin: false,
                    syncChannel: "session"
                },
                app_key: "7oqy99iVAJD40mdgCduSEY5S",
                app_secret: "iirzQKYZDncF"
            };

            try {
                const response = await axios.post(url, data, { headers });
                let preco = 0;
                if (response.status === 200 && response.data && response.data.data.produtos && response.data.data.produtos.length > 0) {
                    preco = response.data.data.produtos[0].por;
                }

                return { produto, preco };
            } catch (error) {
                console.error(`Erro ao buscar dados para o produto ${produto}:`, error);
                return { produto, error: error.message };
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

module.exports = scrapingPorRequestConcorrenteBarbosa;

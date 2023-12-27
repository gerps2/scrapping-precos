class OrquestradorDeScraping {
    constructor() {
        this.estrategias = {};
    }

    adicionarEstrategia(concorrente, funcaoEstrategia) {
        this.estrategias[concorrente] = funcaoEstrategia;
    }

    async executarEstrategia(concorrente, informacoesConcorrente, nomeDoProduto) {
        if (!this.estrategias[concorrente]) {
            throw new Error(`Estratégia para ${concorrente} não definida.`);
        }

        return this.estrategias[concorrente](informacoesConcorrente, nomeDoProduto);
    }
}

module.exports = OrquestradorDeScraping;

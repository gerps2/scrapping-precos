# Resumo do Projeto `recuperando-precos`

## Descrição
O `recuperando-precos` é uma aplicação Node.js destinada ao web scraping em sites de supermercados para coletar preços de produtos específicos. A informação coletada é armazenada, provavelmente em formatos de planilha.

## Componentes Principais
- **`config.json`**: Define supermercados e produtos para pesquisa.
- **`main.js`**: Arquivo principal que orquestra o scraping.
- **`package.json`**: Contém metadados e dependências do projeto.
- **Pasta `facilitadores`**: Inclui estratégias de scraping para cada supermercado e um script de orquestração (`orquestrador.js`).

## Dependências
- Selenium WebDriver: Para automação de navegador e scraping.
- Chromedriver: Para o navegador Chrome.
- xlsx: Para manipulação de dados de planilhas.

# Como Utilizar o Projeto

## Pré-requisitos
- Node.js instalado.
- Conhecimento em JavaScript e Node.js.

## Passos para Utilização
1. **Instalação de Dependências**: 
   Execute `npm install` no diretório do projeto.

2. **Configuração**: 
   Edite `config.json` para definir supermercados e produtos.

3. **Execução**: 
   Rode o script com `node main.js`.

4. **Análise dos Resultados**: 
   Verifique os dados coletados após a execução.

## Observações Importantes
- Respeite as políticas dos sites e leis de direitos autorais.
- Ajustes podem ser necessários de acordo com alterações nos sites dos supermercados.
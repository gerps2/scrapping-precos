# Resumo do Projeto `recuperando-precos`

## Descrição
O `recuperando-precos` é uma aplicação Node.js criada para realizar web scraping em sites de supermercados com o objetivo de coletar preços de produtos listados em uma planilha. Os preços são recuperados tanto via API quanto por scraping direto do HTML e são salvos em uma nova planilha para análise.

## Componentes Principais
- **`config.json`**: Define supermercados e produtos para pesquisa.
- **`main.js`**: Arquivo principal que orquestra o scraping.
- **`package.json`**: Contém metadados e dependências do projeto.
- **Pasta `facilitadores`**: Inclui estratégias de scraping para cada supermercado e um script de orquestração (`orquestrador.js`).

## Dependências
- Selenium WebDriver: Para automação de navegador e scraping.
- Chromedriver: Para o navegador Chrome.
- xlsx: Para manipulação de dados de planilhas.
- axios: Para realizar requisições HTTP.
- cheerio: Para análise de HTML no lado do servidor.
- p-limit: Para limitar o número de chamadas HTTP simultâneas.

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
   #### Opção 1: Execução Direta
   Rode o script diretamente com Node.js usando o comando abaixo no  terminal:
   ```bash
   node main.js
   ```

   #### Opção 2: Utilizando Docker
   Para executar o projeto em um container Docker, siga os passos abaixo:

   1. **Construindo a Imagem Docker**:
      Construa a imagem Docker do projeto usando o seguinte comando:
      ```bash
      cd src/
      docker build -t recuperando-precos .
      ```
      Este comando constrói uma imagem Docker com o nome    `recuperando-precos` baseada no `Dockerfile` do projeto.

   2. **Rodando o Container com Mapeamento de Volumes**:
      Execute o container com o seguinte comando:
      ```bash
      docker run -d -v $(pwd)/assets/resultados:/usr/src/app/assets/resultados recuperando-precos
      ```
      Este comando inicia um container baseado na imagem    `recuperando-precos`, mapeando a pasta `volumes` no diretório atual  do host para o volume `/usr/src/app/assets/resultados` dentro do   container. Os resultados do scraping serão salvos nesta pasta,   permitindo fácil acesso e persistência dos dados.

   O script irá processar a lista de produtos, coletar os preços dos    supermercados configurados e salvar os resultados em uma planilha na    pasta `assets/resultados`.


4. **Análise dos Resultados**: 
   Verifique os dados coletados após a execução.

## Observações Importantes
- Respeite as políticas dos sites e leis de direitos autorais.
- Ajustes podem ser necessários de acordo com alterações nos sites dos supermercados.
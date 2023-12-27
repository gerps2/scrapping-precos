const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
    
const fs = require('fs');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

async function scrapingConcorrenteBomLugar(informacoesConcorrente, nomeDoProduto) {
    var options = new chrome.Options();
    options.addArguments('--disable-extensions');
    options.addArguments('--headless')
    options.windowSize({ width: 1920, height: 1080 });

    const browser = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await browser.get(informacoesConcorrente.url);

        const cookies = await browser.wait(until.elementLocated(By.xpath('/html/body/div[4]/div/div/div/div[3]/div/div/a')), 1000);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await cookies.click();

        // Esperar e interagir com o campo de entrada
        const campoPesquisa = await browser.wait(until.elementLocated(By.xpath('/html/body/nav/div/div/div[2]/div/div[1]/form/input')), 1000);
        await campoPesquisa.sendKeys(nomeDoProduto);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Clicar no botão de pesquisa
        const botaoPesquisa = await browser.findElement(By.xpath('/html/body/nav/div/div/div[2]/div/div[1]/form/button'));
        await botaoPesquisa.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Esperar a lista de produtos carregar
        await browser.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div[2]')), 1000);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Obter o preço do primeiro produto
        const precoElemento = await browser.findElement(By.xpath('/html/body/div[3]/div/div[2]/div[1]/div/div[2]/h3'));
        const preco = await precoElemento.getText();
        return preco;
    } catch (error) {
        console.error('Erro durante o scraping:', error);
        throw error;
    } finally {
        await browser.quit();
    }
}

module.exports = scrapingConcorrenteBomLugar;

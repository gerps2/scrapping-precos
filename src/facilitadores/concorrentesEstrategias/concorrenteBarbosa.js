const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
    
const fs = require('fs');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

async function scrapingConcorrenteBarbosa(informacoesConcorrente, nomeDoProduto) {
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

        //aceitar cookies
        await browser.wait(until.elementLocated(By.xpath('/html/body/app-root/app-cookies-alert/div[2]/div/div/div/button')), 3000);
        const botaoCookies = await browser.findElement(By.xpath('/html/body/app-root/app-cookies-alert/div[2]/div/div/div/button'));
        botaoCookies.click();

        await browser.wait(until.elementLocated(By.xpath('/html/body/app-root/app-header3/div/div[2]/div/div/div[2]/div/input')), 3000);
        // Encontrar o campo de entrada e inserir o nome do produto
        const campoPesquisa = await browser.findElement(By.xpath('/html/body/app-root/app-header3/div/div[2]/div/div/div[2]/div/input'));
        campoPesquisa.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await campoPesquisa.sendKeys(nomeDoProduto);

        // Clicar no botão de pesquisa
        await new Promise(resolve => setTimeout(resolve, 1000));
        const botaoPesquisa = await browser.findElement(By.xpath('/html/body/app-root/app-header3/div/div[2]/div/div/div[2]/div/button'));
        await botaoPesquisa.click();

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Esperar até que a lista de produtos seja carregada
        await browser.wait(until.elementLocated(By.xpath('/html/body/app-root/app-products2/div/div/div/div[2]/div[2]/div/div[2]')), 3000);

        // Encontrar o preço do primeiro produto na lista
        await browser.wait(until.elementLocated(By.xpath('/html/body/app-root/app-products2/div/div/div/div[2]/div[2]/div/div[2]/div[1]/app-product-item/div/div[2]/div[3]/div/div[2]/span[1]')), 3000);
        const precoElemento = await browser.findElement(By.xpath('/html/body/app-root/app-products2/div/div/div/div[2]/div[2]/div/div[2]/div[1]/app-product-item/div/div[2]/div[3]/div/div[2]/span[1]'));
        const preco = await precoElemento.getText();

        return preco;
    } catch (error) {
        console.error('Erro durante o scraping:', error);
        throw error;
    } finally {
        await browser.quit();
    }
}

module.exports = scrapingConcorrenteBarbosa;

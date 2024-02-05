import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

//login_password je sifra za pprobu i sunflower email
let driver;

export async function createDriver(url : string) {
    const chromeOptions = new chrome.Options();
    driver = await new Builder().forBrowser("chrome").setChromeOptions(chromeOptions).build();
    await driver.get(url);
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: 15000 });
    //ovo je implicit wait, ceka 15 secondi da nade element, ako ga ne nade onda test pada
    return driver;
}


export async function createDriver2(url: string) {
    const prefs = {
        'autofill.profile_enabled': false,
    };

    const options = new chrome.Options();
    options.setUserPreferences(prefs);
    options.addArguments("--disable-single-click-autofill");

    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    await driver.get(url);
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: 15000 });

    // This is an implicit wait, waiting for 15 seconds to find an element.
    // If it doesn't find it, the test will fail.
    return driver;
}


export async function quitDriver(driver: WebDriver) {
    await driver.quit();
}

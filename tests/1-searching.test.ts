import { HomePage } from "../core/page-objects/home-page";
import { Builder, By, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver } from "../core/config/driver-setup";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const fileData = JSON.parse(readFileSync(dataFilePath, "utf8"));

let driver: WebDriver;
let homePage: HomePage;

beforeAll(async () => {
    driver = await createDriver(fileData.url.home_page);
    homePage = new HomePage(driver);

},10000);

test("scrappig data from instagram", async () => {
    


},10000);

/*afterAll(async () => {
    await quitDriver(driver);
},30000);*/



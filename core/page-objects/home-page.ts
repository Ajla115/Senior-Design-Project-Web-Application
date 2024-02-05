import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class HomePage extends BasePage {

    //variables for TESTS 2 - 6
    //TEST 5
    private accept_cookies_button = By.id("onetrust-accept-btn-handler");
    private x_button = By.id("wps-overlay-close-button");
    private user_icon = By.className("p-header-actions-item-inner js-cmp-user-menu-toggle");

    //TEST 6
    private login_button = By.className("btn btn-primary p-user-menu-authenticate-button");

    //TEST 2

    private shoes_item = By.className("product-recommendation-link");

    private shoes_size = By.id('attributes-container-size');

    //TEST 3
    private shoes_item2 = By.xpath('/html/body/div[5]/div[4]/div/div/div/div/div[1]/div/div[2]/a');

    //TEST 4

    private women_menu = By.xpath('//li[@class="p-nav-item js-nav-item"]//a[@href="/de/en/women"]');
    private menu_item = By.xpath('//li[@class="p-sub-nav-tier2"]//a[@href="/de/en/women/shoes/sneakers"]');

    //TEST 1
    private search_bar = By.className("p-header-search-inner js-already-under-validation-rules");
    private search_item = By.className("p-header-search-field searchInput js-cmp-search-bar-input");
    private start_search_icon = By.xpath("//div[@class='p-header-actions-search-bar  js-cmp']//div[@class= 'p-header-actions-search p-header-search'] //form[@class='p-header-search-inner js-already-under-validation-rules']//span[@class='p-header-search-icon js-cmp-search-bar-open-search-page']");

    //TEST 7
    private favorites_icon = By.className("p-header-actions-icon p-header-actions-icon--wishlist js-cmp js-wishlist-icon");

    //TEST 9
    private footer_tag= By.id("collapse-1");
    //private return_policy = By.xpath('//a[@href="https://eu.puma.com/de/en/returning-items/HELP_Returning.html"]');
    private return_policy = By.xpath('/html/body/div[5]/footer/div/div/div[2]/div[1]/div/div[2]/div[2]/a[1]');
    
    constructor(driver: WebDriver) {
        super(driver);
    }

    //functions for TESTS 2 - 6
    async acceptAllCookies(){
        await this.findElementAndClick(this.accept_cookies_button);
    }

    async clickOnXButton(){
        //await this.driver.wait(1000);
        await this.findElementAndClick(this.x_button);
    }

    async openMenuWithQuickLinks() {
        await this.findElementAndClick(this.user_icon);
    }

    async clickOnLoginButton(){
        await this.findElementAndClick(this.login_button);
    }

    //TEST 2
    async clickOnAShoeItem(){
        await this.findElementAndClick(this.shoes_item);
    }

    //Test 3
    async clickOnAShoeItem2(){
        await this.findElementAndClick(this.shoes_item2);
    }

    //TEST 4
    async hoverOverWomenMenu(){
        await this.waitForElement(this.women_menu, 40000);
        const womenMenu = await this.findElement(this.women_menu);
        await this.driver.actions().move({ origin: womenMenu }).perform();

    }

    async chooseMenuItem(){
        await this.driver.sleep(1000)
        //await this.driver.manage().setTimeouts({ implicit: 10000 }); //here, it does not work
        //await this.waitForElement(this.women_menu, 40000);
        await this.findElementAndClick(this.menu_item);
    }

    //TEST 1
    async clickOnSearchBar(){
        await this.findElementAndClick(this.search_bar);
    }

    async enterItemToSearchFor(){
        await this.fillInputField(this.search_item, testData.data.search_item);
    }

    async startSearch(){
        //await this.waitForElement(this.start_search_icon, 10000);
        await this.findElementAndClick(this.start_search_icon);
    }

    //TEST 8
    async enterItem2ToSearchFor(){
        await this.fillInputField(this.search_item, testData.data.search_item2);
    }



    //TEST 7
    async clickOnFavorites(){
        await this.findElementAndClick(this.favorites_icon);
    }

    //TEST 9
    async clickOnReturnPolicy(){
        await this.findElement(this.footer_tag);
        await this.findElementAndClick(this.return_policy);
    }

    
        
    


 
   



    

}

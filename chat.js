/*
const puppeteer = require('puppeteer');
let page;
const genreMap = {
    "Mystery/Thriller": "1",
    "Science Fiction":"2",
    "Romance": "3",
    "Philosophy": "4",
    "Horror": "5",
    "Self help":"6",
    "Poetry": "7",
    "Young Adult": "8",
    "Biography":"9",
    "Fantasy":"10"  
} 
*/
/*
const login = async () => {
    const browser = await puppeteer.launch({ headless: false }); // Launch browser in non-headless mode for visualization
    const p = await browser.newPage();
    await p.goto('http://bookmania.42web.io/Login_Page/login_page.php');
    // Wait for the login form to load
    await p.waitForSelector('.uname');
    await p.type('.uname', 'Krishna');

    await p.waitForSelector('.email');
    await p.type('.email', 'Krishna@gmail.com');

    await p.waitForSelector('.password');
    await p.type('.password', 'RadheRadhe');

    // Click on the login button
    await p.click('.buttonclass1');

    page = p;
    console.log("logged in", page);
    return;
}

const searchBooksByGenre = async function (genre) {
    await login()
    try {
        console.log(page);
        if (genreMap.hasOwnProperty(genre)) {


            await page.goto('http://bookmania.42web.io/Book_List/book_list.php?id='+genreMap[genre]);
            // Wait for the login form to load
            await page.waitForSelector('.book-con');
            const articleContent = await page.$$eval('h3', elements => elements.map(element => element.textContent));
            articleContent.shift()
            const res = "<br>"+articleContent.join('<br>')
            return res;
        }
        else {
            console.log("invalid genre");
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { searchBooksByGenre };*/
/*
const call = async () => {
    await login();
    await getBooksByGenre('Biography');
}
call();
*/
/*
const getBooksByGenre = async () => {
    const browser = await puppeteer.launch({ headless: false }); // Launch browser in non-headless mode for visualization
    const p = await browser.newPage();
    
}
//http://bookmania.42web.io/Book_List/book_list.php?id=9&genre=Biography
getBooksByGenre()
*/
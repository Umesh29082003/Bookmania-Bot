const fs = require('fs');
const strdata = fs.readFileSync('./data.json', 'utf8');
const data = JSON.parse(strdata)

const bookNotFound = [
    "Hmm, '<BookName>' doesn't seem to be in our database. Perhaps it's a rare find! Is there another book you're interested in, or can I assist you with anything else?",
    "It appears that '<BookName>' isn't among our collection at the moment. If there's another title you're curious about, just let me know, and I'll do my best to assist you!",
    "Sorry, no luck finding '<BookName>' in our records. It sounds intriguing though! If you have any other books in mind or need recommendations, feel free to ask",
    "No matches found for '<BookName>'. Anything else you're interested in?",
    "No results for '<BookName>'. Want to try another title?",
    "Looks like '<BookName>' is playing hide and seek in our database! Want to try another title, or should we send out a search party?",
    "Apologies, but it seems '<BookName>' is taking a break from our shelves. Is there another title I can assist you with?",
    "Unfortunately, '<BookName>' is currently on vacation from our database. Would you like recommendations for a similar read?",
    "I regret to inform you that '<BookName>' seems to be out for a stroll outside our library. Can I assist you with another book choice?"
]

const authorNotFound = [
    "Sorry, no results found for '<AuthorName>'. Anything else you're interested in?",
    "I'm sorry, but it seems we don't have any books by '<AuthorName>' in our collection",
    "Unfortunately, we don't have any works by '<AuthorName>' in our database. Perhaps you'd be interested in exploring the works of other talented writers?",
    "I regret to inform you that we don't currently have any books by ' < AuthorName > '. Is there anything else I can help you with today?",
    "Couldn't find '<AuthorName>' in our database. Another author perhaps?",
    "Looks like we're missing '<AuthorName>' in our library. Any other authors you like?",
    "No books by '<AuthorName>' found. What else can I do for you?",
    "Well, it seems '<AuthorName>' is on an extended coffee break from our library. Maybe they're busy penning their next bestseller"
]

const genreNotFound = [
    "Sorry, no results found for '<GenreName>'. Anything else you're interested in?",
    "Exploring the vast world of '<GenreName>' is always an adventure! Unfortunately, it seems we haven't charted that territory in our database yet. Care to explore another genre?",
    "Ah, '<GenreName>'! A genre filled with endless possibilities and captivating stories. However, it appears we're still expanding our collection in that area. Can I interest you in another genre?",
    "The realm of '<GenreName>' beckons with its promise of adventure and mystery, yet it remains uncharted in our library's collection. Shall we set sail for another genre, or is there something else I can assist you with?",
    "Exploring '<GenreName>'? Unfortunately, we haven't stocked it yet. How about another genre?",
    "Delving into '<GenreName>' is exciting, but we don't have it. Need another genre?",
    "Ah, the allure of '<GenreName>'! Sadly, it's not here. Can I suggest something else?"
]


const genreMap = {
    "Mystery/Thriller": "1",
    "Science fiction":"2",
    "Romance": "3",
    "Philosophy": "4",
    "Horror": "5",
    "Self help":"6",
    "Poetry": "7",
    "Young Adult": "8",
    "Biography":"9",
    "Fantasy":"10"  
}
let contextBook


const searchBooksByGenre = async function (genre) {
    try {
        const category = genreMap[genre];
        const books = data.filter(book => book.category.toString() === category);
        if (books) {
            return {
                books: books.map(book => book.book_name).slice(10).join('<br> &nbsp &nbsp'),
                found:true
            }
        }
        else {
            const randomIndex = Math.floor(Math.random() * genreNotFound.length);
            return {
                regret: genreNotFound[randomIndex],
                found: false
            }
        }
    }
    catch (error) { 

    }
}

const searchBooksByAuthor =  async function (author) {
    try {   
        const booksByAuthor = data.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
        if (booksByAuthor) {
            const authorname = booksByAuthor[0].author;
            return {
                books: booksByAuthor.map(book => book.book_name).slice(0, 10).join('<br> &nbsp &nbsp'),
                authorname: authorname,
                found: true
            }
        }
        else {
            const randomIndex = Math.floor(Math.random() * authorNotFound.length);
            return {
                regret: authorNotFound[randomIndex],
                found: false
            }
        }
    }
    catch (error) { 

    }
}

const giveBookDescription =  async function (bookname) {
    try {
        const result = data.find(book => book.book_name.toLowerCase().includes(bookname.toLowerCase()));
        if (result) {
            contextBook = result
            return { bookname: result.book_name, description: result.description, found: true }
        }
        else {
            const randomIndex = Math.floor(Math.random() * bookNotFound.length);
            return {
                regret: bookNotFound[randomIndex],
                found: false
            }
        }
    }
    catch (error) {
        
    }
}

const findAuthor = async () => {
    try {
        return {bookname: contextBook.book_name, authorname: contextBook.author}
    }
    catch (error) {
        
    }
    
}


const findGenre = async () => {
    try {
        const category = contextBook.category
        const genre = Object.keys(genreMap).find(key => genreMap[key] === category.toString());
        return {bookname: contextBook.book_name, genre: genre}
    }
    catch (error) {
        console.log(error)
    }
    
}


const findmoreBooksInThisGenre = async () => { 
    try {
        const category = contextBook.category
        const genre = Object.keys(genreMap).find(key => genreMap[key] === category.toString());
        return genre;
    }
    catch (error) {
        console.log(error)
    }
}


module.exports={searchBooksByGenre,searchBooksByAuthor,giveBookDescription, findAuthor, findGenre, findmoreBooksInThisGenre}
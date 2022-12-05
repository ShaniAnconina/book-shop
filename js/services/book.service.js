'use strict'

const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 5

var gPageIdx = 0
var gBooks
var gFilterBy = { maxPrice: 100, minRate: 0, searchBox: '' }

_createBooks()

function getBooks() {
    const books = gBooks.filter(book => 
        book.price <= gFilterBy.maxPrice
        && book.rate >= gFilterBy.minRate
        && book.name.startsWith(gFilterBy.searchBox))

    const startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function nextPage() {
    if ((gPageIdx + 1) * PAGE_SIZE <= gBooks.length) {
        gPageIdx++

    }
}

function previousPage() {
    gPageIdx--
    if (gPageIdx === -1) gPageIdx = 0
}

function setFilterBy(filterBy = {}) {
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if (filterBy.searchBox !== undefined) gFilterBy.searchBox = filterBy.searchBox
    return gFilterBy

}

function deleteBook(bookId) {
    const idx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(idx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function addBook(name, img) {
    var book = _createBook(name, img)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function getBookById(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    return book
}

function changeRate(diff, book) {
    if ((book.rate === 0 && diff === -1) || (book.rate === 10 && diff === 1)) return
    book.rate += diff
    _saveBooksToStorage()
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        gBooks = [
            _createBook('Harry Potter', `img/harry.jpg`),
            _createBook('50 shades of gray', `img/shades.jpg`),
            _createBook('Who Moved My Cheese?', `img/cheese.png`),
        ]
        _saveBooksToStorage()
    }
    gBooks = books
}

function _createBook(name, img = `img/book.jpg`) {
    return {
        id: `b${getRandomIntInclusive(100, 999)}`,
        name: name,
        price: getRandomIntInclusive(30, 100),
        img,
        rate: 0
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}
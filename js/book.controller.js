'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
}

function renderBooks() {
    const books = getBooks()
    const strHeadHTML = `<tr>
    <td>Id</td>
    <td>Title</td>
    <td>Image</td>
    <td>Price</td>
    <td>Rate</td>
    <td>Actions</td>
    </tr>`
    const strBodyHTML = books.map(book => `
    <tr>
        <td>${book.id}</td>
        <td>${book.name}</td>
        <td><img src="${book.img}" alt="" class="table-img"></td>
        <td>$${book.price}</td>
        <td>${book.rate}</td>
        <td>
            <button onclick="onReadBook('${book.id}')">Read</button>
            <button onclick="onUpdateBook('${book.id}')">Update</button>
            <button onclick="onDeleteBook('${book.id}')">Delete</button>
        </td>
    </tr>
    `)
    document.querySelector('thead').innerHTML = strHeadHTML
    document.querySelector('tbody').innerHTML = strBodyHTML.join('')
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    const newPrice = +prompt('What is the new price?', book.price)
    if (newPrice && book.price !== newPrice) {
        updateBook(bookId, newPrice)
        renderBooks()
    }
}

function onAddBook() {
    const name = prompt('Whice book?')
    const img = prompt('Type the image file name (including format)', `img/book.jpg`)
    if (name) {
        addBook(name, img)
        renderBooks()
    }
}

function onReadBook(bookId) {
    const book = getBookById(bookId)
    const el = document.querySelector('.modal')
    el.classList.add('open')
    el.querySelector('.name').innerText = book.name
    el.querySelector('.price span').innerText = book.price
    el.querySelector('img').src = book.img
    renderRate(book)
    renderBooks()
}

function renderRate(book) {
    const strHTML = `<button class="rate-btn" onclick="onChangeRate(-1, '${book.id}')">-</button>
    <span  class="rate-num">${book.rate}</span>
    <button class="rate-btn" onclick="onChangeRate(1, '${book.id}')">+</button>`
    document.querySelector('.rate').innerHTML = strHTML
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        searchBox: queryStringParams.get('searchBox') || '',
        maxPrice: queryStringParams.get('maxPrice') || 100,
        minRate: queryStringParams.get('minRate') || 0
    }

    if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.searchBox) return

    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    document.querySelector('.filter-rate-range').value = filterBy.minRate
    document.querySelector('.search-box').value = filterBy.searchBox
    setFilterBy(filterBy)
}

function onChangeRate(diff, bookId) {
    const book = getBookById(bookId)
    changeRate(diff, book)
    document.querySelector('.rate span').innerText = book.rate
    renderBooks()
}

function onSetFilterBy(filterBy) {
    filterBy = setFilterBy(filterBy)
    renderBooks()

    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}?searchBox=${filterBy.searchBox}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onNextPage() {
    nextPage()
    renderBooks()
}

function onPreviousPage() {
    previousPage()
    renderBooks()
}
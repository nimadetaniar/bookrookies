// ctrl + ` => memunculkan terminal

const express = require('express')
const app = express();
const port = 3000;

//import file book yang berisikan fungsi2 yang diexport
const book = require('./model/book')
const renter = require('./model/renter')

// membuat express dapat menerima request body berupa JSON
app.use(express.json())

// curl -X GET http://localhost:3000/
app.get("/", (req, res) => {
    res.send("Hello World!");
});


// curl -X GET http://localhost:3000/books
// jika pakai postman gunakan http://localhost:3000/books saja
app.get("/books", async (req, res) => {
    //mengambil query yang dikirim
    const { searchField, search } = req.query

    //mengambil data dengan fungsi fetchData
    const books = await book.fetchData(searchField, search);

    res.json(books);
})

/** 
  Request Parameters
  ada 2 jenis:
  1. Path parameters ditandai dengan simbol :nama_param
  2. Query parameters ditandai dengan simbol ?nama_param=value
*/
// curl -X GET http://localhost:3000/books/1


app.get("/books/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    const _book = await book.fetchOneData(id);

    //jika buku tidak ada
    if (_book === null) {
        // HTTP Status bisa baca di https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
        res.status(404)
        res.json('book not found')
        return
    }

    res.json(_book);
})

// curl -X POST http://localhost:3000/books --header "Content-Type: application/json" --data '{"title": "test", "author": "test"}'
app.post("/books", async (req, res) => {
    /** 
      Request body bisa diakses dari req.body
      request body bisa bermacam2 jenis, bisa json, bisa form, bisa xml, bisa plain text.
      Di ekspress perlu menginisiasi support tambahan untuk masing-masing jenis request body, seperti diatas
    */
    try {
        const books = req.body

        for (let i = 0; i < books.length; i++) {
            const title = books[i].title
            if (!title || title === "") {
                res.status(422).send("title must be filled!")
                return
            }
            const author = books[i].author
            if (!author || author === "") {
                res.status(422).send("author must be filled!")
                return
            }
        }

        const _books = await book.insertData(books)
        res.status(201)
        res.json(_books);
    } catch (error) {
        res.status(422)
        res.json(`buku dengan id tersebut sudah ada`)
    }
})

// Untuk mencoba melihat response api ketika memangngil route "/"
// curl -X PUT http://localhost:3000/books/1 --header "Content-Type: application/json" --data '{"title": "The book of lost things, again"}'
app.put("/books/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const { title, author } = req.body
    try {

        //pengecekan title dan author 
        if (title === "") {
            res.status(422)
            res.json("title can't be empty if updated!")
            return
        }

        if (author === "") {
            res.status(422)
            res.json("author can't be empty if updated!")
            return
        }

        // mencari buku terlebih dahulu yang mau diupdate

        const thatBook = await book.fetchOneData(id)

        //cek jika bukunya tidak ada, memakai array indeks pertama karena hasil fetch data berupa to array
        if (!thatBook) {
            res.status(404)
            res.json("Book not found!")
            return
        }

        // di validasi dulu apakah author diberikan di req.body, kalau tidak, tidak perlu di update biar tidak null hasilnya
        if (author) {
            thatBook.author = author
        }

        // title di validasi dulu apakah title diberikan di req.body, kalau tidak, tidak perlu di update biar tidak null hasilnya
        if (title) {
            thatBook.title = title
        }

        await book.updateData(thatBook)

        res.json(thatBook);
    } catch (error) {
        res.status(422)
        console.log('error', error)
        res.json('tidak dapat update buku')
    }

})

// Untuk mencoba melihat response api ketika memangngil route "/"
// curl -X DELETE http://localhost:3000/books/1
app.delete("/books/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        // mencari buku terlebih dahulu yang mau diupdate
        const thatBook = await book.fetchOneData(id)

        //cek jika bukunya tidak ada, memakai array indeks pertama karena hasil fetch data berupa to array
        if (!thatBook) {
            res.status(404)
            res.json("Book not found!")
            return
        }

        await book.deleteData(id)
        res.json(book);
    } catch (error) {
        res.status(422)
        res.json('tidak dapat delete buku')
    }

})

app.put("/renter/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const books = req.body
    const renterBook = (await renter.fetchOneData(id)).books
    let _books = renterBook

    try {
        for (let i = 0; i < books.length; i++) {
            let _book = await book.fetchOneData(books[i].id);

            //jika buku tidak ada
            if (_book.length === 0) {
                // HTTP Status bisa baca di https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
                res.status(404)
                res.json('book not found')
                return
            }
            _books.push(_book)
        }

        
        const _renter = await renter.updateDataRenterBooks(id, _books)

        res.json(_renter);
    } catch (error) {
        res.status(422)
        console.log('error', error)
        res.json(`buku tidak`)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
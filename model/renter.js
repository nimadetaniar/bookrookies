const mongo = require('../db');

//fungsi memasukkan data ke table books
async function insertData(books) {
    try {
        const db = await mongo.connect();
        console.log("Inserting data...");

        //mengisi data book ke table books
        await db.collection('renter').insertMany(renter);
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
    }
}

//fungsi mengambil data dari table books
async function fetchData(searchField, search) {
    try {
        const db = await mongo.connect();

        if (searchField && search) {
            return await db
                .collection("renter")
                //penggunaan [] pada key di find, untuk mengekstrasi value dari variabel untuk dijadikan key
                .find({ [searchField]: new RegExp(search, 'i') }, { projection: {} })
                .toArray();
        } else {
            return await db
                .collection("renter")
                .find({}, { projection: {} })
                .toArray();
        }
        //mengambil seluruh data book dari table books
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
    }
}

//fungsi mengambil 1 data dari table books
async function fetchOneData(id) {
    try {
        const db = await mongo.connect();

        return await db
            .collection("renter")
            .findOne({ id: id }, { projection: {} })

    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
    }
}

//fungsi mengupdate data di table renter pinjam buku
async function updateDataRenterBooks(idRenter, books) {
    try {
        const db = await mongo.connect();
        console.log("Update data...");

        await db.collection("renter").updateOne(
            { id: idRenter },
            {
                $set: {
                    books: books,
                }
            },
            {
                upsert: true
            }
        )


        return "data updated"
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
    }
}


//mengekspor fungsi-fungsi agar dapat dipakai di file lain yang mengimport book
module.exports = { insertData, fetchData, fetchOneData, deleteData, updateDataRenterBooks }
const mongo = require('../db');

// untuk menambahkan data atau seeding
async function seedData() {
    try {
        const db = await mongo.connect();
        console.log("Inserting data...");

        //fill data
        await db
            .collection("books")
            .insertMany([
                {
                    id: 1,
                    title: "The book of lost things",
                    author: "Nurfitra Pujo Santiko"
                },
                {
                    id: 2,
                    title: "Angels & Demons",
                    author: "Nurfitra Pujo Santiko"
                },
                {
                    id: 3,
                    title: "The Great Ruler",
                    author: "Nurfitra Pujo Santiko"
                },
                {
                    id: 4,
                    title: "Emperor Domination",
                    author: "Nurfitra Pujo Santiko"
                },
            ]);
        await db
            .collection("renter")
            .insertMany([{
                "id": 3,
                "name": "Michael",
                "birth_date": {
                  "$date": "1992-07-15T00:00:00.000Z"
                },
                "address": "Surabaya"
              },
              {
                "id": 2,
                "name": "Monica",
                "birth_date": {
                  "$date": "2001-01-30T00:00:00.000Z"
                },
                "address": "Jakarta"
              }
            ]);

        //close koneksi db 
        await mongo.disconnect()
    } catch (error) {
        console.log(error);
    }
}

seedData()
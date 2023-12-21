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

        //close koneksi db 
        await mongo.disconnect()
    } catch (error) {
        console.log(error);
    }
}

seedData()
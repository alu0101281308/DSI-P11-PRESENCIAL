import 'mocha';
import {expect} from 'chai';
import { Cursor, MongoClient } from 'mongodb';
import {ArticlesInterface} from '../src/articulos'

const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'dsi-assessment';
let connection: MongoClient;

let example : ArticlesInterface = {
    description: "hola mundo test",
    stock: 10,
    pvp: 2,
    obsolete: false,
    barcode: '123456A'
} 


describe('ejercicio practica', () => {

    it('Se agrego un articulo con barcode 123456A a la base de datos.', () => {
        MongoClient.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((client) => {
            connection = client;
            const db = client.db(dbName);
            return db.collection<ArticlesInterface>('articles').insertOne({
                description: "hola mundo test",
                stock: 10,
                pvp: 2,
                obsolete: false,
                barcode: '123456A'
              });
        }).then((result) => {
            expect(result.insertedCount).to.be.equal(1);
            connection.close()
        }).catch((error) => {
            console.log("Error al añadir el articulo : " + error);
            connection.close()
        });
    });

    it('Se busco el articulo con barcode 123456A en la base de datos y fue encontrado.', () => {
            MongoClient.connect(dbURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }).then((client) => {
                connection = client;
                const db = client.db(dbName);
    
                return db.collection<ArticlesInterface>('articles').findOne({
                    barcode: '123456A'
                });
            }).then((result) => {
                expect(result).to.be.equal(example);
                connection.close()
            }).catch((error) => {
                error;
                connection.close()
            });
    });

    it('Se busco el articulo con barcode 123456A en la base de datos y fue modificado.', () => {
        MongoClient.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((client) => {
            const db = client.db(dbName);
            connection = client;
            return db.collection<ArticlesInterface>('articles').updateOne({
                barcode: "123456A"
            },
                {
                    $set: {
                        description: "Adios mundo",
                        stock: 10,
                        pvp: 2,
                        obsolete: false,
                        barcode: '123456A'
                    },
                });
        }).then((result) => {
            expect(result.modifiedCount).to.be.equal(1);
            connection.close()
        }).catch((error) => {
            console.log("Error al modificar el articulo : " + error);
            connection.close()
        });
    });

    it('Se busco el articulo con barcode 123456A en la base de datos y fue eliminado.', () => {
        MongoClient.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((client) => {
            const db = client.db(dbName);
            connection = client;
            return db.collection<ArticlesInterface>('articles').deleteOne({
                barcode: "123456A"
            });
        }).then((result) => {
            if (result.deletedCount) {          
                expect(result.deletedCount).to.be.equal(1);
                connection.close()
            } else {
                console.log("Error al eliminar el articulo, posiblemente el codigo de barras este erroneo o no exista.");
                connection.close();
            }
        }).catch((error) => {
            console.log("Error al eliminar el articulo : " + error);
            connection.close()
        });
    });

});
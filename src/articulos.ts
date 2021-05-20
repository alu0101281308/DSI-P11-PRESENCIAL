import { Cursor, MongoClient } from 'mongodb';
import yargs = require('yargs');
import chalk = require('chalk');

const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'dsi-assessment';
let connection: MongoClient;

export interface ArticlesInterface {
    description: string,
    stock: number,
    pvp: number,
    obsolete: boolean,
    barcode: string,
}

function addArticle(description: string, stock: number, pvp: number, obsolete: boolean, barcode: string) {
    MongoClient.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((client) => {
        connection = client;
        const db = client.db(dbName);
        return db.collection<ArticlesInterface>('articles').insertOne({
            description: description,
            stock: stock,
            pvp: pvp,
            obsolete: obsolete,
            barcode: barcode
          });
    }).then((result) => {
        console.log(chalk.green(result.insertedCount + ' articulo agregado correctamente'));
        connection.close();
    }).catch((error) => {
        console.log(chalk.red("Error al añadir el articulo : " + error));
    });
}

function findArticle(description: string, barcode: string) {
    if (barcode != '') {
        MongoClient.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((client) => {
            connection = client;
            const db = client.db(dbName);

            return db.collection<ArticlesInterface>('articles').findOne({
                barcode: barcode
            });
        }).then((result) => {
            console.log(chalk.green("Articulo encontrado : "))
            console.log(result);
            connection.close();
        }).catch((error) => {
            console.log(chalk.red("Error al buscar el articulo : " + error));
        });
    } else {
        MongoClient.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((client) => {
            connection = client;
            const db = client.db(dbName);

            return db.collection<ArticlesInterface>('articles').find({
                description: description
            }).toArray();
        }).then((result) => {
            console.log(chalk.green("Articulos encontrados : "))
            console.log(result);
            connection.close();
        }).catch((error) => {
            console.log(chalk.red("Error al buscar el articulo : " + error));
        });
    }
}

function updateArticle(description: string, stock: number, pvp: number, obsolete: boolean, barcode: string) {
    MongoClient.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((client) => {
        const db = client.db(dbName);
        connection = client;
        return db.collection<ArticlesInterface>('articles').updateOne({
            barcode: barcode
        },
            {
                $set: {
                    description: description,
                    stock: stock,
                    pvp: pvp,
                    obsolete: obsolete,
                    barcode: barcode
                },
            });
    }).then((result) => {
        console.log(chalk.green(result.modifiedCount + ' articulo modificado correctamente'));
        connection.close();
    }).catch((error) => {
        console.log(chalk.red("Error al modificar el articulo : " + error));
    });
}

function deleteArticle(barcode: string) {
    MongoClient.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((client) => {
        const db = client.db(dbName);
        connection = client;
        return db.collection<ArticlesInterface>('articles').deleteOne({
            barcode: barcode
        });
    }).then((result) => {
        if (result.deletedCount) {          
            console.log(chalk.green(result.deletedCount + " Articulo eliminado correctamente "))
            connection.close();
        } else {
            console.log(chalk.red("Error al eliminar el articulo, posiblemente el codigo de barras este erroneo o no exista."));
            connection.close();
        }
    }).catch((error) => {
        console.log(chalk.red("Error al eliminar el articulo : " + error));
    });
}

yargs.command({
    command: 'add',
    describe: 'Agregar articulo a la DB.',
    builder: {  
      description: {
        describe: 'Descripcion del articulo',
        demandOption: true,
        type: 'string',
      },
      stock: {
        describe: 'Cantidad disponible del articulo',
        demandOption: true,
        type: 'number',
      },
      pvp: {
        describe: 'Precio al publico del articulo',
        demandOption: true,
        type: 'number',
      },
      obsolete: {
        describe: 'Define si el articulo esta obsoleto o no ( true o false )',
        demandOption: true,
        type: 'boolean',
      },
      barcode: {
        describe: 'Codigo de barra que identifica el articulo',
        demandOption: true,
        type: 'string',
      }
    },
    handler(argv) {
      if (typeof argv.description === 'string' && typeof argv.stock === 'number' && typeof argv.pvp === 'number' && typeof argv.obsolete === 'boolean' && typeof argv.barcode === 'string') { 
        addArticle(argv.description, argv.stock, argv.pvp, argv.obsolete, argv.barcode);
      }
    },
});

yargs.command({
    command: 'update',
    describe: 'Modifica un articulo en la DB.',
    builder: {  
      description: {
        describe: 'Descripcion del articulo',
        demandOption: true,
        type: 'string',
      },
      stock: {
        describe: 'Cantidad disponible del articulo',
        demandOption: true,
        type: 'number',
      },
      pvp: {
        describe: 'Precio al publico del articulo',
        demandOption: true,
        type: 'number',
      },
      obsolete: {
        describe: 'Define si el articulo esta obsoleto o no ( true o false )',
        demandOption: true,
        type: 'boolean',
      },
      barcode: {
        describe: 'Codigo de barra que identifica el articulo, se usa este campo para buscar y actualizar el articulo.',
        demandOption: true,
        type: 'string',
      }
    },
    handler(argv) {
      if (typeof argv.description === 'string' && typeof argv.stock === 'number' && typeof argv.pvp === 'number' && typeof argv.obsolete === 'boolean' && typeof argv.barcode === 'string') { 
        updateArticle(argv.description, argv.stock, argv.pvp, argv.obsolete, argv.barcode);
      }
    },
});

yargs.command({
    command: 'find',
    describe: 'Busca un articulo a la DB.',
    builder: {  
      description: {
        describe: 'Descripcion del articulo',
        demandOption: false,
        type: 'string',
      },

      barcode: {
        describe: 'Codigo de barra que identifica el articulo',
        demandOption: false,
        type: 'string',
      }
    },
    handler(argv) {
        if (argv.description && typeof argv.description === 'string') {
            findArticle(argv.description, '');
        } else if (argv.barcode && typeof argv.barcode === 'string') {
            findArticle('', argv.barcode);
        } else {
            console.log("Para buscar un articulo se debe especificar el barcode connection --barcode o una description connection --description")
        }
    },
});

yargs.command({
    command: 'delete',
    describe: 'Busca un articulo a la DB.',
    builder: {  
      barcode: {
        describe: 'Codigo de barra que identifica el articulo',
        demandOption: true,
        type: 'string',
      }
    },
    handler(argv) {
      if (typeof argv.barcode === 'string') { 
        deleteArticle(argv.barcode);
      }
    },
});

yargs.parse();
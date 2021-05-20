![Logo](img/logo.jpg)

#### Ingeniería Informática
#### Desarrollo de sistemas informáticos
##### Elvis Nogueiras alu0101281308@ull.edu.es

## Ejercicio presencial

El ejercicio puede probarse mediante linea de comandos o bien ejecutando las pruebas con `npm run test`.

Agregar :
~~~~ typescript
$node dist/articulos.js add --description="hola mundo" --stock=20 --pvp=1 --obsolete=true --barcode=123456
~~~~
Buscar por codigo de barras:
~~~~ typescript
$node dist/articulos.js find --barcode=123456
~~~~
Buscar por descripcion:
~~~~ typescript
$node dist/articulos.js find --description="hola mundo"
~~~~
Eliminar:
~~~~ typescript
$node dist/articulos.js delete --barcode=123456
~~~~
Modificar :
~~~~ typescript
$node dist/articulos.js update --description="adios mundo" --stock=20 --pvp=1 --obsolete=true --barcode=123456
~~~~


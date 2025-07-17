require('dotenv').config();
const express = require('express');
const path = require('path');
const { title } = require('process');
const app = express();
const port = process.env.PORT;


// Definindo o diretório de views explicitamente
app.set('views', path.join(__dirname, 'views'));
// Utilizando o EJS como view engine
app.set('view engine', 'ejs');
// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
// Middleware para servir arquivos estáticos do diretório 'node_modules'
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));


app.get ('/', (req, res) => {
  res.render('index', { title: 'Home', h1: 'Bem-vindo ao Guia de Perguntas' });
});

// Rota para renderizar uma página de exemplo
app.get('/page-example', (req, res) => {
  res.render('page-example');
});


// Rota para renderizar uma página EJS
app.get('/teste-ejs', (req, res) => {
  const nome = 'Teste EJS';
  const lang = 'pt-BR';
  const title = 'Pagina Teste EJS';
  const simulandoErro = true;
  const nomes = [
    { nome: 'Sol', sobrenome: 'Requiao' },
    { nome: 'Thaianna', sobrenome: 'Bastos' },
    { nome: 'Hadrion', sobrenome: 'Falcao' },
    { nome: 'Yang', sobrenome: 'Argolo' }
  ];
    res.render('teste-ejs' , { nome, lang, title, simulandoErro, nomes });
});




// Rodando o servidor
app.listen(port, () => {
  console.log(`A aplicação está rodando em http://localhost:${port}`);
});
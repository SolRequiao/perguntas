require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const conn = require('./database/database.js');
const Pergunta = require('./database/Pergunta.js');
const port = process.env.PORT;

// Conectando ao banco de dados
conn.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });


// Definindo o diretório de views explicitamente
app.set('views', path.join(__dirname, 'views'));
// Utilizando o EJS como view engine
app.set('view engine', 'ejs');
// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
// Middleware para servir arquivos estáticos do diretório 'node_modules'
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

// Middleware para analisar o corpo das requisições
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());


app.get ('/', (req, res) => {
  Pergunta.findAll({
    order: [['id', 'DESC']] // Ordena as perguntas por ID em ordem decrescente
  })
    .then(perguntas => {
      res.render('index', { title: 'Home', perguntas: perguntas });
    })
    .catch(err => {
      console.error('Erro ao buscar perguntas:', err);
      res.status(500).send('Erro ao buscar perguntas');
    });
});

app.get('/perguntar', (req, res) => {  
  res.render('perguntar', { title: 'Perguntas' });
});

app.post('/salvar-pergunta', (req, res) => {
  const { titulo, descricao } = req.body;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  })
  .then(() => {
    res.redirect('/');
  })
  .catch(err => {
    console.error('Erro ao salvar a pergunta:', err);
    res.status(500).send('Erro ao salvar a pergunta');
  });
});

app.get('/responder/:id', (req, res) => {
  const id = req.params.id;
  Pergunta.findByPk(id)
    .then(pergunta => {
      if (pergunta) {
        res.render('responder', { pergunta: pergunta, title: 'Responder' });
      } else {
        res.status(404).send('Pergunta não encontrada');
      }
    })
    .catch(err => {
      console.error('Erro ao buscar a pergunta:', err);
      res.status(500).send('Erro ao buscar a pergunta');
    });
});

app.get('/form-resposta', (req, res) => {
  res.render('form-resposta', { title: 'Formulário de Resposta'});
});

// Rota para renderizar uma página de testes do EJS
app.get('/teste/teste-ejs', (req, res) => {
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
    res.render('teste/teste-ejs' , {nome, lang, title, simulandoErro, nomes });
});


// Rodando o servidor
app.listen(port, () => {
  console.log(`A aplicação está rodando em http://localhost:${port}`);
});
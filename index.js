require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const conn = require('./database/database.js');
const Pergunta = require('./database/Pergunta.js');
const Resposta = require('./database/Resposta.js');
const port = process.env.PORT;

// Conectando ao banco de dados
conn.authenticate()
  .then(() => {
    console.log('Conexão com o banco OK');
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


app.get('/', (req, res) => {
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
  res.render('perguntar', { title: 'Perguntas', msgError: req.query.msgError });
});

app.post('/salvar-pergunta', (req, res) => {
  const { titulo, descricao } = req.body;
  if (!titulo || !descricao) {
    return res.redirect(`/perguntar?msgError=${encodeURIComponent('Para enviar este formulário é obrigatório preencher os campos Título e Descrição.')}`); // Redireciona com mensagem de erro
  }
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

app.get('/pergunta/:id', (req, res) => {
  const id = req.params.id;
  Pergunta.findOne({ where: { id: id } })
    .then(pergunta => {
      if (pergunta) {

        Resposta.findAll({
          where: { perguntaId: pergunta.id },
          order: [['id', 'DESC']]
        }).then(respostas => {
          res.render('pergunta', { pergunta: pergunta, respostas: respostas, title: 'Pergunta' });
        }).catch(err => {
          console.error('Erro ao buscar respostas:', err);
          res.status(500).send('Erro ao buscar respostas');
        });

      } else {
        res.redirect('/');
      }
    })
    .catch(err => {
      console.error('Erro ao buscar a pergunta:', err);
      res.status(500).send('Erro ao buscar a pergunta');
    });
});

app.get('/responder/:id', (req, res) => {
  const perguntaId = req.params.id;

  res.render('responder', { title: 'Formulário de Resposta', pergunta: { id: perguntaId }, msgError: req.query.msgError });
});

app.post('/salvar-resposta', (req, res) => {
  const { corpo, perguntaId } = req.body;
  if (!corpo || !perguntaId) {
    return res.redirect(`/responder/${perguntaId}?msgError=${encodeURIComponent('Para enviar este formulário é obrigatório preencher o campo Resposta.')}`);
  }
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect(`/pergunta/${perguntaId}`);
  }).catch(err => {
    console.error('Erro ao salvar a resposta:', err);
    res.status(500).send('Erro ao salvar a resposta');
  });
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
  res.render('teste/teste-ejs', { nome, lang, title, simulandoErro, nomes });
});


// Rodando o servidor
app.listen(port, () => {
  console.log(`A aplicação está rodando em http://localhost:${port}`);
});
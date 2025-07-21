const Selquelize = require('sequelize');
const conn = require('./database.js');

const Pergunta = conn.define('pergunta', {
  titulo: {
    type: Selquelize.STRING,
    allowNull: false
  },
  descricao: {
    type: Selquelize.TEXT,
    allowNull: false
  }
});

Pergunta.sync({ force: false })
  .then(() => {
    console.log('Tabela Pergunta OK');
  })
  .catch(err => {
    console.error('Erro ao criar a tabela Pergunta:', err);
  });


module.exports = Pergunta;
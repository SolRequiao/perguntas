const Selquelize = require('sequelize');
const conn = require('./database.js');

const Resposta = conn.define('resposta', {
    corpo: {
        type: Selquelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: Selquelize.INTEGER,
        allowNull: false,
        references: {
            model: 'pergunta',
            key: 'id'
        }
    }
});

Resposta.sync({ force: false })
    .then(() => {
        console.log('Tabela Resposta OK');
    }).catch(err => {
        console.error('Erro ao criar a tabela Resposta:', err);
    });

module.exports = Resposta;
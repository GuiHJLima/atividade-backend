const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 4000;

app.get(express.json());

//configuração do banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'usuariosdolima',
    password: 'ds564',
    port: 7007,
});

//função para calcular a idade
function calcularIdade(dataNascimento) {
    const dataAtual = new Date();
    let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
    return idade;
}

//função para calcular o signo
function calcularSigno(mes, dia) {
    if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
        return 'Aquário';
    } else if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) {
        return 'Peixes';
    } else if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
        return 'Áries';
    } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
        return 'Touro';
    } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
        return 'Gêmeos';
    } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
        return 'Câncer';
    } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
        return 'Leão';
    } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
        return 'Virgem';
    } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
        return 'Libra';
    } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
        return 'Escorpião';
    } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
        return 'Sagitário';
    } else {
        return 'Capricórnio'; // Caso padrão para os demais dias de dezembro e janeiro
    }
}


//criar uma rota que obtem todos os usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios');
        res.json({
            total: resultado.rowCount,
            usuarios: resultado.rows
        });
    } catch (error) {
        console.error("Erro ao tentar obter todos os usuarios");
        res.status(500).send({ mensagem: "Erro ao tentar obter todos os usuarios" });
    }
});

//criar uma rota que obtem um usuario pelo id
app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        res.json({
            usuario: resultado.rows[0]
        });
    } catch (error) {
        console.error("Erro ao tentar obter um usuario pelo id");
        res.status(500).send({ mensagem: "Erro ao tentar obter um usuario pelo id" });
    }
});

//criar uma rota que adcione um novo usuario
app.post('/usuarios', async (req, res) => {
    try {
        const { name, surname, date_of_birth, email, sex, status} = req.body;

        const dataNascimento = new Date(date_of_birth);
        const idade = calcularIdade(dataNascimento);
        const signo = calcularSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());

        await pool.query('INSERT INTO usuarios (name, surname, date_of_birth, email, age, sing, sex, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);', [name, surname, dataNascimento, email, idade, signo, sex, status]);
        res.status(201).send({ mensagem: "Usuario adicionado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar adicionar um novo usuario", error);
        res.status(500).send({ mensagem: "Erro ao tentar adicionar um novo usuario" });
    }
});

//criar uma rota que atualize um usuario pelo id
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, surname, date_of_birth, email, sex, status } = req.body;
        
        const dataNascimento = new Date(date_of_birth);
        const idade = calcularIdade(dataNascimento);
        const signo = calcularSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());

        await pool.query('UPDATE usuarios SET name = $1, surname = $2, date_of_birth = $3, email = $4, age = $5, sing = $6, sex = $7, status = $8 WHERE id = $9;', [name, surname, dataNascimento, email, idade, signo, sex, status, id]);
        res.status(200).send({ mensagem: "Usuario atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar atualizar um usuario pelo id", error);
        res.status(500).send({ mensagem: "Erro ao tentar atualizar um usuario pelo id" });
    }
});

//criar uma rota que delete um usuario pelo id
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM usuarios WHERE id = $1;', [id]);
        res.status(200).send({ mensagem: "Usuario deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar deletar um usuario pelo id", error);
        res.status(500).send({ mensagem: "Erro ao tentar deletar um usuario pelo id" });
    }
});


//inicializar o servidor
app.listen(port, () => {
    console.log(`Servidor esta rodando em http://localhost:${port}`);
});
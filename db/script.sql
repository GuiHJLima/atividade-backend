-- Criação do banco de dados
CREATE DATABASE usuariosdolima;

-- Conecta no banco de dados
\c usuariosdolima;

-- Criação da tabela '
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT NOT NULL,
    sing VARCHAR(100) NOT NULL,
    sex VARCHAR(1) NOT NULL,
    status BOOLEAN NOT NULL
);

-- Inserção de dados
INSERT INTO usuarios (name, surname, date_of_birth, email, age, sing, sex, status) VALUES
('Guilherme', 'Lima', '2006-10-13', 'lima@gmail.com', 16, 'Libra', 'M', true);
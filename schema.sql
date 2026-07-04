CREATE DATABASE malagasy_transport;
USE malagasy_transport;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    role ENUM('client', 'admin')
);
CREATE TABLE voyages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(100),
    date DATE,
    heure TIME,
    prix DECIMAL(10, 2)
);
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    id_voyage INT,
    siege VARCHAR(10),
    statut VARCHAR(50),
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_voyage) REFERENCES voyages(id)
);
CREATE TABLE historique (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    id_reservation INT,
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_reservation) REFERENCES reservations(id)
);
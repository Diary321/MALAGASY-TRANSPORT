/*
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-07-02 23:00:13
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-02 23:01:45
 * @FilePath: \MALAGASY_TRANSPORT\test-login.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const bcrypt = require('bcrypt');

const email = 'admin@gmail.com';
const password = 'admin123';
const hashFromDB = '$2b$10$UNF7rtp9GRP0fR1hA5oY.1o0GGMMvLZ1.TF2SHk1/Wo8Nirs5wMS';

// Tester si le mot de passe correspond au hash
const isValid = bcrypt.compareSync(password, hashFromDB);
console.log('Email:', email);
console.log('Mot de passe:', password);
console.log('Hash dans la base:', hashFromDB);
console.log('Mot de passe valide ?', isValid ? '✅ OUI' : '❌ NON');
/*
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-07-10 13:33:13
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-10 13:33:39
 * @FilePath: \MALAGASY_TRANSPORT\tesy-admin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const bcrypt = require('bcrypt');
const password = 'admin123';
const hash = '$2b$10$UNF7rtp9GRP0fR1hA5oY.1o0GGMMvLZ1.TF2SHk1/Wo8Nirs5wMS';

console.log('🔍 Test du hash:');
console.log('Mot de passe:', password);
console.log('Hash:', hash);
console.log('Valide ?', bcrypt.compareSync(password, hash) ? '✅ OUI' : '❌ NON');
/*
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-07-02 22:54:10
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-02 22:54:39
 * @FilePath: \MALAGASY_TRANSPORT\test-hash.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const bcrypt = require('bcrypt');

const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);
console.log('Mot de passe:', password);
console.log('Hash:', hash);
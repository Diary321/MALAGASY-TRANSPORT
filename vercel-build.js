// vercel-build.js
const { execSync } = require('child_process');

console.log('🚀 Démarrage du build Vercel...');
console.log('📦 Installation des dépendances...');

try {
    execSync('npm install --production', { stdio: 'inherit' });
    console.log('✅ Dépendances installées avec succès');
} catch (error) {
    console.error('❌ Erreur lors de l\'installation:', error);
    process.exit(1);
}
# 🗳️ Installation Kanban Présidentielles 2027 - Windows PowerShell
# Copie-colle ces commandes dans PowerShell (une par une ou tout d'un coup)

Write-Host "🚀 Installation du Kanban Présidentielles 2027" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# ÉTAPE 1 : Créer le projet
Write-Host "📦 Création du projet React..." -ForegroundColor Yellow
npm create vite@latest kanban-presidentielle -- --template react

# Aller dans le dossier
Set-Location kanban-presidentielle

# ÉTAPE 2 : Installer les dépendances
Write-Host ""
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

# ÉTAPE 3 : Installer Tailwind CSS
Write-Host ""
Write-Host "🎨 Installation de Tailwind CSS..." -ForegroundColor Yellow
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# ÉTAPE 4 : Installer lucide-react
Write-Host ""
Write-Host "✨ Installation des icônes..." -ForegroundColor Yellow
npm install lucide-react

# ÉTAPE 5 : Configuration Tailwind
Write-Host ""
Write-Host "⚙️ Configuration de Tailwind..." -ForegroundColor Yellow

$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"@
$tailwindConfig | Out-File -FilePath "tailwind.config.js" -Encoding utf8

# ÉTAPE 6 : Remplacer index.css
$indexCss = @"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@
$indexCss | Out-File -FilePath "src/index.css" -Encoding utf8

# ÉTAPE 7 : Remplacer App.jsx
$appJsx = @"
import KanbanPresidentielle from './kanban-presidentielle-2027'

function App() {
  return <KanbanPresidentielle />
}

export default App
"@
$appJsx | Out-File -FilePath "src/App.jsx" -Encoding utf8

Write-Host ""
Write-Host "✅ Installation terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PROCHAINES ÉTAPES :" -ForegroundColor Cyan
Write-Host "1. Copie le fichier 'kanban-presidentielle-2027.jsx' dans le dossier 'src/'" -ForegroundColor White
Write-Host "2. Lance le serveur : npm run dev" -ForegroundColor White
Write-Host "3. Ouvre http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Bon développement !" -ForegroundColor Green

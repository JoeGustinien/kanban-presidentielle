#!/bin/bash

# 🗳️ Script d'installation Kanban Présidentielles 2027
# Copie-colle ces commandes une par une dans ton terminal

echo "🚀 Installation du Kanban Présidentielles 2027"
echo "================================================"
echo ""

# ========================================
# ÉTAPE 1 : Création du projet
# ========================================
echo "📦 Étape 1/5 : Création du projet React..."
npm create vite@latest kanban-presidentielle -- --template react

# Aller dans le dossier
cd kanban-presidentielle

# ========================================
# ÉTAPE 2 : Installation des dépendances
# ========================================
echo ""
echo "📦 Étape 2/5 : Installation des dépendances..."
npm install

# ========================================
# ÉTAPE 3 : Installation de Tailwind CSS
# ========================================
echo ""
echo "🎨 Étape 3/5 : Installation de Tailwind CSS..."
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# ========================================
# ÉTAPE 4 : Installation de lucide-react (icônes)
# ========================================
echo ""
echo "✨ Étape 4/5 : Installation des icônes..."
npm install lucide-react

# ========================================
# ÉTAPE 5 : Configuration
# ========================================
echo ""
echo "⚙️ Étape 5/5 : Configuration..."

# Créer le fichier tailwind.config.js
cat > tailwind.config.js << 'EOF'
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
EOF

# Remplacer src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Remplacer src/App.jsx
cat > src/App.jsx << 'EOF'
import KanbanPresidentielle from './kanban-presidentielle-2027'

function App() {
  return <KanbanPresidentielle />
}

export default App
EOF

echo ""
echo "✅ Installation terminée !"
echo ""
echo "📋 PROCHAINES ÉTAPES :"
echo "1. Copie le fichier 'kanban-presidentielle-2027.jsx' dans le dossier 'src/'"
echo "2. Lance le serveur de développement : npm run dev"
echo "3. Ouvre http://localhost:5173 dans ton navigateur"
echo ""
echo "🎉 Bon développement !"

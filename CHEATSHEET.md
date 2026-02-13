# 📋 Cheat Sheet - Commandes Kanban Présidentielles 2027

## 🚀 Installation initiale

```bash
# Créer le projet
npm create vite@latest kanban-presidentielle -- --template react
cd kanban-presidentielle

# Installer tout
npm install
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react
npx tailwindcss init -p

# Lancer le projet
npm run dev
```

---

## 🔧 Développement quotidien

```bash
# Lancer le serveur de développement
npm run dev

# Build pour production (teste avant de déployer)
npm run build

# Preview du build de production
npm run preview

# Lint (vérifier le code)
npm run lint
```

---

## 📤 Git & GitHub

```bash
# Premier commit
git init
git add .
git commit -m "Initial commit"

# Lier à GitHub
git remote add origin https://github.com/USERNAME/kanban-presidentielle.git
git branch -M main
git push -u origin main

# Commits quotidiens
git add .
git commit -m "Description de tes modifs"
git push

# Créer une branche pour tester
git checkout -b nouvelle-feature
git push origin nouvelle-feature

# Revenir sur main
git checkout main

# Merger une branche
git merge nouvelle-feature
```

---

## 🌐 Déploiement Vercel

```bash
# Via CLI (première fois)
npm install -g vercel
npm run build
vercel

# Déploiement production
vercel --prod

# Via GitHub (recommandé)
# 1. Push sur GitHub
git push

# 2. Connecte GitHub sur vercel.com
# 3. C'est automatique ensuite ! ✨
```

---

## 🌐 Déploiement Netlify

```bash
# Via CLI
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist

# Via GitHub (recommandé)
# Même principe que Vercel !
```

---

## 🌐 Déploiement GitHub Pages

```bash
# Setup (une fois)
npm install -D gh-pages

# Ajoute dans package.json :
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Déployer
npm run deploy
```

---

## 🔍 Débug

```bash
# Voir les logs détaillés
npm run dev --debug

# Nettoyer le cache
rm -rf node_modules
rm package-lock.json
npm install

# Vérifier les dépendances
npm list

# Mettre à jour les dépendances
npm update

# Vérifier les vulnérabilités
npm audit
npm audit fix
```

---

## 📁 Structure des fichiers

```
kanban-presidentielle/
├── src/
│   ├── kanban-presidentielle-2027.jsx   ← Ton code principal
│   ├── App.jsx                           ← Point d'entrée
│   ├── index.css                         ← Styles Tailwind
│   └── main.jsx                          ← Bootstrap React
├── public/                               ← Images, favicon, etc.
├── index.html                            ← Template HTML
├── package.json                          ← Dépendances
├── vite.config.js                        ← Config Vite
└── tailwind.config.js                    ← Config Tailwind
```

---

## 🎨 Modifications courantes

### Ajouter un candidat

Dans `kanban-presidentielle-2027.jsx`, modifie `initialCandidates` :

```jsx
{
  id: '12',
  name: 'Nouveau Candidat',
  party: 'Parti',
  photo: 'URL_de_la_photo',
  polls: '10%',
  declaredDate: '01/01/2026',
  programUrl: 'https://...',
  status: 'potentiels',
  note: 'Note optionnelle'
}
```

### Changer les couleurs

Dans `COLUMNS` :

```jsx
const COLUMNS = [
  { id: 'potentiels', title: 'Potentiels', color: 'border-gray-400' },
  { id: 'primaires', title: 'En primaire', color: 'border-orange-400' },
  { id: 'declares', title: 'Déclarés', color: 'border-blue-400' },
  { id: 'qualifies', title: 'Qualifiés', color: 'border-green-400' }
];
```

Couleurs Tailwind disponibles : `gray`, `red`, `orange`, `yellow`, `green`, `blue`, `indigo`, `purple`, `pink`

---

## ⚡ Raccourcis VSCode

```
Ctrl/Cmd + P         → Recherche rapide de fichier
Ctrl/Cmd + Shift + F → Recherche dans tous les fichiers
Ctrl/Cmd + D         → Sélectionner le mot suivant
Ctrl/Cmd + /         → Commenter/décommenter
Alt + Up/Down        → Déplacer la ligne
```

---

## 🐛 Erreurs courantes

**Port 5173 already in use :**
```bash
# Trouve et tue le processus
lsof -ti:5173 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5173   # Windows

# Ou change le port dans vite.config.js
```

**Module not found :**
```bash
npm install
```

**Build failed :**
```bash
# Vérifie la syntaxe
npm run lint

# Nettoie et rebuild
rm -rf dist
npm run build
```

**Images ne s'affichent pas :**
- Vérifie les URLs
- Problème CORS possible
- Teste avec d'autres URLs

---

## 📊 Commandes utiles en +

```bash
# Voir la taille du bundle
npm run build
du -sh dist

# Analyser le bundle
npm install -D rollup-plugin-visualizer
# Ajoute le plugin dans vite.config.js

# Formater le code
npm install -D prettier
npx prettier --write "src/**/*.{js,jsx}"

# TypeScript (si tu veux migrer)
npm install -D typescript @types/react @types/react-dom
```

---

## 🎯 Workflow complet (récap)

```bash
# 1. Développement local
npm run dev               # Développe
git add .                 # Stage
git commit -m "..."       # Commit
git push                  # Push

# 2. Déploiement automatique
# ✨ Vercel/Netlify déploie automatiquement !

# 3. Vérification
# Ouvre ton URL de prod
# Teste les fonctionnalités
# ✅ Tout marche !
```

---

## 🔗 Liens utiles

- **React :** https://react.dev
- **Vite :** https://vitejs.dev
- **Tailwind :** https://tailwindcss.com
- **Lucide Icons :** https://lucide.dev
- **Vercel :** https://vercel.com
- **Netlify :** https://netlify.com

---

**🎉 Garde ce fichier sous la main !**

# 🚀 Guide de Déploiement - Kanban Présidentielles 2027

## 🎯 Déploiement le plus simple : Vercel + GitHub

### Pourquoi Vercel ?
- ✅ **Gratuit** pour les projets personnels
- ✅ **Déploiement automatique** à chaque push GitHub
- ✅ **HTTPS automatique** avec certificat SSL
- ✅ **Rapide** : en ligne en 30 secondes
- ✅ **Mises à jour faciles** : juste `git push`

---

## 📝 Étape par étape (15 minutes)

### 1️⃣ Préparer ton projet pour GitHub

```bash
# Dans le dossier de ton projet
git init
git add .
git commit -m "Initial commit - Kanban Présidentielles 2027"
```

### 2️⃣ Créer un repo GitHub

1. Va sur [github.com](https://github.com)
2. Clique sur "New repository"
3. Nom : `kanban-presidentielle`
4. Laisse Public (ou Private, ça marche aussi)
5. **NE COCHE PAS** "Initialize with README"
6. Clique "Create repository"

### 3️⃣ Pousser ton code sur GitHub

GitHub te donne les commandes, copie-les :

```bash
git remote add origin https://github.com/TON-USERNAME/kanban-presidentielle.git
git branch -M main
git push -u origin main
```

### 4️⃣ Déployer sur Vercel

**Option A : Via le site (recommandé)**

1. Va sur [vercel.com](https://vercel.com)
2. Clique "Sign Up" → "Continue with GitHub"
3. Clique "Import Project"
4. Sélectionne ton repo `kanban-presidentielle`
5. Garde les paramètres par défaut
6. Clique "Deploy"
7. ✅ **C'est en ligne !** (en ~30 secondes)

**Option B : Via le terminal**

```bash
# Installe Vercel CLI
npm install -g vercel

# Build ton projet
npm run build

# Déploie
vercel

# Suis les instructions (Login avec GitHub)
# À la fin, tu as ton URL !
```

---

## 🔄 Mettre à jour ton site (quotidien)

### Avec GitHub + Vercel (automatique) 🎯

```bash
# 1. Fais tes modifications dans VSCode
# 2. Commit et push

git add .
git commit -m "Ajout de nouveaux candidats"
git push

# ✨ TERMINÉ ! Vercel déploie automatiquement en 30 secondes
# Tu reçois un email de confirmation
```

### Sans GitHub (manuel)

```bash
# Build
npm run build

# Déploie
vercel --prod
```

---

## 🌐 Alternatives à Vercel

### Netlify (aussi simple que Vercel)

```bash
# Installe Netlify CLI
npm install -g netlify-cli

# Build et déploie
npm run build
netlify deploy --prod --dir=dist

# Ou via le site : netlify.com
# Même principe que Vercel !
```

### GitHub Pages (gratuit, mais un peu plus complexe)

```bash
# 1. Modifie vite.config.js
# Ajoute : base: '/kanban-presidentielle/'

# 2. Installe gh-pages
npm install -D gh-pages

# 3. Ajoute dans package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# 4. Déploie
npm run deploy

# URL : https://TON-USERNAME.github.io/kanban-presidentielle/
```

---

## 🎯 Workflow recommandé

### Setup initial (1 fois) :

```bash
# 1. Crée ton projet
npm create vite@latest kanban-presidentielle -- --template react
cd kanban-presidentielle
npm install

# 2. Ajoute ton code
# (copie kanban-presidentielle-2027.jsx dans src/)

# 3. Push sur GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TON-USERNAME/kanban-presidentielle.git
git push -u origin main

# 4. Connecte à Vercel (via le site)
# ✅ TERMINÉ !
```

### Mises à jour quotidiennes :

```bash
# Édite tes fichiers dans VSCode
# Puis :

git add .
git commit -m "Description de tes modifs"
git push

# ✨ Vercel déploie automatiquement !
```

---

## 📊 Tableau comparatif

| Solution | Gratuit | Auto-déploiement | Vitesse | Difficulté |
|----------|---------|------------------|---------|------------|
| **Vercel** | ✅ Oui | ✅ Oui | ⚡ 30s | 😊 Facile |
| **Netlify** | ✅ Oui | ✅ Oui | ⚡ 40s | 😊 Facile |
| **GitHub Pages** | ✅ Oui | ⚠️ Avec config | ⚡ 1-2min | 😐 Moyen |
| **Railway** | ⚠️ Limité | ✅ Oui | ⚡ 1min | 😐 Moyen |

**Recommandation : Vercel ou Netlify**

---

## 🎨 Domaine personnalisé (optionnel)

### Sur Vercel (gratuit)

1. Va dans ton projet sur Vercel
2. Settings → Domains
3. Ajoute ton domaine (ex: `presidentielle2027.fr`)
4. Configure les DNS chez ton registrar
5. ✅ HTTPS automatique inclus !

---

## 🐛 Résolution de problèmes

**"Build failed" sur Vercel/Netlify :**
```bash
# Teste le build en local d'abord
npm run build

# Si ça marche en local mais pas sur Vercel,
# vérifie les versions Node.js
```

**Le site ne se met pas à jour :**
```bash
# Vide le cache
# Sur Vercel : Deployments → Menu → Redeploy
```

**Erreur de permissions GitHub :**
```bash
# Utilise un token d'accès personnel
# Settings → Developer settings → Personal access tokens
```

---

## 💡 Conseils pro

1. **Utilise des branches** pour tester :
   ```bash
   git checkout -b nouvelle-feature
   git push origin nouvelle-feature
   # Vercel crée une preview automatiquement !
   ```

2. **Protège ta branche main** :
   - Settings → Branches → Add rule
   - Require pull request reviews

3. **Monitoring** :
   - Vercel Analytics (gratuit)
   - Google Analytics (si tu veux)

---

## 📞 Support

**Vercel :** [vercel.com/docs](https://vercel.com/docs)  
**Netlify :** [docs.netlify.com](https://docs.netlify.com)  
**GitHub Pages :** [pages.github.com](https://pages.github.com)

---

**🎉 Bon déploiement !**

# 🚀 Configuration des variables d'environnement sur Vercel

## ⚠️ IMPORTANT
Les fichiers `.env.local` ne sont **jamais** déployés sur Vercel (ils sont ignorés par Git).
Vous devez ajouter vos variables d'environnement **manuellement** sur le dashboard Vercel.

---

## 📋 Étapes pour configurer Vercel

### **Étape 1 : Aller sur votre dashboard Vercel**
1. Allez sur https://vercel.com
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur votre projet **`portfolio_react`**

### **Étape 2 : Accéder aux paramètres**
1. Cliquez sur l'onglet **"Settings"** (en haut)
2. Dans le menu de gauche, cliquez sur **"Environment Variables"**

### **Étape 3 : Ajouter les 3 variables**

Cliquez sur **"Add New"** et ajoutez **UNE PAR UNE** :

#### **Variable 1 : SERVICE_ID**
```
Name:  VITE_EMAILJS_SERVICE_ID
Value: service_abc1234                    ← Votre Service ID depuis EmailJS
Environment: Production, Preview, Development (cochez les 3)
```

#### **Variable 2 : TEMPLATE_ID**
```
Name:  VITE_EMAILJS_TEMPLATE_ID
Value: template_xyz5678                   ← Votre Template ID depuis EmailJS
Environment: Production, Preview, Development (cochez les 3)
```

#### **Variable 3 : PUBLIC_KEY**
```
Name:  VITE_EMAILJS_PUBLIC_KEY
Value: aBcDeFgHiJkLmNoPqR                 ← Votre Public Key depuis EmailJS
Environment: Production, Preview, Development (cochez les 3)
```

### **Étape 4 : Sauvegarder**
Cliquez sur **"Save"** pour chaque variable.

### **Étape 5 : Redéployer**
**IMPORTANT** : Les nouvelles variables ne seront actives qu'après un nouveau déploiement !

Deux options :

#### **Option A : Redéploiement automatique (Recommandé)**
```bash
git add .
git commit -m "feat: configure EmailJS for production"
git push
```
→ Vercel redéploiera automatiquement avec les nouvelles variables ! 🚀

#### **Option B : Redéploiement manuel**
1. Sur le dashboard Vercel, allez dans l'onglet **"Deployments"**
2. Cliquez sur les **"..."** du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Confirmez

---

## ✅ Vérification

Après le déploiement :

1. Allez sur votre site en ligne (ex: `https://portfolio-react-xxx.vercel.app`)
2. Testez le formulaire de contact
3. Vérifiez votre email `jeandavidzamblezie@outlook.fr`

---

## 🔍 Comment vérifier que les variables sont bien configurées ?

### **Méthode 1 : Console du navigateur**
1. Allez sur votre site en ligne
2. Ouvrez la console (F12)
3. Tapez :
```javascript
console.log(import.meta.env.VITE_EMAILJS_SERVICE_ID)
```
→ Si ça affiche votre Service ID, c'est bon ! ✅

### **Méthode 2 : Tester le formulaire**
Envoyez un message de test depuis le site en ligne et vérifiez votre email.

---

## 🆘 Problèmes courants

### ❌ "undefined" dans la console
**Problème** : Les variables ne sont pas configurées sur Vercel
**Solution** : 
1. Vérifiez que vous avez bien ajouté les 3 variables sur Vercel
2. Vérifiez que vous avez coché "Production"
3. Redéployez le site

### ❌ Le formulaire ne fonctionne qu'en local
**Problème** : Vous n'avez pas ajouté les variables sur Vercel
**Solution** : Suivez les étapes ci-dessus pour ajouter les variables

### ❌ Erreur 401 ou 403
**Problème** : Clés EmailJS incorrectes
**Solution** : Vérifiez vos clés sur https://dashboard.emailjs.com/

---

## 📊 Résumé des environnements

| Environnement | Fichier utilisé | Où configurer |
|---------------|-----------------|---------------|
| **Local** (npm run dev) | `.env.local` | Fichier dans votre projet |
| **Vercel** (en ligne) | Variables Vercel | Dashboard Vercel → Settings → Environment Variables |

---

## 🔒 Sécurité

- ✅ `.env.local` est ignoré par Git (sécurisé)
- ✅ Les variables Vercel sont chiffrées et sécurisées
- ✅ Seules les variables `VITE_*` sont exposées côté client (c'est normal pour Vite)
- ⚠️ Ne commitez **JAMAIS** vos clés dans le code source

---

## 📞 Aide supplémentaire

- Documentation Vercel : https://vercel.com/docs/projects/environment-variables
- Dashboard EmailJS : https://dashboard.emailjs.com/

**Une fois configuré, votre formulaire fonctionnera partout ! 🎉**

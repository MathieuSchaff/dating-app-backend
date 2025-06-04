#!/bin/bash

echo "🧪 Lancement des tests..."
echo ""

# Nettoyer le cache si nécessaire
if [ "$1" == "--clean" ]; then
  echo "🧹 Nettoyage du cache..."
  rm -rf node_modules/.cache
  echo ""
fi
echo "⚙️ Préparation de l'environnement MongoDB..."
npm run test:setup

# Lancer les tests
echo "📋 Tests unitaires..."
npm test

# Vérifier le code de sortie
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Tous les tests sont passés avec succès!"
  echo ""
  
  # Optionnel : lancer les tests avec couverture
  read -p "Voulez-vous lancer les tests avec couverture? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run test:cov
  fi
else
  echo ""
  echo "❌ Des tests ont échoué. Vérifiez les erreurs ci-dessus."
  exit 1
fi
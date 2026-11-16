# MAD12 — Boutique en ligne

Base de départ du projet MAD12 : une boutique responsive pensée d'abord pour mobile, avec une interface publique et une interface d'administration séparée.

## Contenu

- `storefront/` : vitrine publique, navigation par catégories, recherche et état vide du catalogue.
- `admin/` : interface d'administration distincte. Elle est volontairement présentée comme une maquette non connectée tant que l'authentification et les autorisations Supabase ne sont pas configurées.
- `netlify.toml` : configuration de publication statique.

## Catégories prévues

- Parfums et parfumerie
- Beauté et mèches
- Mode féminine
- Senteurs pour la maison

## État actuel — important

Cette livraison est un **socle d'interface**, pas une boutique prête à encaisser des commandes.

Aucun produit, prix, stock, fournisseur, frais de livraison ou moyen de paiement réel n'a été inventé. Le catalogue affiche donc un état vide jusqu'à l'ajout de données validées.

L'administration n'est pas encore reliée à Supabase et ne permet pas encore de connexion réelle. Ne pas y saisir de mot de passe réel.

## Prochaines étapes techniques

1. Déposer ces fichiers dans le dépôt GitHub `Dochee22/Mad-12`.
2. Relier la vitrine au projet Supabase `mad12-store` avec une clé publique uniquement.
3. Créer une fonction serveur sécurisée pour recevoir et valider les commandes.
4. Mettre en place l'authentification Supabase et un rôle administrateur vérifié côté serveur et par les politiques RLS.
5. Tester les commandes, les prix, les stocks et les règles de livraison avant toute ouverture commerciale.

## Sécurité

- Ne jamais placer une clé `service_role`, un mot de passe ou un secret dans le code du navigateur.
- Ne pas considérer qu'un utilisateur connecté est automatiquement administrateur.
- Les commandes doivent être validées côté serveur : prix, disponibilité, quantités et total.
- Les données personnelles des clients ne doivent jamais être exposées publiquement.

## Publication

Le site est statique et pourra être publié sur Netlify une fois le dépôt configuré. Vérifier les conditions et limites du forfait gratuit avant une mise en production commerciale.

# Intégration Supabase — points obligatoires

## Configuration navigateur
Renseigner uniquement :
- l'URL du projet Supabase ;
- la clé publique / anon (ou publishable key compatible).

Ne jamais mettre `service_role`, une clé secrète, un mot de passe ni un token GitHub dans un fichier du navigateur ou dans GitHub.

## Tables déjà vérifiées
`categories`, `products`, `product_images`, `suppliers`, `orders`, `order_items`, `stock_movements`.

Les politiques RLS publiques de lecture concernent uniquement les catégories actives, les produits actifs et leurs images. Les tables fournisseurs, commandes, lignes de commande et mouvements de stock ne sont pas ouvertes au rôle anon.

## Rôle administrateur
La politique existante vérifie `auth.jwt()->'app_metadata'->>'role' = 'admin'`. Le rôle doit être défini côté serveur par une procédure de confiance. Ne jamais utiliser `user_metadata` comme preuve d'administration, car l'utilisateur peut modifier ses propres métadonnées.

À la dernière vérification, aucun utilisateur ne portait le rôle admin et aucune Edge Function n'était déployée. Il faut donc créer le premier admin par une méthode sécurisée avant de tester l'espace d'administration.

## Commandes publiques
Ne pas faire d'INSERT direct depuis le navigateur vers `orders` ou `order_items`. Déployer une Edge Function ou une fonction serveur équivalente qui :
1. reçoit les identifiants produits et quantités ;
2. recharge les prix et la disponibilité depuis la base ;
3. valide les quantités, les statuts et les totaux côté serveur ;
4. crée la commande et ses lignes de manière atomique ;
5. ne révèle aucune donnée fournisseur ou interne ;
6. renvoie un numéro de commande non sensible.

## Tests avant publication
- Visiteur anon : lecture des seuls produits/catégories actifs.
- Visiteur anon : aucun accès aux fournisseurs, commandes, lignes ou mouvements de stock.
- Utilisateur connecté non-admin : aucun accès d'administration.
- Admin : accès conforme aux politiques RLS.
- Commande : prix et stock calculés côté serveur, jamais acceptés depuis le navigateur.

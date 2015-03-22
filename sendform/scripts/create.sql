CREATE TABLE commandesmenus (
  id serial,
  entree text, -- Entrée choisie
  principal text, -- Plat principal
  notable integer -- Nº de la table
);
COMMENT ON COLUMN commandesmenus.entree IS 'Entrée choisie';
COMMENT ON COLUMN commandesmenus.principal IS 'Plat principal';
COMMENT ON COLUMN commandesmenus.notable IS 'Nº de la table';

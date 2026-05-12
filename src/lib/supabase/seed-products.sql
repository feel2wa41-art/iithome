-- =========================================================================
-- One-time seed of the existing 26 products + 2 categories.
-- Run this AFTER schema.sql, in Supabase SQL Editor.
-- Safe to re-run (uses ON CONFLICT).
-- =========================================================================

-- Replace the old 5-slug seed categories with the real-world 2 categories.
-- We keep the old rows around (with is_active = false implicitly because we
-- only show categories that have products) but insert our real ones.

insert into public.product_categories (slug, name_en, name_id, description_en, description_id, sort_order)
values
  (
    'fiber-optic',
    'Fiber Optic',
    'Fiber Optik',
    'Cables, connectors, splitters, attenuators and active modules — the core of your network.',
    'Kabel, konektor, splitter, attenuator, dan modul aktif — inti dari jaringan Anda.',
    1
  ),
  (
    'ftth-accessories',
    'FTTH Accessories',
    'Aksesori FTTH',
    'Clamps, brackets, suspensions and mounting hardware for reliable last-mile installations.',
    'Klem, braket, suspensi, dan perangkat keras pemasangan untuk instalasi last-mile yang andal.',
    2
  )
  on conflict (slug) do update set
    name_en = excluded.name_en,
    name_id = excluded.name_id,
    description_en = excluded.description_en,
    description_id = excluded.description_id,
    sort_order = excluded.sort_order;

-- ---------------- Fiber Optic (12 products) ----------------
with cat as (select id from public.product_categories where slug = 'fiber-optic')
insert into public.products (category_id, slug, name_en, name_id, short_en, short_id, image_url, is_active, sort_order)
select cat.id, v.slug, v.name_en, v.name_id, v.short_en, v.short_id, v.image_url, true, v.sort_order
from cat, (values
  ('cat6-utp-cable',           'Cat6 UTP Cable',              'Kabel UTP Cat6',                  'Premium Cat6 UTP cable for high-speed gigabit networks.',         'Kabel UTP Cat6 premium untuk jaringan gigabit kecepatan tinggi.',          '/products/fiber%20optic/cat6utpcable.png',                              1),
  ('rj45-cat6-connector',      'RJ45 Cat6 Connector',         'Konektor RJ45 Cat6',              'Standards-compliant RJ45 connectors for Cat6 terminations.',     'Konektor RJ45 sesuai standar untuk terminasi Cat6.',                       '/products/fiber%20optic/Connector%20rj45%20cat6.png',                   2),
  ('patch-cord-cable',         'Patch Cord Cable',            'Kabel Patch Cord',                'Factory-terminated patch cords for ODF and equipment links.',    'Patch cord terminasi pabrik untuk koneksi ODF dan perangkat.',             '/products/fiber%20optic/Patch%20Cord%20Cable.jpeg',                     3),
  ('fast-connector',           'Fast Connector',              'Fast Connector',                  'Tool-less fast connectors for rapid field termination.',         'Fast connector tanpa alat untuk terminasi cepat di lapangan.',             '/products/fiber%20optic/Fast%20Connector.jpeg',                         4),
  ('preconnector',             'Preconnector',                'Preconnector',                    'Pre-polished connectors with consistent insertion loss.',        'Konektor pre-polish dengan insertion loss yang konsisten.',                '/products/fiber%20optic/Preconnector.jpeg',                             5),
  ('preconnector-sc-upc',      'Preconnector SC/UPC',         'Preconnector SC/UPC',             'SC/UPC pre-polished connectors for FTTH drop installations.',    'Konektor pre-polish SC/UPC untuk instalasi drop FTTH.',                    '/products/fiber%20optic/preconnectorscupc.png',                         6),
  ('attenuator-sc-upc',        'Fiber Optic Attenuator SC/UPC','Attenuator Fiber Optik SC/UPC',  'Female-female SC/UPC attenuators in standard dB values.',        'Attenuator SC/UPC female-female dengan nilai dB standar.',                 '/products/fiber%20optic/Fiber%20Optic%20Attenuator%20SCUPC.jpeg',       7),
  ('attenuator-sc-apc',        'Optical Attenuator SC/APC',   'Attenuator Optik SC/APC',         'SC/APC attenuators for return-loss sensitive PON networks.',     'Attenuator SC/APC untuk jaringan PON yang sensitif return-loss.',          '/products/fiber%20optic/Optical%20Attenuator%20SCAPC.png',              8),
  ('splitter-2-way',           '2-Way Splitter',              'Splitter 2-Way',                  'PLC 1×2 splitter for PON distribution.',                         'Splitter PLC 1×2 untuk distribusi PON.',                                   '/products/fiber%20optic/Splitter2way.jpeg',                             9),
  ('splitter-3-way',           '3-Way Splitter',              'Splitter 3-Way',                  'PLC splitter for branching deployments.',                        'Splitter PLC untuk deployment dengan percabangan.',                        '/products/fiber%20optic/Splitter3way.jpeg',                            10),
  ('joint-closure',            'Joint Closure Fiber Optic',   'Joint Closure Fiber Optik',       'Outdoor-rated splice enclosure for backbone and FTTH joints.',   'Splice enclosure outdoor untuk sambungan backbone dan FTTH.',              '/products/fiber%20optic/Joint%20Closure%20Fiber%20Optic.png',          11),
  ('sfp-qsfp',                 'SFP / QSFP Modules',          'Modul SFP / QSFP',                'Transceiver modules from 1G SFP to 100G QSFP28.',                'Modul transceiver dari SFP 1G hingga QSFP28 100G.',                        '/products/fiber%20optic/SFPQSFP.png',                                  12)
) as v(slug, name_en, name_id, short_en, short_id, image_url, sort_order)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name_en = excluded.name_en,
  name_id = excluded.name_id,
  short_en = excluded.short_en,
  short_id = excluded.short_id,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------- FTTH Accessories (14 products) ----------------
with cat as (select id from public.product_categories where slug = 'ftth-accessories')
insert into public.products (category_id, slug, name_en, name_id, short_en, short_id, image_url, is_active, sort_order)
select cat.id, v.slug, v.name_en, v.name_id, v.short_en, v.short_id, v.image_url, true, v.sort_order
from cat, (values
  ('cable-clamp',                 'Cable Clamp',                  'Cable Clamp',                   'Universal clamp for fiber cable runs on poles and walls.',          'Klem universal untuk pemasangan kabel fiber di tiang dan dinding.',             '/products/accesories%20ftth/Cable%20Clamp.jpeg',                          1),
  ('cable-anchor-clamp',          'Cable Anchor Clamp',           'Cable Anchor Clamp',            'Wedge-style anchor clamp for ADSS / aerial fiber.',                 'Anchor clamp tipe wedge untuk fiber ADSS / aerial.',                            '/products/accesories%20ftth/Cable%20Anchore%20Clamp.jpeg',                2),
  ('clamp-round-2',               'Clamp Round 2',                'Clamp Round 2',                 'Two-bolt round clamp for round-profile cables.',                    'Klem bulat dua baut untuk kabel profil bulat.',                                 '/products/accesories%20ftth/Clamp%20Round%202.jpeg',                      3),
  ('clamp-round-4',               'Clamp Round 4',                'Clamp Round 4',                 'Four-bolt round clamp for heavier cable bundles.',                  'Klem bulat empat baut untuk bundel kabel yang lebih berat.',                    '/products/accesories%20ftth/Clamp%20Round%204.jpeg',                      4),
  ('q-span-clamp',                'Q Span Clamp',                 'Q Span Clamp',                  'Q-span suspension clamp for short pole-to-pole runs.',              'Suspension clamp Q-span untuk jarak antar-tiang pendek.',                       '/products/accesories%20ftth/Q%20Span%20Clamp.jpeg',                       5),
  ('dead-ends-loop-clamp',        'Dead Ends Loop Clamp',         'Dead Ends Loop Clamp',          'Loop-style dead-end termination for span ends.',                    'Terminasi dead-end tipe loop untuk ujung span.',                                '/products/accesories%20ftth/Dead%20Ends%20Loop%20Clamp.jpeg',             6),
  ('bracket-a-dead-end-clamp',    'Bracket A Dead End Clamp',     'Bracket A Dead End Clamp',      'Type-A bracket with integrated dead-end clamp.',                    'Bracket tipe-A dengan dead-end clamp terintegrasi.',                            '/products/accesories%20ftth/Bracket%20A%20Dead%20End%20Clamp.jpeg',       7),
  ('hook-bracket',                'Hook Bracket',                 'Hook Bracket',                  'Hook bracket for hanging messenger-wire installations.',            'Hook bracket untuk instalasi messenger-wire gantung.',                          '/products/accesories%20ftth/Hook%20Bracket.jpeg',                         8),
  ('suspension-funnel',           'Suspension Funnel',            'Suspension Adds Corong',        'Funnel-style suspension fitting for cable transitions.',            'Suspensi tipe corong untuk transisi kabel.',                                    '/products/accesories%20ftth/Suspension%20Adds%20Corong.jpeg',             9),
  ('suspension-figure-8',         'Figure 8 Suspension',          'Suspension Figure 8',           'Figure-8 suspension for self-supporting messenger cables.',         'Suspensi Figure-8 untuk kabel messenger self-supporting.',                      '/products/accesories%20ftth/Suspension%20Figure%208.jpeg',               10),
  ('section-frame-slack',         'Section Frame Slack',          'Section Frame Slack',           'Slack-storage frame for backbone span loops.',                      'Frame penyimpanan slack untuk loop span backbone.',                              '/products/accesories%20ftth/sectionframe%20slack.jpeg',                  11),
  ('galvanized-wire-6-16mm',      'Galvanized Wire 6-16mm',       'Kawat Galvanis 6-16mm',         'Hot-dip galvanised messenger wire, 6-16mm gauges.',                 'Kawat messenger galvanis hot-dip, gauge 6-16mm.',                                '/products/accesories%20ftth/Kawat%20Galvanis%206to16mm.jpeg',            12),
  ('hilti-concrete-nail',         'Hilti Concrete Nail',          'Paku Beton Hilti',              'Hilti-grade concrete nails for cable clip anchoring.',              'Paku beton kelas Hilti untuk pengangkuran klip kabel.',                          '/products/accesories%20ftth/Paku%20Beton%20Hilti.jpeg',                  13),
  ('tplink-adaptor-5v',           'TP-Link Adaptor 5V 0.6A',      'Adaptor TP-Link 5V 0.6A',       'Replacement TP-Link 5V/0.6A power adaptor.',                        'Adaptor pengganti TP-Link 5V/0.6A.',                                            '/products/accesories%20ftth/Adaptor%20Tplink%205V%200.6A.jpeg',         14)
) as v(slug, name_en, name_id, short_en, short_id, image_url, sort_order)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name_en = excluded.name_en,
  name_id = excluded.name_id,
  short_en = excluded.short_en,
  short_id = excluded.short_id,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  updated_at = now();

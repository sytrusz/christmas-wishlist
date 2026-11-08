-- Default Site Header
INSERT OR IGNORE INTO "SiteSetting" ("key", "value") VALUES 
('header_title', 'Christmas Wishlist 2026');

-- Sample Users
INSERT OR IGNORE INTO "User" ("id", "fullName", "category") VALUES 
(1, 'Alex Doe', 'ADULT'),
(2, 'Sam Smith', 'ADULT'),
(3, 'Charlie', 'KID'),
(4, 'Buddy', 'PET');

-- Sample Wishlist 1: Alex Doe
INSERT OR IGNORE INTO "Wishlist" ("id", "ownerName", "uniqueSlug", "note", "category", "groupNotes", "createdAt", "updatedAt") VALUES 
(1, 'Alex Doe', 'alex-doe-demo', 'Excited for this year''s gift exchange! Looking forward to warm cozy gifts.', 'ADULT', '{"group1Title":"Warm Clothing","group2Title":"Coffee & Reading"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO "WishlistItem" ("itemName", "description", "shopLink", "groupNumber", "wishlistId") VALUES 
('Merino Wool Sweater', 'Size L, Charcoal Gray or Navy Blue', 'https://example.com/sweater', 1, 1),
('Thermal Fleece Socks', 'Pack of 3, Warm wool blend', NULL, 1, 1),
('Single-Origin Coffee Beans', 'Medium roast, whole bean (Ethiopian or Colombian)', 'https://example.com/coffee', 2, 1),
('Sci-Fi Hardcover Novel', 'Any bestseller from this year', NULL, 2, 1);

-- Sample Wishlist 2: Charlie
INSERT OR IGNORE INTO "Wishlist" ("id", "ownerName", "uniqueSlug", "note", "category", "groupNotes", "createdAt", "updatedAt") VALUES 
(2, 'Charlie', 'charlie-demo', 'I love building things and playing outside!', 'KID', '{"group1Title":"Building & Blocks","group2Title":"Outdoor Fun"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO "WishlistItem" ("itemName", "description", "shopLink", "groupNumber", "wishlistId") VALUES 
('Lego Space Exploration Set', 'Age 8+, with rocket and astronaut figures', 'https://example.com/lego', 1, 2),
('Color-Changing LED Night Light', 'Moon or Astronaut shaped', NULL, 1, 2),
('Kids Scooter', 'Adjustable height, blue or red', NULL, 2, 2);

-- Sample Wishlist 3: Buddy
INSERT OR IGNORE INTO "Wishlist" ("id", "ownerName", "uniqueSlug", "note", "category", "groupNotes", "createdAt", "updatedAt") VALUES 
(3, 'Buddy', 'buddy-demo', 'Woof! Always happy with treats and squeaky toys.', 'PET', '{"group1Title":"Toys & Treats"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO "WishlistItem" ("itemName", "description", "shopLink", "groupNumber", "wishlistId") VALUES 
('Durable Rubber Chew Bone', 'Flavor scented, suitable for medium dogs', NULL, 1, 3),
('Cozy Memory Foam Pet Blanket', 'Washable, Medium size', NULL, 1, 3);

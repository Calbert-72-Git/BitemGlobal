Plataforma de gestión multi-negocio Bitem Global (antes Calbert 72)

## Design System
- Primary: Blue HSL(217, 85%, 45%) - from ENI logo
- Accent/Success: Green HSL(145, 60%, 40%) 
- Destructive: Red HSL(0, 72%, 50%)
- Warning: Orange HSL(38, 92%, 50%)
- Fonts: Montserrat (headings), Open Sans (body)
- Dark sidebar: HSL(220, 30%, 12%)

## Brand
- Name: Bitem Global (NOT Calbert 72)
- Sections: GeQ Sport (gimnasia), Clínica Bitem (clinica), Peluquería Bitem (peluqueria)
- Location: Bata-Ngolo, Guinea Ecuatorial
- Contact: WhatsApp +240222176082, calbertutm@gmail.com
- Logos: logo-eni.png (main), logo-gym.png, logo-clinica.png, logo-peluqueria.jpg

## Architecture
- Landing page: / (public)
- Login/Signup: /login (with tabs)
- Dashboard: /dashboard/* (protected, requires auth)
- DB tables: profiles, user_roles, sales, purchases, income, expenses, inventory, accounting_entries
- Roles: admin, worker, viewer (stored in user_roles table)
- All tables have business_section enum (gimnasia, clinica, peluqueria)

## Implemented
- Auth with email/password (signup + login)
- Sales CRUD with section filter
- Purchases/Income/Expenses CRUD (TransactionsPage)
- Inventory management with low stock alerts
- Accounting: Libro Diario, Libro Mayor, Balance Comprobación, Cuenta de Resultados
- User management (admin assigns roles)
- Protected routes

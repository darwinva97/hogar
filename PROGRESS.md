# Hogar - Progreso del Desarrollo

> Última actualización: 2026-01-19

## Modelo de Negocio

**Hogar es tu tienda** - Tú eres el único vendedor de cara al cliente.
Los "proveedores" son tus fabricantes/talleres internos con los que coordinas cuando hay pedidos.

```
                    ┌─► Proveedor A (fabricante)
Clientes ──► Hogar ─┼─► Proveedor B (taller)
         (tu marca) └─► Proveedor C (importador)
```

## Resumen

| Fase | Progreso |
|------|----------|
| Infraestructura | ████████░░ 80% |
| Autenticación | ████████░░ 80% |
| Cliente (Comprador) | ███████░░░ 70% |
| Admin | █████████░ 90% |
| Transportistas | █████░░░░░ 50% |
| Integraciones | ░░░░░░░░░░ 0% |

---

## Fase 1: Infraestructura

### Monorepo y Configuración
- [x] pnpm workspaces
- [x] Turborepo configurado
- [x] TypeScript configs compartidos
- [x] ESLint + Prettier
- [x] .env.example

### Next.js App (`apps/web`)
- [x] Next.js 16 con App Router
- [x] React 19 + React Compiler
- [x] Tailwind CSS 4
- [x] shadcn/ui (componentes base)
- [ ] Configurar eslint-config-next

### Base de Datos (`packages/database`)
- [x] Drizzle ORM configurado
- [x] Schema: users, sessions, addresses
- [x] Schema: providers (fabricantes internos)
- [x] Schema: categories, products, productImages, productVariants
- [x] Schema: orders, orderItems, orderStatusHistory
- [x] Schema: carts, cartItems
- [x] Schema: carriers, shipments, shipmentTracking
- [x] Schema: reviews, reviewImages, favorites
- [x] Seed de categorías
- [ ] Migraciones iniciales ejecutadas

### Socket.io (`apps/socket-server`)
- [x] Servidor Socket.io
- [x] Redis adapter (opcional)
- [x] Namespaces: main, /admin
- [x] Eventos de tracking y notificaciones
- [x] Cliente Socket.io en web app
- [x] Hooks: useSocket, useShipmentTracking, useOrderTracking

### Docker
- [x] docker-compose.yml
- [x] PostgreSQL con pgvector
- [x] Redis
- [x] Meilisearch
- [x] MinIO (S3)
- [x] Mailpit (emails dev)

---

## Fase 2: Autenticación

### Backend
- [x] Configurar auth con cookies/sessions
- [x] Crear session en BD al login
- [x] Validar session en middleware
- [x] Server Actions: login, register, logout
- [ ] OAuth: Google provider

### Frontend
- [x] `/login` - Página de inicio de sesión
- [x] `/registro` - Página de registro
- [ ] `/recuperar-password` - Recuperación
- [x] Componente UserMenu (dropdown)
- [x] Middleware de rutas protegidas

---

## Fase 3: Cliente (Comprador)

### Componentes
- [x] Navbar con carrito y búsqueda
- [x] Footer
- [x] ProductCard
- [x] Badge, Button, Card, Input, Label
- [x] ProductFilters
- [x] Pagination
- [x] AddToCartButton
- [x] CartItemActions
- [x] UserMenu
- [ ] CheckoutForm
- [ ] ReviewForm
- [ ] ReviewCard

### Páginas
- [x] `/` - Homepage (básico)
- [x] `/productos` - Listado con filtros y paginación
- [x] `/producto/[slug]` - Detalle de producto
- [x] `/categoria/[slug]` - Productos por categoría
- [ ] `/buscar` - Resultados de búsqueda
- [x] `/carrito` - Carrito de compras
- [ ] `/checkout` - Flujo de pago
- [ ] `/checkout/confirmacion/[id]` - Confirmación
- [x] `/cuenta` - Dashboard del usuario
- [x] `/cuenta/pedidos` - Historial de pedidos
- [x] `/cuenta/pedidos/[id]` - Detalle de pedido
- [x] `/cuenta/direcciones` - Gestión de direcciones
- [x] `/cuenta/perfil` - Perfil del usuario
- [ ] `/favoritos` - Wishlist

### Server Actions
- [x] login, register, logout (auth)
- [x] getProducts, getProductBySlug, getFeaturedProducts
- [x] getMainCategories, getCategoryWithChildren, getCategoryBreadcrumb
- [x] getCart, addToCart, updateCartItem, removeFromCart
- [x] createOrder, getUserOrders, getUserOrder
- [x] getUserProfile, updateUserProfile, getUserStats
- [x] getUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress
- [ ] addToFavorites, removeFromFavorites, getFavorites
- [ ] createReview, getProductReviews
- [ ] searchProducts (Meilisearch)

---

## Fase 4: Admin (Tu Panel de Control)

### Páginas
- [x] `/admin` - Dashboard overview con stats
- [x] `/admin/productos` - Gestión de catálogo
- [x] `/admin/productos/nuevo` - Crear producto
- [x] `/admin/productos/[id]` - Editar producto
- [x] `/admin/proveedores` - Proveedores internos (fabricantes)
- [x] `/admin/proveedores/nuevo` - Agregar proveedor
- [x] `/admin/proveedores/[id]` - Editar proveedor
- [x] `/admin/pedidos` - Todas las órdenes (con gestión manual de pagos)
- [x] `/admin/pedidos/[id]` - Detalle con gestión de estado y pago
- [x] `/admin/transportistas` - Lista carriers
- [x] `/admin/transportistas/nuevo` - Agregar carrier
- [ ] `/admin/transportistas/[id]` - Detalle carrier
- [x] `/admin/envios` - Panel de asignación
- [ ] `/admin/usuarios` - Lista de usuarios
- [ ] `/admin/categorias` - Gestión categorías

### Componentes
- [x] Admin layout con sidebar
- [x] AdminProductStatusToggle
- [x] AssignCarrierDialog
- [x] PaymentStatusActions
- [x] OrderStatusActions
- [x] OrderNotesForm

### Server Actions
- [x] getAdminStats
- [x] getRecentOrders
- [x] getAdminProducts, getAdminProduct, createAdminProduct, updateAdminProduct, deleteAdminProduct
- [x] toggleAdminProductStatus
- [x] getAdminProviders, getAdminProvider, createAdminProvider, updateAdminProvider, deleteAdminProvider
- [x] getAdminOrders, getAdminOrder
- [x] updateOrderStatus, updatePaymentStatus
- [x] addOrderNote
- [x] getCarriers, getCarrierById, createCarrier, updateCarrier
- [x] getPendingShipments, assignCarrierToShipment, getAvailableCarriers

---

## Fase 5: Transportistas

### Páginas
- [x] `/e/[codigo]` - Mini web app sin login
  - [x] Ver detalles del envío
  - [x] Actualizar estado
  - [ ] Subir foto de entrega
  - [x] Marcar como entregado/fallido
- [x] `/tracking/[codigo]` - Tracking público para cliente

### Componentes
- [x] CarrierStatusUpdate

### Server Actions
- [x] getShipmentByCode
- [x] updateShipmentStatusByCode (sin auth, por código)
- [ ] uploadDeliveryProof
- [x] getPublicTracking

### WhatsApp Integration (Futuro)
- [ ] Templates de mensajes
- [ ] Envío automático de asignación
- [ ] Envío de link /e/[codigo]
- [ ] Notificación al cliente de estados

---

## Fase 6: Integraciones

### Meilisearch
- [ ] Configurar cliente
- [ ] Indexar productos
- [ ] Sincronización automática
- [ ] Búsqueda con filtros
- [ ] Sugerencias/autocompletado

### MinIO / S3
- [ ] Configurar cliente
- [ ] Server Action para upload
- [ ] Presigned URLs
- [ ] Optimización de imágenes
- [ ] Componente ImageUpload

### Pagos - Culqi (Futuro)
- [ ] Configurar SDK
- [ ] Crear cargo con tarjeta
- [ ] Integrar Yape
- [ ] Webhooks de confirmación

### Emails
- [ ] Configurar transporter (Resend/SMTP)
- [ ] Templates: confirmación, envío, entrega
- [ ] Email de bienvenida

---

## Notas y Decisiones

### 2026-01-19 (Modelo B)
- **Cambio de arquitectura**: Hogar es tu tienda, no un marketplace
- Eliminado dashboard de proveedor - no lo necesitan
- Proveedores son fabricantes internos (contacto para coordinar pedidos)
- Gestión de productos movida completamente a Admin
- En detalle de pedido: se muestra proveedor con WhatsApp para coordinar fácilmente

### 2026-01-19 (Inicial)
- Proyecto inicializado con Next.js 16, React 19, Drizzle ORM
- Socket.io para tiempo real (Redis opcional)
- 4 niveles de integración para carriers: API, App, WhatsApp, Manual
- Sistema de pagos manual: admin marca como pagado con referencia (Yape, Plin, etc.)

---

## Próximos Pasos Sugeridos

1. **MinIO + Upload de imágenes** - Para que productos tengan fotos
2. **Checkout flow** - Flujo de compra (cuando se requiera)
3. **Meilisearch** - Búsqueda de productos
4. **Favoritos y reseñas** - Funcionalidad de wishlist y reviews

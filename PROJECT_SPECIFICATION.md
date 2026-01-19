# Hogar - Plataforma de Gestión de Muebles y E-commerce

## Visión General

Plataforma integral tipo marketplace que conecta clientes con fabricantes de muebles, optimizando la logística de entrega y ofreciendo experiencias personalizadas mediante IA y realidad aumentada.

**Propuesta de valor única**: No solo vendemos muebles, ayudamos a las personas a crear el hogar de sus sueños con tecnología que elimina la incertidumbre de comprar muebles online.

**Mercado inicial**: Lima Metropolitana, Perú (10+ millones de habitantes)

---

## Contexto del Mercado - Lima, Perú

### Zonas de Cobertura Inicial

**Lima Metropolitana - Distritos priorizados:**

| Zona | Distritos | Perfil |
|------|-----------|--------|
| Lima Top | Miraflores, San Isidro, La Molina, Surco, San Borja | NSE A/B, ticket alto |
| Lima Moderna | Jesús María, Lince, Pueblo Libre, Magdalena, San Miguel, Surquillo, Barranco | NSE B/C, clase media emergente |
| Lima Centro | Cercado, Breña, La Victoria, Rímac | NSE C/D, volumen |
| Lima Norte | Los Olivos, Independencia, San Martín de Porres, Comas | NSE C/D, alto crecimiento |
| Lima Este | Ate, Santa Anita, San Juan de Lurigancho, La Molina | NSE C/D, zona industrial |
| Lima Sur | Chorrillos, Villa El Salvador, San Juan de Miraflores | NSE C/D, precio sensible |
| Callao | Callao, Bellavista, La Perla | NSE C/D, puerto |

### Clusters de Fabricantes de Muebles en Lima

**Parque Industrial Villa El Salvador:**
- Mayor concentración de carpinterías y mueblerías
- Especialidad: muebles de madera, melamine
- Precios competitivos, producción en volumen

**La Victoria - Gamarra y alrededores:**
- Muebles tapizados, sofás
- Producción rápida

**Ate / Santa Anita:**
- Fábricas medianas y grandes
- Muebles de oficina y hogar

**San Juan de Lurigancho:**
- Carpinteros independientes
- Muebles a medida

### Competencia Local

- **Saga Falabella / Ripley**: Retail tradicional, precios altos
- **Sodimac / Promart**: Home improvement, muebles básicos
- **Casaideas**: Decoración y muebles importados
- **MercadoLibre / OLX**: Marketplace general
- **Facebook Marketplace**: Informal, sin garantías
- **Mueblerías de Villa El Salvador**: Directo pero sin tecnología

### Oportunidad

- No existe un marketplace especializado en muebles con tecnología AR/IA
- Fragmentación del mercado de fabricantes
- Dificultad de los consumidores para comparar y confiar
- Logística de última milla para muebles es un pain point

---

## Módulos Principales

---

### 1. Gestión de Proveedores/Fabricantes

#### 1.1 Onboarding de Proveedores

**Proceso de registro:**
- Formulario de solicitud con datos de la empresa
- Documentación requerida: RUC, ficha RUC vigente, DNI del representante, portafolio de productos
- Verificación manual por el equipo (visita al taller en Villa El Salvador, Ate, etc.)
- Firma de contrato digital con términos y comisiones
- Capacitación en uso de la plataforma

**Niveles de proveedor:**
| Nivel | Requisitos | Beneficios |
|-------|-----------|------------|
| Nuevo | Recién ingresado | Comisión estándar (15%), soporte básico |
| Verificado | 3+ meses, 10+ ventas, 4+ estrellas | Comisión reducida (12%), badge verificado |
| Premium | 12+ meses, 100+ ventas, 4.5+ estrellas | Comisión mínima (8%), posicionamiento prioritario |
| Partner | Invitación, exclusividad parcial | Comisión negociable, co-marketing |

#### 1.2 Catálogo de Proveedores

**Información del proveedor:**
- Datos de contacto (internos, no visibles al cliente final)
- Ubicación con geocodificación (para cálculo de distancias)
- Especialidades: tipo de muebles, materiales, estilos
- Capacidad productiva: unidades por semana/mes
- Tiempos de fabricación promedio por categoría
- Horarios de operación y días de entrega
- Certificaciones: ISO, sustentabilidad, calidad

**Galería del taller:**
- Fotos del taller/fábrica
- Videos del proceso de fabricación
- Equipo y maquinaria disponible

#### 1.3 Inventario por Proveedor

**Gestión de productos:**
- Alta de productos con plantillas por categoría
- Campos obligatorios: SKU, nombre, descripción, dimensiones, peso, materiales
- Múltiples variantes: colores, tamaños, acabados
- Fotos: mínimo 5 por producto, guía de fotografía proporcionada
- Modelo 3D opcional (para AR): soporte para .glb, .gltf, .usdz

**Estados de inventario:**
- `disponible`: En stock, envío inmediato
- `fabricación`: Se fabrica bajo pedido (indicar días)
- `bajo_pedido`: Requiere mínimo de unidades
- `agotado`: Temporalmente no disponible
- `descontinuado`: Ya no se fabrica

**Sincronización:**
- API para integración con sistemas del proveedor
- Importación masiva por CSV/Excel
- Webhooks para actualización en tiempo real
- Alertas de stock bajo configurable

#### 1.4 Sistema de Calificación de Proveedores

**Métricas automáticas:**
- Tiempo promedio de fabricación vs prometido
- Tasa de defectos/devoluciones
- Tiempo de respuesta a mensajes
- Cumplimiento de fechas de entrega

**Calificación del cliente (post-compra):**
- Calidad del producto (1-5 estrellas)
- Coincidencia con fotos (1-5 estrellas)
- Empaquetado (1-5 estrellas)
- Comunicación (1-5 estrellas)

**Score compuesto:**
```
score_proveedor = (
  calidad * 0.35 +
  cumplimiento_tiempo * 0.25 +
  tasa_devolucion_inversa * 0.20 +
  comunicacion * 0.10 +
  coincidencia_fotos * 0.10
)
```

#### 1.5 Zonas de Cobertura

**Configuración por proveedor:**
- Radio de entrega propia (si aplica)
- Estados/ciudades que puede atender
- Zonas excluidas (islas, zonas de difícil acceso)
- Tarifas diferenciadas por zona

**Mapa de calor:**
- Visualización de concentración de proveedores
- Identificar zonas con poca cobertura
- Estrategia de reclutamiento de proveedores

#### 1.6 Precios y Márgenes

**Estructura de precios:**
- Precio base del proveedor (costo)
- Margen de la plataforma (configurable por categoría)
- Precio de venta al público
- Precio tachado (para ofertas)

**Comisiones:**
- Por categoría de producto
- Por volumen de ventas (escalonado)
- Promociones temporales de comisión reducida

**Reportes financieros:**
- Ventas por período
- Comisiones generadas
- Pagos pendientes
- Historial de liquidaciones

#### 1.7 Panel del Proveedor

**Dashboard:**
- Resumen de ventas del día/semana/mes
- Órdenes pendientes de procesar
- Productos con bajo stock
- Mensajes sin leer
- Calificación actual

**Gestión de órdenes:**
- Lista de pedidos por estado
- Actualizar estado de fabricación
- Subir fotos de avance (opcional)
- Marcar como listo para envío
- Imprimir etiquetas

**Comunicación:**
- Chat con el equipo de Hogar
- Notificaciones de nuevos pedidos
- Alertas de problemas reportados

---

### 2. E-commerce de Muebles

#### 2.1 Catálogo de Productos

**Estructura de categorías:**
```
├── Sala
│   ├── Sofás
│   │   ├── Sofás de 2 plazas
│   │   ├── Sofás de 3 plazas
│   │   ├── Sofás esquineros
│   │   └── Sofás cama
│   ├── Sillones
│   ├── Mesas de centro
│   ├── Mesas laterales
│   ├── Libreros
│   └── Muebles de TV
├── Comedor
│   ├── Mesas de comedor
│   ├── Sillas
│   ├── Bancos
│   ├── Vitrinas
│   └── Bufeteros
├── Recámara
│   ├── Camas
│   ├── Cabeceras
│   ├── Veladores
│   ├── Cómodas
│   ├── Tocadores
│   └── Clósets
├── Oficina
│   ├── Escritorios
│   ├── Sillas de oficina
│   ├── Libreros
│   └── Archiveros
├── Exterior
│   ├── Mesas de jardín
│   ├── Sillas de exterior
│   ├── Camastros
│   └── Sombrillas
├── Cocina
│   ├── Mesas auxiliares
│   ├── Bancos de cocina
│   └── Alacenas
└── Infantil
    ├── Camas infantiles
    ├── Cunas
    ├── Escritorios infantiles
    └── Almacenamiento
```

**Filtros avanzados:**
- Categoría y subcategoría
- Rango de precio (slider)
- Dimensiones: ancho, alto, profundidad (rangos)
- Material principal: madera, metal, tela, piel, mixto
- Color (paleta visual)
- Estilo: moderno, clásico, rústico, industrial, minimalista, boho
- Disponibilidad: inmediata, 1-2 semanas, 3-4 semanas
- Calificación mínima
- Proveedor específico (para B2B)
- Con modelo 3D/AR disponible
- Ofertas y descuentos

**Ordenamiento:**
- Relevancia (default, basado en el usuario)
- Precio: menor a mayor / mayor a menor
- Más vendidos
- Mejor calificados
- Más recientes
- Tiempo de entrega más corto

#### 2.2 Fichas de Producto

**Información básica:**
- Nombre del producto
- SKU / código
- Descripción corta (para listados)
- Descripción larga (con formato rich text)
- Precio y precio anterior (si hay descuento)
- Disponibilidad y tiempo estimado

**Galería multimedia:**
- Mínimo 5 fotos de alta resolución
- Foto principal + secundarias
- Zoom al hover
- Vista 360° (si disponible)
- Video del producto (opcional)
- Modelo 3D interactivo

**Especificaciones técnicas:**
- Dimensiones exactas con diagrama
- Peso del producto
- Peso máximo soportado (para sillas, mesas, etc.)
- Materiales desglosados
- Colores disponibles
- Instrucciones de cuidado

**Información de envío:**
- Dimensiones del empaque
- Peso del empaque
- Número de cajas/bultos
- Requiere ensamblaje: sí/no
- Dificultad de ensamblaje: fácil/medio/difícil
- Tiempo estimado de ensamblaje

**Variantes:**
- Selector de color con preview de imagen
- Selector de tamaño con cambio de precio
- Selector de material/acabado
- Combinaciones disponibles

**Social proof:**
- Calificación promedio con distribución
- Número de reseñas
- Fotos de clientes
- Preguntas y respuestas

**Calls to action:**
- Agregar al carrito
- Comprar ahora
- Agregar a favoritos
- Ver en tu espacio (AR)
- Compartir
- Preguntar sobre este producto

#### 2.3 Carrito de Compras

**Funcionalidades:**
- Agregar/quitar productos
- Modificar cantidades
- Guardar para después
- Aplicar cupones de descuento
- Cálculo de envío en tiempo real

**Carrito multi-proveedor:**
- Agrupación visual por proveedor
- Indicador de envíos separados si aplica
- Opción de consolidar envío (si es posible)
- Subtotal por proveedor + total general

**Persistencia:**
- Carrito guardado en cuenta del usuario
- Carrito anónimo con cookie (30 días)
- Merge de carritos al iniciar sesión
- Sincronización entre dispositivos

**Abandono de carrito:**
- Detección de intención de salida
- Popup de retención con incentivo
- Email de recuperación (1h, 24h, 72h)
- Notificación push (si tiene app)

#### 2.4 Proceso de Checkout

**Paso 1 - Información de contacto:**
- Email
- Teléfono
- Crear cuenta o continuar como invitado

**Paso 2 - Dirección de entrega:**
- Direcciones guardadas (para usuarios registrados)
- Formulario de nueva dirección
- Autocompletado con Google Places
- Validación de cobertura de envío
- Instrucciones especiales de entrega
- Checkbox: misma dirección para facturación

**Paso 3 - Método de envío:**
- Opciones disponibles según dirección y productos
- Envío estándar (más económico)
- Envío express (más rápido)
- Recoger en punto de entrega
- Instalación incluida (si disponible)
- Fecha y horario preferido de entrega

**Paso 4 - Método de pago:**
- Tarjeta de crédito/débito (Visa, Mastercard, Diners, Amex)
- Yape / Plin (billeteras digitales - muy populares en Perú)
- Transferencia bancaria (BCP, Interbank, BBVA, Scotiabank)
- PagoEfectivo (pago en agentes, bodegas, Tambo, etc.)
- MercadoPago
- Cuotealo / Financiamiento (si califica)
- Tarjetas guardadas para usuarios registrados

**Paso 5 - Revisión y confirmación:**
- Resumen completo del pedido
- Términos y condiciones
- Checkbox de autorización
- Botón de confirmar compra

**Post-compra:**
- Página de confirmación con número de orden
- Email de confirmación detallado
- Instrucciones de siguiente paso
- CTA para crear cuenta (si fue invitado)

#### 2.5 Gestión de Órdenes

**Estados de orden:**
```
creada → pago_pendiente → pagada → en_fabricación →
lista_para_envío → en_tránsito → entregada → completada

                    ↘ cancelada (desde cualquier estado pre-envío)
                    ↘ devolución_solicitada → devolución_aprobada →
                      devolución_recibida → reembolsada
```

**Tracking para el cliente:**
- Timeline visual del estado
- Notificaciones por email y push en cada cambio
- Enlace de rastreo del transportista
- Chat con soporte desde la orden
- Opción de modificar/cancelar (según estado)

**Panel administrativo:**
- Lista de órdenes con filtros avanzados
- Vista detallada de cada orden
- Asignación manual de proveedor/transportista
- Notas internas
- Historial de cambios
- Gestión de incidencias

#### 2.6 Historial de Compras

**Para el cliente:**
- Lista de todas las compras
- Filtros por fecha, estado, monto
- Repetir compra con un clic
- Descargar factura
- Dejar reseña
- Solicitar soporte

**Para el administrador:**
- Historial por cliente
- Análisis de patrones de compra
- Valor de vida del cliente (LTV)
- Segmentación automática

---

### 3. Gestión de Transportistas

#### 3.1 Tipos de Transportistas y Niveles de Integración

**Matriz de tipos de transportistas:**

| Tipo | Integración | Tracking | Asignación | Ejemplo |
|------|-------------|----------|------------|---------|
| **API Integrado** | Automática | Tiempo real (API) | Automática | Olva, Shalom (si tienen API) |
| **Con App** | Semi-auto | Tiempo real (GPS app) | Automática | Transportistas que usan nuestra app |
| **Manual con WhatsApp** | Manual | Por hitos (WhatsApp) | Manual | Courier local, camionero independiente |
| **Manual básico** | Manual | Por hitos (llamada/panel) | Manual | Transportista sin smartphone |

**Descripción de cada tipo:**

1. **Transportistas con integración API:**
   - Empresas de courier con sistema propio
   - Tracking automático vía webhooks
   - Cotización y asignación automática
   - Ejemplo: Si Olva o Shalom exponen API

2. **Transportistas con nuestra App:**
   - Usan la app móvil de Hogar para transportistas
   - GPS tracking en tiempo real
   - Notificaciones push
   - Confirmación de entrega con foto y firma

3. **Transportistas manuales con WhatsApp:**
   - No tienen sistema, pero sí smartphone
   - Coordinación vía WhatsApp Business
   - Actualizan estado por mensaje o link especial
   - Envían foto de entrega por WhatsApp

4. **Transportistas manuales básicos:**
   - Sin smartphone o con uso limitado
   - Coordinación por llamada telefónica
   - Tú o tu equipo actualizan el estado en el panel
   - Confirmación de entrega por llamada

#### 3.2 Registro y Onboarding

**Registro por el administrador (tú):**
- Alta manual desde el panel de admin
- No requiere que el transportista se registre solo
- Campos mínimos: nombre, teléfono, tipo de vehículo, zonas
- Documentación opcional pero recomendada

**Documentación requerida (ideal):**
- DNI vigente
- Brevete (licencia de conducir) categoría apropiada
- Tarjeta de propiedad vehicular
- SOAT vigente
- Revisión técnica vigente
- RUC (para facturación) o recibo por honorarios
- Fotos del vehículo
- Antecedentes policiales (opcional)

**Documentación mínima (para empezar):**
- Nombre completo
- DNI (solo número, verificación opcional)
- Teléfono / WhatsApp
- Tipo de vehículo y capacidad aproximada
- Foto del vehículo (opcional)
- Zonas que cubre

**Verificación:**
- Validación de documentos (cuando los tenga)
- Verificación de antecedentes (opcional)
- Período de prueba con pocas entregas
- Capacitación básica en manejo de muebles (video o presencial)

#### 3.3 Gestión Manual de Transportistas (Sin Sistema)

**Panel de administración para transportistas manuales:**

```
┌─────────────────────────────────────────────────────────────┐
│  TRANSPORTISTAS MANUALES                        [+ Agregar] │
├─────────────────────────────────────────────────────────────┤
│ 🟢 Juan Pérez      │ Camioneta │ Lima Norte    │ Disponible │
│ 🟡 Carlos Ruiz     │ Camión 3t │ Lima Sur      │ En entrega │
│ 🔴 María López     │ Van       │ Todo Lima     │ No disponible│
│ 🟢 Pedro Sánchez   │ Camioneta │ Villa El Salv.│ Disponible │
└─────────────────────────────────────────────────────────────┘
```

**Flujo de asignación manual:**

1. **Nueva orden lista para envío:**
   - Sistema notifica al admin (tú)
   - Muestra origen (proveedor) y destino (cliente)
   - Sugiere transportistas disponibles en la zona

2. **Selección de transportista:**
   - Eliges manualmente del listado
   - Ves su historial, rating, disponibilidad
   - Sistema calcula tarifa estimada

3. **Coordinación:**
   - Click en "Contactar por WhatsApp" → abre chat con mensaje pre-armado
   - O click en "Llamar" → marca el número
   - Confirmas disponibilidad verbalmente

4. **Registro de acuerdo:**
   - Marcas "Asignado" en el sistema
   - Ingresas fecha/hora acordada
   - Ingresas tarifa acordada (puede ser diferente a la sugerida)

5. **Seguimiento:**
   - Actualizas estados manualmente:
     - `asignado` → `en_camino_a_recoger` → `recogido` → `en_tránsito` → `entregado`
   - O el transportista actualiza vía link de WhatsApp

**Mensajes pre-armados para WhatsApp:**

```
📦 *Nueva entrega disponible*

Hola [Nombre], tengo un envío para ti:

📍 *Recoger en:* [Dirección proveedor]
   Contacto: [Nombre] - [Teléfono]

🏠 *Entregar en:* [Dirección cliente]
   Contacto: [Nombre] - [Teléfono]

📐 *Producto:* [Descripción]
   Dimensiones: [LxAxA] - Peso: [X] kg

💰 *Pago:* S/ [Monto]

📅 *Fecha deseada:* [Fecha]

¿Puedes tomarlo? Responde SÍ o NO
```

**Link de actualización para transportista (sin app):**

- Se genera un link único por envío: `hogar.pe/e/ABC123`
- El transportista abre en su celular (no necesita app)
- Ve los detalles del envío
- Botones grandes para actualizar estado:
  - [Ya recogí el producto]
  - [Estoy en camino al cliente]
  - [Ya entregué] → pide foto
- Funciona como mini-app web (PWA)

**Integración con WhatsApp Business API (opcional futuro):**

- Bot que recibe mensajes del transportista
- "Recogido" → actualiza estado automáticamente
- Recibe foto → la adjunta al envío
- "Entregado" → marca como completado

#### 3.4 Gestión de Vehículos

**Registro de vehículos:**
- Tipo: moto, auto, camioneta, van, camión 3.5t, camión 5t+
- Marca, modelo, año
- Placas
- Dimensiones de carga (largo x ancho x alto)
- Capacidad de peso
- Características especiales: rampa, grúa, clima

**Matriz de capacidad:**
| Tipo vehículo | Capacidad m³ | Peso máx | Ejemplo de carga |
|---------------|--------------|----------|------------------|
| Auto | 0.5 m³ | 50 kg | Sillas pequeñas, decoración |
| Camioneta | 2 m³ | 300 kg | Mesa pequeña, sillas |
| Van | 6 m³ | 800 kg | Sofá 2 plazas, comedor 4 |
| Camión 3.5t | 15 m³ | 1,500 kg | Recámara completa |
| Camión 5t+ | 25+ m³ | 3,000+ kg | Mudanza completa |

#### 3.5 Zonas de Operación

**Configuración:**
- Zonas donde opera (por código postal o polígono)
- Zona base (donde inicia el día)
- Radio máximo de operación
- Zonas excluidas

**Tarifas:**
- Tarifa base por zona
- Tarifa por km adicional
- Tarifa por peso/volumen
- Recargos: horario especial, fin de semana, piso alto sin elevador
- Descuentos por volumen

#### 3.6 Disponibilidad y Calendario

**Gestión de horarios:**
- Días de operación por semana
- Horarios por día
- Bloqueo de fechas (vacaciones, mantenimiento)
- Capacidad diaria de entregas

**Sistema de reservas:**
- Slots de tiempo disponibles
- Reserva automática al confirmar orden
- Buffer entre entregas
- Overbooking controlado

#### 3.7 Tracking (Según Nivel de Integración)

**Tracking por tipo de transportista:**

| Tipo | Tracking disponible | Cómo funciona |
|------|---------------------|---------------|
| API Integrado | Tiempo real + mapa | Webhook automático del courier |
| Con App | Tiempo real + mapa | GPS de nuestra app |
| Manual WhatsApp | Por hitos | Link web o mensaje |
| Manual básico | Por hitos | Admin actualiza manualmente |

**Para el cliente (vista adaptativa):**

*Si hay tracking en tiempo real:*
- Mapa con ubicación del transportista
- ETA actualizado dinámicamente
- Notificación cuando está cerca (10 min)

*Si es tracking por hitos:*
- Timeline con estados: Asignado → Recogido → En camino → Entregado
- Hora de última actualización
- Mensaje: "El transportista confirmó que recogió tu pedido a las 3:45 PM"

**Para el administrador:**
- Vista unificada de todos los envíos (automáticos y manuales)
- Filtro por tipo de tracking
- Alertas de envíos sin actualización en X horas
- Botón rápido para contactar transportista
- Actualización manual de estados con un click

**Panel de control de envíos:**
```
┌────────────────────────────────────────────────────────────────────┐
│ ENVÍOS DEL DÍA                                    [Filtrar] [+]   │
├────────────────────────────────────────────────────────────────────┤
│ #1234 │ 🟢 GPS    │ Juan P.   │ En tránsito │ Miraflores  │ 14:30 │
│ #1235 │ 🟡 Manual │ Carlos R. │ Recogido    │ Surco       │ 15:00 │
│ #1236 │ 🟡 Manual │ María L.  │ ⚠️ Sin actualizar 3h │ SJL  │ 12:00 │
│ #1237 │ 🔵 API    │ Olva      │ En tránsito │ La Molina   │ 16:00 │
└────────────────────────────────────────────────────────────────────┘
        [📞 Llamar] [💬 WhatsApp] [✏️ Actualizar estado]
```

**Contacto directo:**
- Click para llamar al transportista
- Click para abrir WhatsApp con mensaje contextual
- Historial de comunicaciones

#### 3.8 Sistema de Calificación de Transportistas

**Métricas automáticas:**
- Puntualidad (llegada dentro de ventana)
- Tiempo de entrega vs estimado
- Tasa de entregas exitosas al primer intento
- Incidencias reportadas

**Calificación del cliente:**
- Puntualidad (1-5)
- Cuidado del producto (1-5)
- Amabilidad (1-5)
- Presentación personal (1-5)

**Score compuesto:**
```
score_transportista = (
  puntualidad * 0.30 +
  entregas_exitosas * 0.25 +
  cuidado_producto * 0.25 +
  amabilidad * 0.15 +
  presentacion * 0.05
)
```

**Consecuencias:**
- Score < 3.5: Alerta y revisión
- Score < 3.0: Suspensión temporal
- Score < 2.5: Desactivación
- Score > 4.5: Bonus y prioridad de asignación

#### 3.9 Panel del Transportista (App Móvil y Web)

**Opción A: App Móvil Completa (transportistas frecuentes)**

Funcionalidades:
- Ver entregas asignadas del día
- Navegación integrada (Google Maps/Waze)
- Confirmar recogida en proveedor
- Confirmar entrega con:
  - Foto del producto entregado
  - Firma digital del cliente
  - Notas de entrega
- Reportar incidencia
- Ver historial de entregas
- Ver ganancias y pagos
- Notificaciones push de nuevos envíos

**Opción B: Mini Web App (transportistas ocasionales/manuales)**

Link único por envío: `hogar.pe/e/ABC123`

```
┌─────────────────────────────────────┐
│         🚚 ENVÍO #1234              │
├─────────────────────────────────────┤
│                                     │
│  📍 RECOGER EN:                     │
│  Av. Los Artesanos 234, VES         │
│  Contacto: Muebles García           │
│  📞 987-654-321                     │
│  [🗺️ Ver en mapa]                   │
│                                     │
│  🏠 ENTREGAR EN:                    │
│  Jr. Las Flores 567, Miraflores     │
│  Contacto: Ana Rodríguez            │
│  📞 999-888-777                     │
│  [🗺️ Ver en mapa]                   │
│                                     │
│  📦 PRODUCTO:                       │
│  Sofá 3 cuerpos gris                │
│  180 x 85 x 90 cm - 45 kg           │
│                                     │
├─────────────────────────────────────┤
│  ACTUALIZAR ESTADO:                 │
│                                     │
│  [  ✅ YA RECOGÍ EL PRODUCTO  ]     │
│                                     │
│  [  🚗 ESTOY EN CAMINO         ]     │
│                                     │
│  [  📸 YA ENTREGUÉ (+ foto)    ]     │
│                                     │
│  [  ⚠️ REPORTAR PROBLEMA       ]     │
│                                     │
└─────────────────────────────────────┘
```

- No requiere instalar app
- Funciona en cualquier celular con navegador
- Botones grandes, fácil de usar
- Permite subir foto de entrega
- Se guarda en el historial del transportista

**Opción C: Solo WhatsApp (mínima fricción)**

- El admin envía detalles por WhatsApp
- Transportista responde con:
  - "Recogido" → se actualiza el estado
  - Foto de entrega → se adjunta al pedido
  - "Entregado" → se marca como completado
- Puede integrarse con WhatsApp Business API para automatizar

#### 3.10 Pagos a Transportistas

**Métodos de pago:**
- Yape/Plin (inmediato, preferido por independientes)
- Transferencia bancaria (semanal para flotillas)
- Efectivo (al momento de entrega, descontado del cobro)

**Liquidación:**
- Transportistas con app: liquidación automática semanal
- Transportistas manuales: pago acordado por envío

**Registro de pagos:**
- Historial de pagos realizados
- Comprobantes de pago (captura de Yape, voucher)
- Deuda pendiente por transportista

---

### 4. Motor de Matching Inteligente

#### 4.1 Algoritmo de Selección de Proveedor

**Inputs del algoritmo:**
- Producto(s) solicitado(s)
- Dirección de entrega del cliente
- Fecha deseada de entrega
- Preferencias del cliente (si las hay)

**Factores de scoring:**

```python
def calcular_score_proveedor(proveedor, orden):
    score = 0

    # Disponibilidad (eliminatorio)
    if not proveedor.tiene_producto(orden.productos):
        return -1

    # Distancia (0-25 puntos)
    distancia = calcular_distancia(proveedor.ubicacion, orden.direccion)
    score += max(0, 25 - (distancia / 10))  # -1 punto por cada 10km

    # Tiempo de entrega (0-25 puntos)
    dias_fabricacion = proveedor.dias_fabricacion(orden.productos)
    if dias_fabricacion == 0:  # En stock
        score += 25
    else:
        score += max(0, 25 - (dias_fabricacion * 2))

    # Rating del proveedor (0-20 puntos)
    score += proveedor.rating * 4  # Rating de 1-5 → 4-20 puntos

    # Precio competitivo (0-15 puntos)
    precio = proveedor.precio(orden.productos)
    precio_promedio = obtener_precio_promedio(orden.productos)
    diferencia_pct = (precio_promedio - precio) / precio_promedio
    score += min(15, max(0, diferencia_pct * 100))

    # Historial con cliente (0-10 puntos)
    if cliente.ha_comprado_de(proveedor):
        satisfaccion = cliente.satisfaccion_con(proveedor)
        score += satisfaccion * 2

    # Capacidad actual (0-5 puntos)
    carga_actual = proveedor.ordenes_pendientes / proveedor.capacidad
    score += (1 - carga_actual) * 5

    return score
```

**Output:**
- Lista rankeada de proveedores
- Score y desglose por cada uno
- Recomendación destacada
- Opción de override manual

#### 4.2 Algoritmo de Selección de Transportista

**Inputs:**
- Ubicación del proveedor (origen)
- Ubicación del cliente (destino)
- Dimensiones y peso del envío
- Fecha/hora deseada
- Servicios adicionales (ensamblaje, piso alto, etc.)

**Factores de scoring:**

```python
def calcular_score_transportista(transportista, envio):
    score = 0

    # Capacidad del vehículo (eliminatorio)
    if not transportista.puede_transportar(envio.dimensiones, envio.peso):
        return -1

    # Cobertura de zona (eliminatorio)
    if not transportista.cubre_zona(envio.destino):
        return -1

    # Disponibilidad en fecha (eliminatorio)
    if not transportista.disponible_en(envio.fecha):
        return -1

    # Proximidad al origen (0-20 puntos)
    distancia_origen = calcular_distancia(transportista.ubicacion, envio.origen)
    score += max(0, 20 - distancia_origen)

    # Eficiencia de ruta (0-20 puntos)
    # Si ya tiene entregas en la zona, es más eficiente
    entregas_cercanas = transportista.entregas_cerca_de(envio.destino, envio.fecha)
    score += min(20, entregas_cercanas * 5)

    # Rating (0-20 puntos)
    score += transportista.rating * 4

    # Precio (0-20 puntos)
    precio = transportista.cotizar(envio)
    precio_promedio = obtener_precio_promedio_envio(envio)
    diferencia_pct = (precio_promedio - precio) / precio_promedio
    score += min(20, max(0, diferencia_pct * 100))

    # Experiencia con tipo de producto (0-10 puntos)
    entregas_similares = transportista.entregas_de_categoria(envio.categoria)
    score += min(10, entregas_similares / 10)

    # Servicios adicionales (0-10 puntos)
    if envio.requiere_ensamblaje and transportista.ofrece_ensamblaje:
        score += 5
    if envio.piso_alto and transportista.tiene_equipo_carga:
        score += 5

    return score
```

#### 4.3 Optimización de Rutas

**Consolidación de entregas:**
- Agrupar entregas del mismo día en la misma zona
- Calcular ruta óptima (TSP - Traveling Salesman Problem)
- Asignar slots de tiempo coherentes con la ruta

**Algoritmo de ruteo:**
- Google OR-Tools para optimización
- Considerar ventanas de tiempo
- Considerar capacidad del vehículo
- Minimizar distancia total
- Balancear carga entre transportistas

**Visualización:**
- Mapa con rutas del día
- Orden de paradas
- Tiempos estimados
- Alertas de conflictos

#### 4.4 Matching Automático vs Manual

**Modo automático (para transportistas con API/App):**
- Sistema asigna mejor opción automáticamente
- Notificación push/email al transportista
- Confirmación requerida en X horas
- Fallback a siguiente opción si no confirma
- Ideal para: couriers integrados, transportistas frecuentes con app

**Modo semi-automático (recomendado para inicio):**
- Sistema sugiere top 3-5 transportistas disponibles
- Muestra: distancia, rating, precio estimado, disponibilidad
- Tú seleccionas el mejor
- Sistema genera mensaje pre-armado para contactar
- Ideal para: mezcla de transportistas manuales y automáticos

**Modo 100% manual (para transportistas sin sistema):**
- Ves lista de todos tus transportistas
- Filtras por zona, tipo de vehículo, disponibilidad
- Seleccionas libremente
- Coordinas por WhatsApp/llamada
- Registras la asignación y tarifa acordada en el sistema
- Ideal para: transportistas locales de confianza, casos especiales

**Flujo recomendado para el MVP:**

```
Nueva orden lista para envío
         │
         ▼
┌─────────────────────────────────┐
│  ¿Hay transportistas con API    │
│  disponibles en la zona?        │
└─────────────────────────────────┘
         │
    Sí   │   No
         │
    ▼         ▼
┌──────────┐  ┌──────────────────────┐
│ Asignar  │  │ Mostrar transportistas│
│ automát. │  │ manuales disponibles  │
└──────────┘  └──────────────────────┘
                      │
                      ▼
              ┌──────────────────┐
              │ Admin selecciona │
              │ y contacta       │
              └──────────────────┘
                      │
                      ▼
              ┌──────────────────┐
              │ Registra acuerdo │
              │ en el sistema    │
              └──────────────────┘
```

**Panel de asignación:**

```
┌────────────────────────────────────────────────────────────────┐
│  ASIGNAR TRANSPORTISTA - Orden #1234                          │
├────────────────────────────────────────────────────────────────┤
│  📍 Origen: Villa El Salvador → 🏠 Destino: Miraflores        │
│  📦 Sofá 3 cuerpos (180x85x90 cm, 45 kg)                      │
│  📅 Fecha deseada: Mañana 2-6 PM                              │
├────────────────────────────────────────────────────────────────┤
│  TRANSPORTISTAS SUGERIDOS:                                     │
│                                                                │
│  ⭐ Juan Pérez       │ Van     │ 4.8★ │ S/45  │ [WhatsApp] [📞]│
│     "Muy puntual, conoce la zona"                             │
│                                                                │
│  ○ Carlos Ruiz      │ Camioneta│ 4.5★ │ S/50  │ [WhatsApp] [📞]│
│     "Disponible mañana AM"                                    │
│                                                                │
│  ○ Transportes Lima │ Camión  │ 4.2★ │ S/60  │ [WhatsApp] [📞]│
│     "Integrado con API"                                       │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  Tarifa acordada: [S/ ____]   Fecha/hora: [__/__  __:__]      │
│                                                                │
│  [Cancelar]                        [✓ Confirmar asignación]   │
└────────────────────────────────────────────────────────────────┘
```

---

### 5. Sistema de Personalización con IA

#### 5.1 Construcción del Perfil de Usuario

**Datos explícitos (proporcionados por usuario):**
- Cuestionario inicial de preferencias:
  - Estilos que te gustan (selección múltiple con imágenes)
  - Colores favoritos (paleta visual)
  - Presupuesto típico por pieza
  - Tamaño de tu hogar
  - Prioridades: precio, calidad, diseño, rapidez

**Datos implícitos (comportamiento):**
- Productos vistos (tiempo en página)
- Productos agregados a favoritos
- Productos agregados al carrito
- Productos comprados
- Búsquedas realizadas
- Filtros más usados
- Interacciones con AR
- Reseñas dejadas

**Procesamiento:**
```python
class PerfilUsuario:
    # Vectores de preferencia (embeddings)
    estilo_preferido: Vector  # [moderno: 0.8, rustico: 0.1, ...]
    colores_preferidos: Vector
    materiales_preferidos: Vector
    rango_precio: Tuple[float, float]

    # Métricas de engagement
    categorias_interes: Dict[str, float]
    marcas_favoritas: List[str]
    sensibilidad_precio: float  # 0-1

    # Contexto
    tipo_vivienda: str  # casa, depto, oficina
    etapa_vida: str  # soltero, pareja, familia
    ubicacion: str
```

#### 5.2 Motor de Recomendaciones

**Algoritmos combinados:**

1. **Filtrado colaborativo:**
   - "Usuarios similares a ti también compraron..."
   - Matriz de usuarios × productos
   - Similitud por coseno entre usuarios

2. **Filtrado basado en contenido:**
   - "Basado en productos que te gustaron..."
   - Embeddings de productos
   - Similitud con historial del usuario

3. **Recomendaciones contextuales:**
   - Temporada (muebles de exterior en primavera)
   - Ubicación (productos disponibles en su zona)
   - Hora del día (navegación nocturna = más exploratoria)

4. **Complementos:**
   - "Completa el look con..."
   - Reglas de asociación (mesa → sillas)
   - Sets pre-armados

**Ubicaciones de recomendaciones:**
- Homepage personalizada
- "Podría gustarte" en fichas de producto
- "Frecuentemente comprados juntos"
- Email de recomendaciones semanales
- Post-compra: complementos

#### 5.3 Búsqueda Semántica con IA

**Capacidades:**
- Entender lenguaje natural
- Interpretar descripciones vagas
- Manejar sinónimos y variaciones
- Corregir errores de escritura

**Ejemplos de queries:**
| Input del usuario | Interpretación |
|------------------|----------------|
| "sofá para depa chico" | Sofás compactos, < 1.8m |
| "mesa para 6 que no sea muy cara" | Mesas 6+ personas, ordenar por precio |
| "algo moderno para mi oficina en casa" | Escritorios/sillas estilo moderno |
| "silla cómoda para trabajar muchas horas" | Sillas ergonómicas, alta calificación comodidad |
| "mueble para guardar cosas en la entrada" | Recibidores, zapateras, percheros |

**Implementación:**
- Embeddings de productos (OpenAI/Cohere)
- Embeddings de queries
- Búsqueda por similitud vectorial
- Re-ranking con modelo de relevancia
- Fallback a búsqueda tradicional

#### 5.4 Asistente Virtual (Chatbot)

**Capacidades:**
- Responder preguntas sobre productos
- Ayudar a encontrar el mueble ideal
- Guiar en el proceso de compra
- Resolver dudas de envío y pagos
- Escalar a humano cuando sea necesario

**Flujos conversacionales:**
```
Usuario: "Busco un sofá"
Bot: "¡Genial! Para ayudarte mejor, ¿podrías decirme:
      - ¿Para cuántas personas?
      - ¿Tienes preferencia de color o material?
      - ¿Cuál es tu presupuesto aproximado?"

Usuario: "Para 3 personas, gris, máximo S/ 5,000"
Bot: "Encontré 24 sofás que podrían gustarte.
      Te muestro los 3 mejor calificados:
      [Muestra productos]
      ¿Te gustaría ver más opciones o filtrar por algo específico?"
```

**Tecnología:**
- LangChain para orquestación
- Claude/GPT para generación
- RAG con catálogo de productos
- Memoria de conversación
- Handoff a agente humano

---

### 6. Generación de Muebles con IA

#### 6.1 Interfaz de Prompts

**Flujo del usuario:**
1. Accede a "Crea tu mueble ideal"
2. Describe lo que imagina en texto libre
3. Opcionalmente sube imagen de referencia
4. Sistema genera opciones visuales
5. Usuario refina con feedback
6. Usuario guarda diseño o busca similares

**Ejemplos de prompts:**
- "Una mesa de centro redonda de madera con patas metálicas negras, estilo industrial"
- "Un librero alto para pared, con espacio para decoración, madera clara"
- "Silla de comedor tapizada en terciopelo verde, patas de madera"

**Asistencia en el prompt:**
- Sugerencias de completado
- Preguntas guiadas si el prompt es vago
- Templates por categoría
- Ejemplos de prompts exitosos

#### 6.2 Generación de Imágenes

**Pipeline:**
```
Prompt usuario → Enrichment → Generación → Post-proceso → Display

1. Enrichment:
   - Agregar detalles de estilo si faltan
   - Especificar ángulo de vista
   - Agregar contexto de habitación

2. Generación:
   - DALL-E 3 / Stable Diffusion / Midjourney
   - Múltiples variantes (4 opciones)
   - Diferentes ángulos del mismo diseño

3. Post-proceso:
   - Remover fondo si es necesario
   - Ajustar iluminación
   - Generar vista 360 (opcional)
```

**Outputs:**
- 4 variantes del diseño
- Vista frontal, lateral, perspectiva
- Con y sin contexto de habitación
- Opción de generar modelo 3D (futuro)

#### 6.3 Refinamiento Iterativo

**Interfaz de feedback:**
- "Me gusta pero..."
- Sliders: más moderno ↔ más clásico
- Cambiar color específico
- Ajustar proporciones
- Agregar/quitar elementos

**Historial de versiones:**
- Guardar cada iteración
- Comparar lado a lado
- Volver a versión anterior
- Branching de ideas

#### 6.4 Matching con Catálogo

**Proceso:**
1. Extraer características del diseño generado:
   - Categoría de mueble
   - Estilo detectado
   - Colores principales
   - Materiales aparentes
   - Forma general

2. Búsqueda en catálogo:
   - Similitud visual (embeddings de imagen)
   - Similitud de atributos
   - Ranking por coincidencia

3. Presentación:
   - "Encontramos estos productos similares a tu diseño"
   - Porcentaje de similitud
   - Diferencias principales
   - Precio y disponibilidad

#### 6.5 Solicitud de Fabricación Personalizada

**Flujo:**
1. Usuario no encuentra similar en catálogo
2. Opción: "Solicitar fabricación de este diseño"
3. Formulario adicional:
   - Dimensiones deseadas
   - Materiales preferidos
   - Presupuesto máximo
   - Fecha límite si la hay
4. Envío a proveedores seleccionados
5. Proveedores responden con cotización
6. Usuario elige y procede

**Para proveedores:**
- Notificación de solicitud personalizada
- Imagen generada + especificaciones
- Responder con:
  - Factibilidad (sí/no/con modificaciones)
  - Precio estimado
  - Tiempo de fabricación
  - Fotos de trabajos similares

---

### 7. Realidad Aumentada (AR)

#### 7.1 Visualización en Espacio

**Tecnologías soportadas:**
- **WebAR**: Funciona en navegador (iOS Safari, Chrome Android)
- **App nativa**: Para mejor experiencia (ARKit/ARCore)
- **8th Wall**: Solución híbrida cross-platform

**Flujo de usuario:**
1. En ficha de producto, click "Ver en tu espacio"
2. Acepta permisos de cámara
3. Escanea el piso (detección de superficie)
4. Mueble aparece en escala real
5. Toca para mover/rotar
6. Pinch para escalar (con advertencia de escala real)

#### 7.2 Características de AR

**Escala real:**
- Dimensiones exactas del producto
- Indicador visual de tamaño (regla virtual)
- Advertencia si se modifica escala

**Manipulación:**
- Mover arrastrando
- Rotar con dos dedos
- Cambiar variante de color en tiempo real
- Múltiples productos simultáneos

**Iluminación:**
- Detección de luz ambiente
- Sombras realistas
- Reflejos básicos

**Oclusión (avanzado):**
- Mueble detrás de objetos reales
- Detección de paredes/obstáculos

#### 7.3 Captura y Compartir

**Funcionalidades:**
- Tomar foto del mueble en el espacio
- Grabar video corto
- Guardar en galería
- Compartir en redes sociales
- Enviar por WhatsApp

**Metadata:**
- Foto incluye link al producto
- Watermark sutil de la marca
- Información del producto en la imagen

#### 7.4 Medición de Espacios

**Herramienta de medición:**
- Medir distancias con AR
- Guardar medidas del espacio
- Verificar si el mueble cabe
- Sugerir productos que sí caben

**Integración con recomendaciones:**
- "Tu espacio mide 3m de ancho"
- "Te mostramos sofás de hasta 2.8m"

#### 7.5 Experiencia Multi-Producto

**Room planner AR:**
- Agregar múltiples muebles
- Crear composición completa
- Guardar "escena"
- Agregar toda la escena al carrito

**Sets pre-armados:**
- "Sala completa" con sofá, mesa, mueble TV
- Visualizar todo junto
- Descuento por compra de set

---

## Features Adicionales

---

### 8. Sistema de Financiamiento

#### 8.1 Opciones de Financiamiento

**Meses sin intereses (MSI):**
- 3, 6, 12, 18 meses
- Con tarjetas participantes
- Sin costo adicional para el cliente
- Costo absorbido por la plataforma (negociado con bancos)

**Crédito directo:**
- Para clientes sin tarjeta de crédito
- Verificación crediticia rápida
- Aprobación en minutos
- Pagos semanales o quincenales

**Apartado:**
- Reservar producto con anticipo (20-30%)
- Pagos parciales hasta completar
- Producto se envía al liquidar
- Plazo máximo: 3 meses

#### 8.2 Simulador de Pagos

**Calculadora interactiva:**
- Monto del producto
- Selección de plazo
- Muestra pago mensual/semanal
- CAT y costo total
- Fecha de primer pago

**En ficha de producto:**
- "Desde S/ X/mes" destacado
- Desglose al hacer hover

#### 8.3 Verificación Crediticia

**Integración con centrales de riesgo (Perú):**
- Sentinel Perú
- Equifax Perú (Infocorp)
- Experian Perú
- Score mínimo configurable
- Verificación en < 1 minuto

**Documentación digital:**
- DNI (OCR + validación con RENIEC)
- Boletas de pago o recibos por honorarios
- Recibo de servicios (luz, agua, teléfono)
- Todo desde el celular

#### 8.4 Gestión de Cobranza

**Para el cliente:**
- Dashboard de créditos activos
- Próximos pagos
- Historial de pagos
- Pagar anticipadamente

**Para administración:**
- Cartera de créditos
- Pagos vencidos
- Proceso de cobranza:
  - Recordatorios automáticos
  - Contacto por WhatsApp/SMS
  - Escalamiento a cobranza externa

---

### 9. Configurador de Espacios

#### 9.1 Room Planner 2D

**Creación del espacio:**
- Dibujar habitación con dimensiones
- Templates de formas comunes
- Agregar puertas y ventanas
- Subir plano existente (imagen)
- Detección automática de plano con IA

**Biblioteca de muebles:**
- Vista superior de cada producto
- Escala correcta
- Drag & drop al plano
- Snap a paredes y otros muebles

**Herramientas:**
- Medir distancias
- Rotar muebles
- Duplicar
- Alinear
- Distribuir uniformemente

#### 9.2 Visualización 3D

**Render del espacio:**
- Conversión de plano 2D a 3D
- Recorrido virtual (first person)
- Vista de pájaro
- Cambiar hora del día (iluminación)

**Materiales y acabados:**
- Seleccionar color de paredes
- Tipo de piso
- Iluminación ambiental

#### 9.3 Sugerencias Inteligentes

**IA de diseño:**
- "Este sofá es muy grande para el espacio"
- "Considera agregar una mesa lateral aquí"
- "El flujo de circulación está bloqueado"
- "Productos complementarios que combinan"

**Auto-diseño:**
- Indicar tipo de habitación y presupuesto
- IA genera propuesta completa
- Múltiples estilos a elegir
- Ajustar manualmente después

#### 9.4 Guardar y Compartir

**Proyectos:**
- Guardar múltiples diseños
- Nombrar y organizar
- Versiones de cada diseño
- Compartir con link

**Colaboración:**
- Invitar a otros a editar
- Comentarios en el diseño
- Ideal para parejas/familias decidiendo

#### 9.5 Conversión a Compra

**Lista de compras:**
- Ver todos los productos del diseño
- Precio total del proyecto
- Agregar todo al carrito
- Quitar items individuales

**Cotización formal:**
- Generar PDF con el diseño
- Desglose de productos y precios
- Válido por X días
- Compartir con quien aprueba presupuesto

---

### 10. Sistema de Subastas y Ofertas

#### 10.1 Subastas Inversas

**Concepto:**
- Cliente publica qué necesita
- Proveedores compiten con ofertas
- Cliente elige la mejor

**Flujo:**
1. Cliente crea solicitud:
   - Descripción del mueble
   - Especificaciones/medidas
   - Presupuesto máximo
   - Fecha límite de subasta
   - Fecha deseada de entrega

2. Proveedores ven solicitudes abiertas:
   - Filtrar por categoría/zona
   - Ver detalles de solicitud
   - Enviar propuesta con precio y tiempo

3. Cliente revisa propuestas:
   - Comparar ofertas
   - Ver perfil y rating de proveedores
   - Hacer preguntas
   - Aceptar una oferta

4. Conversión a orden normal

#### 10.2 Ofertas Flash

**Mecánica:**
- Descuentos por tiempo limitado (24-72h)
- Countdown visible
- Stock limitado
- Urgencia real

**Tipos:**
- Oferta del día (1 producto destacado)
- Happy hour (descuento en categoría)
- Weekend sale
- Ofertas relámpago (2h)

**Notificaciones:**
- Push a usuarios interesados en la categoría
- Email de ofertas del día
- Banner en homepage

#### 10.3 Liquidaciones

**Sección permanente:**
- Productos descontinuados
- Últimas piezas
- Muestras de piso
- Productos con empaque dañado
- Devoluciones reacondicionadas

**Transparencia:**
- Indicar razón del descuento
- Fotos reales del producto (si aplica)
- Política de devolución diferenciada

#### 10.4 Negociación Directa

**Para compras grandes:**
- Botón "Negociar precio" en productos seleccionados
- Chat con vendedor/proveedor
- Contraofertas
- Descuento por pago inmediato

---

### 11. Muebles de Segunda Mano

#### 11.1 Marketplace C2C

**Publicar un mueble:**
- Categoría y descripción
- Fotos (mínimo 3)
- Dimensiones
- Condición: excelente, bueno, regular
- Precio deseado
- Ubicación

**Moderación:**
- Revisión de publicaciones
- Rechazar contenido inapropiado
- Verificar que sea mueble real

**Transacción:**
- Chat entre comprador y vendedor
- Pago a través de la plataforma (escrow)
- Opción de envío o punto de encuentro

#### 11.2 Programa de Recompra

**Trade-in:**
1. Usuario quiere renovar mueble
2. Describe/fotografía el mueble actual
3. Sistema estima valor de recompra
4. Valor se aplica como descuento en compra nueva
5. Logística de recolección incluida

**Destino del mueble recomprado:**
- Reacondicionamiento y reventa
- Donación a fundaciones
- Reciclaje responsable

#### 11.3 Reacondicionamiento

**Proceso:**
- Inspección al recibir
- Limpieza profesional
- Reparaciones menores
- Fotos nuevas
- Certificación de calidad

**Niveles de condición:**
| Nivel | Descripción | Descuento típico |
|-------|-------------|------------------|
| Como nuevo | Sin uso visible | 20-30% |
| Excelente | Mínimo uso, sin defectos | 30-40% |
| Muy bueno | Uso normal, defectos menores | 40-50% |
| Bueno | Uso visible, funcional | 50-60% |

#### 11.4 Sostenibilidad

**Badges y certificaciones:**
- "Compra consciente" en productos usados
- Huella de carbono ahorrada
- Certificación de reciclaje
- Proveedores con madera sustentable

**Impacto visible:**
- "Con esta compra ahorraste X kg de CO2"
- Contador global de impacto de la comunidad
- Ranking de compradores eco-friendly

---

### 12. Programa de Lealtad

#### 12.1 Sistema de Puntos

**Acumulación:**
- 1 punto por cada S/ 10 de compra
- Puntos bonus en promociones
- Puntos por acciones:
  - Completar perfil: 50 puntos
  - Primera reseña: 30 puntos
  - Referir amigo: 100 puntos
  - Compra en categoría nueva: 20 puntos

**Canje:**
- Descuento directo: 100 puntos = S/ 10
- Envío gratis: 200 puntos
- Productos exclusivos
- Experiencias (consulta con diseñador)

#### 12.2 Niveles de Membresía

| Nivel | Requisito | Beneficios |
|-------|-----------|------------|
| **Bronce** | Registro | Acumulación básica, ofertas exclusivas |
| **Plata** | S/ 3,000 en compras o 1 año | 1.5x puntos, envío gratis > S/ 500, acceso early a ofertas |
| **Oro** | S/ 10,000 en compras o 2 años | 2x puntos, envío gratis siempre, soporte prioritario, devoluciones extendidas |
| **Platino** | S/ 25,000 en compras o invitación | 3x puntos, consultor personal, productos exclusivos, eventos VIP |

#### 12.3 Programa de Referidos

**Mecánica:**
- Usuario comparte código único
- Amigo obtiene 10% en primera compra
- Usuario obtiene 10% de la compra como crédito
- Sin límite de referidos

**Tracking:**
- Dashboard de referidos
- Estado de cada referido
- Ganancias acumuladas
- Link personalizado para redes sociales

#### 12.4 Cashback

**Alternativa a puntos:**
- X% de vuelta en cada compra
- Acumula en "monedero virtual"
- Usar en próximas compras
- Sin fecha de expiración

---

### 13. Servicio de Diseño de Interiores

#### 13.1 Consultas Virtuales

**Tipos de consulta:**
- **Express (30 min, gratis)**: Asesoría básica, recomendaciones generales
- **Estándar (1 hora, S/ 150)**: Análisis del espacio, propuesta inicial
- **Premium (2+ horas, S/ 350)**: Diseño completo, múltiples propuestas

**Proceso:**
1. Agendar cita en calendario
2. Subir fotos/videos del espacio
3. Cuestionario de preferencias
4. Videollamada con diseñador
5. Recibir propuesta post-consulta

#### 13.2 Propuestas Personalizadas

**Entregables:**
- Moodboard de estilo
- Plano con distribución propuesta
- Render 3D del espacio
- Lista de productos recomendados
- Presupuesto desglosado

**Iteraciones:**
- Feedback sobre propuesta
- Ajustes incluidos (según paquete)
- Versión final aprobada

#### 13.3 Paquetes Completos

**"Amuebla tu...":**
- Sala desde S/ 3,500
- Recámara desde S/ 2,800
- Comedor desde S/ 2,200
- Oficina en casa desde S/ 1,800

**Incluye:**
- Consulta con diseñador
- Selección de productos
- Descuento por paquete
- Envío e instalación
- Garantía extendida

#### 13.4 Red de Diseñadores

**Modelo:**
- Diseñadores independientes verificados
- Comisión por venta generada
- Perfil con portafolio
- Rating de clientes

**Para diseñadores:**
- Acceso a catálogo completo
- Herramientas de diseño
- Comisiones atractivas
- Clientes de la plataforma

---

### 14. Gestión Post-Venta

#### 14.1 Sistema de Garantías

**Registro:**
- Garantía automática al comprar
- Certificado digital de garantía
- Recordatorio de vencimiento

**Cobertura típica:**
- Defectos de fabricación: 1 año
- Estructura: 2-5 años
- Motores/mecanismos: 2 años
- Telas/tapicería: 6 meses

**Proceso de reclamación:**
1. Reportar problema en la app
2. Subir fotos/videos del defecto
3. Evaluación por soporte
4. Aprobación/rechazo con justificación
5. Si aprobado: reparación o reemplazo
6. Coordinación de logística

#### 14.2 Servicio Técnico

**Reparaciones:**
- Red de técnicos certificados
- Cotización antes de reparar
- Garantía en la reparación
- Refacciones originales

**Mantenimiento:**
- Guías de cuidado por material
- Tips de mantenimiento preventivo
- Productos de cuidado recomendados
- Servicio de mantenimiento programado (premium)

#### 14.3 Ensamblaje Profesional

**Servicio opcional:**
- Al momento de compra
- Precio fijo por tipo de mueble
- Técnicos capacitados
- Retiro de empaque

**Categorías:**
| Tipo | Precio aprox | Ejemplo |
|------|-------------|---------|
| Simple | S/ 30-50 | Silla, velador |
| Medio | S/ 50-100 | Mesa, librero |
| Complejo | S/ 100-180 | Sofá modular, clóset |
| Premium | S/ 180+ | Cocina, walk-in closet |

#### 14.4 Devoluciones

**Política:**
- 30 días para devolución
- Producto sin uso
- Empaque original (preferible)
- Reembolso completo o cambio

**Proceso:**
1. Solicitar devolución en la app
2. Indicar motivo
3. Aprobación (instantánea si cumple política)
4. Coordinar recolección
5. Inspección al recibir
6. Reembolso en 5-7 días hábiles

**Excepciones:**
- Productos personalizados: no devolvibles
- Muebles de segunda mano: política reducida
- Productos de liquidación: venta final

---

### 15. Analytics y Business Intelligence

#### 15.1 Dashboard Administrativo

**Métricas en tiempo real:**
- Ventas del día/semana/mes
- Órdenes activas por estado
- Ingresos vs meta
- Conversión del funnel
- Productos más vistos hoy

**Gráficas principales:**
- Ventas históricas (línea de tiempo)
- Distribución por categoría (pie)
- Top 10 productos (barras)
- Mapa de calor de ventas por zona

#### 15.2 Reportes por Proveedor

**Performance individual:**
- Ventas del período
- Productos más vendidos
- Calificación promedio
- Tiempo de entrega promedio
- Tasa de devolución
- Comparativa vs otros proveedores

**Alertas:**
- Proveedor con rating cayendo
- Aumento de devoluciones
- Tiempos de respuesta lentos

#### 15.3 Predicción de Demanda

**Modelos de ML:**
- Forecasting de ventas por categoría
- Estacionalidad detectada
- Impacto de promociones
- Tendencias emergentes

**Aplicaciones:**
- Sugerir stock a proveedores
- Planificar campañas de marketing
- Anticipar necesidad de transportistas

#### 15.4 Análisis de Comportamiento

**Funnel de conversión:**
- Visita → Vista de producto → Carrito → Checkout → Compra
- Drop-off por paso
- Segmentación por fuente de tráfico

**Heatmaps:**
- Clicks en la página
- Scroll depth
- Elementos más interactuados

**Cohort analysis:**
- Retención por mes de adquisición
- LTV por cohorte
- Comportamiento de recompra

#### 15.5 Reportes Automatizados

**Envío programado:**
- Reporte diario de ventas (email)
- Reporte semanal de performance
- Reporte mensual ejecutivo
- Alertas en tiempo real (Slack/Teams)

---

### 16. Sistema de Reviews y Comunidad

#### 16.1 Reseñas Verificadas

**Solo compradores:**
- Invitación a reseñar post-entrega (7 días)
- Badge "Compra verificada"
- Recordatorio si no ha reseñado

**Contenido de reseña:**
- Rating general (1-5 estrellas)
- Ratings específicos:
  - Calidad del producto
  - Relación calidad-precio
  - Facilidad de ensamblaje
  - Coincidencia con fotos
- Texto libre (mín 20 caracteres)
- Pros y contras (opcional)

**Moderación:**
- Filtro de contenido inapropiado
- Detección de reseñas falsas
- Respuesta del vendedor
- Reporte por otros usuarios

#### 16.2 Fotos de Clientes

**User Generated Content:**
- Subir fotos del mueble en su hogar
- Incentivo: puntos de lealtad
- Galería separada de fotos profesionales
- Votación de fotos más útiles

**En ficha de producto:**
- Tab "Fotos de clientes"
- Filtro por ambiente
- Click para ver detalle y reseña asociada

#### 16.3 Preguntas y Respuestas

**Funcionalidad:**
- Hacer pregunta sobre producto
- Responde: vendedor, comunidad, o ambos
- Votar respuestas útiles
- Preguntas frecuentes destacadas

**Notificaciones:**
- Al vendedor cuando hay pregunta nueva
- Al usuario cuando su pregunta es respondida
- A usuarios que tienen el producto (para responder)

#### 16.4 Foro / Comunidad

**Secciones:**
- Tips de decoración
- Muestra tu espacio
- Hazlo tú mismo (DIY)
- Pregunta al experto
- Ofertas compartidas

**Gamificación:**
- Badges por participación
- Niveles de contribuidor
- Expertos verificados
- Top contribuidores del mes

#### 16.5 Blog y Contenido

**Tipos de contenido:**
- Guías de compra ("Cómo elegir el sofá perfecto")
- Tendencias de decoración
- Entrevistas a diseñadores
- Historias de clientes
- Detrás de escenas de proveedores

**SEO:**
- Contenido optimizado para búsqueda
- Long-tail keywords
- Links internos a productos
- Schema markup

---

### 17. Integración Smart Home

#### 17.1 Catálogo de Muebles Inteligentes

**Categorías:**
- Escritorios con altura ajustable eléctrica
- Camas con ajuste de posición
- Sofás con cargadores inalámbricos
- Muebles con speakers integrados
- Iluminación LED integrada
- Mesas con refrigerador integrado

**Información adicional:**
- Conectividad: WiFi, Bluetooth, Zigbee
- Compatibilidad: Alexa, Google Home, HomeKit
- Voltaje y consumo
- App asociada

#### 17.2 Filtros Especializados

**Búsqueda de smart furniture:**
- Por asistente compatible
- Por tipo de conectividad
- Por funcionalidad smart
- Rango de consumo eléctrico

#### 17.3 Guías de Configuración

**Contenido:**
- Cómo conectar con tu sistema
- Troubleshooting común
- Automatizaciones sugeridas
- Videos tutoriales

**Soporte especializado:**
- Chat con expertos en smart home
- Servicio de configuración a domicilio

---

### 18. Sistema B2B

#### 18.1 Portal Empresarial

**Registro de empresa:**
- Datos fiscales completos (RUC, razón social)
- Documentación: ficha RUC, vigencia de poder, DNI del representante legal
- Verificación de empresa (consulta SUNAT)
- Asignación de ejecutivo de cuenta

**Funcionalidades exclusivas:**
- Precios mayoreo
- Cotizaciones formales
- Crédito comercial
- Facturación mensual consolidada

#### 18.2 Cotizaciones Masivas

**Herramienta de cotización:**
- Seleccionar múltiples productos
- Indicar cantidades
- Solicitar descuento por volumen
- Generar cotización PDF
- Vigencia configurable
- Seguimiento de cotizaciones enviadas

**Aprobación interna:**
- Enviar cotización a decisor
- Workflow de aprobación
- Comentarios internos
- Historial de versiones

#### 18.3 Proyectos

**Gestión de proyectos:**
- Amueblar oficina completa
- Hotel (múltiples habitaciones)
- Restaurante
- Desarrollo inmobiliario

**Funcionalidades:**
- Crear proyecto con múltiples ubicaciones
- Asignar productos por ubicación
- Timeline de entregas
- Coordinación con proveedores múltiples
- Dashboard de avance

#### 18.4 Crédito Comercial

**Línea de crédito:**
- Evaluación crediticia de empresa
- Límite asignado
- Plazo de pago: 30, 60, 90 días
- Estado de cuenta mensual

**Facturación electrónica (Perú):**
- Factura electrónica automática (SUNAT)
- Notas de crédito/débito
- Integración con operador de servicios electrónicos (OSE)
- Descarga de XMLs y PDFs
- Guías de remisión electrónicas

---

### 19. Notificaciones Inteligentes

#### 19.1 Alertas de Precio

**Configuración:**
- "Avisarme si baja de S/ X"
- "Avisarme de cualquier descuento"
- En productos individuales o categorías

**Notificación:**
- Push notification
- Email
- Badge en la app

#### 19.2 Restock Notifications

**Funcionalidad:**
- En productos agotados: "Avisarme cuando esté disponible"
- Notificación instantánea al reponer
- Ventana de compra prioritaria (15 min)

#### 19.3 Recordatorios de Carrito

**Secuencia:**
- 1 hora: "¿Olvidaste algo?"
- 24 horas: "Tu carrito te espera"
- 72 horas: "10% de descuento si completas hoy"
- 7 días: Último recordatorio

**Personalización:**
- Usuario puede desactivar
- Frecuencia configurable
- Canal preferido

#### 19.4 Updates de Pedido

**Notificaciones automáticas:**
- Pedido confirmado
- Pago procesado
- En fabricación
- Listo para envío
- En camino (con tracking)
- "Tu pedido llega hoy"
- "Tu pedido llegó"

**Canal:**
- Push notification (app)
- Email
- SMS (para eventos críticos)
- WhatsApp (opcional)

#### 19.5 Recomendaciones Personalizadas

**Triggers:**
- Nuevo producto en categoría favorita
- Producto visto vuelve a tener stock
- Complemento de compra reciente
- "Hace 6 meses compraste X, ¿tiempo de renovar?"

---

### 20. Social Commerce

#### 20.1 Integración con Redes Sociales

**Instagram Shopping:**
- Catálogo sincronizado
- Tags en fotos
- Checkout sin salir de Instagram
- Stories con productos

**Pinterest:**
- Product pins
- Catálogo sincronizado
- Buyable pins

**TikTok Shop:**
- Videos con productos taggeados
- Live shopping
- Affiliate program

#### 20.2 Wishlist Compartible

**Funcionalidad:**
- Lista de deseos pública/privada
- Compartir por link
- Colaborativa (otros pueden agregar)
- Notificar cuando alguien compra de la lista

**Casos de uso:**
- Compartir ideas con pareja
- Lista para regalo de cumpleaños
- Planeación de mudanza

#### 20.3 Gift Registry

**Eventos soportados:**
- Boda
- Baby shower
- Nueva casa
- Graduación
- Cumpleaños

**Funcionalidades:**
- Crear registro con fecha del evento
- Agregar productos deseados
- Indicar prioridad y cantidad
- Compartir link con invitados
- Invitados ven qué falta
- Opción de contribuir parcialmente
- Mensaje de quien regala
- Agradecimiento automático

#### 20.4 Compartir Experiencia AR

**Funcionalidad:**
- Foto/video del mueble en tu espacio
- Compartir directo a redes
- Link al producto incluido
- "¿Qué opinan? 🤔"

**Viralidad:**
- Hashtag de marca
- Concursos de mejor decoración
- Repost de mejores fotos

#### 20.5 Influencer Program

**Programa de afiliados:**
- Registro de creadores de contenido
- Links/códigos únicos
- Comisión por venta generada
- Dashboard de métricas
- Productos gratis para review

**Colaboraciones:**
- Colecciones curadas por influencers
- Descuentos exclusivos con código
- Lives de decoración

---

## Stack Tecnológico Definitivo

### Core Framework

```
┌─────────────────────────────────────────────────────────────────┐
│  Next.js 16 + React 19 + TypeScript 5.x                        │
│  ├── App Router (Server Components por defecto)                │
│  ├── Server Actions (mutaciones, sin API routes)               │
│  ├── React Compiler (optimización automática)                  │
│  ├── Partial Prerendering (PPR)                                │
│  └── after() para tareas post-response                         │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 16.x | Framework fullstack |
| **React** | 19.x | UI library con Compiler |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling (nuevo engine Oxide) |
| **shadcn/ui** | latest | Componentes UI |
| **Framer Motion** | 11.x | Animaciones |
| **nuqs** | latest | URL state management |
| **Zod** | 3.x | Validación de schemas |

**React 19 Features utilizadas:**
- `useActionState` - Estado de Server Actions
- `useFormStatus` - Estado de formularios
- `useOptimistic` - Optimistic updates
- `use()` - Resolver promesas en render
- React Compiler - Memoización automática (no más useMemo/useCallback manuales)

### Backend (dentro de Next.js)

```
┌─────────────────────────────────────────────────────────────────┐
│  Server Actions + Server Components                             │
│  ├── Autenticación: Better Auth (o Auth.js v5)                 │
│  ├── ORM: Drizzle ORM                                          │
│  ├── Validación: Zod                                           │
│  ├── Realtime: Socket.io                                       │
│  └── Background jobs: after() + Inngest (opcional)             │
└─────────────────────────────────────────────────────────────────┘
```

### Base de Datos

| Tecnología | Uso | Self-hosted |
|------------|-----|-------------|
| **PostgreSQL 16+** | Base de datos principal | ✅ Docker |
| **Drizzle ORM** | Type-safe queries, migraciones | - |
| **Redis** | Cache, sesiones, Socket.io adapter (OPCIONAL) | ✅ Docker |
| **pgvector** | Embeddings para búsqueda semántica | ✅ Extensión PG |

**Drizzle vs Prisma:**
- Más rápido en runtime (SQL puro, sin query engine)
- Mejor DX con TypeScript
- Migraciones más controladas
- Sin binarios externos

### Realtime: Socket.io

```
┌─────────────────────────────────────────────────────────────────┐
│  ARQUITECTURA SOCKET.IO                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐     WebSocket      ┌─────────────────────┐   │
│   │   Cliente   │ ◄────────────────► │   Socket.io Server  │   │
│   │ (socket.io- │                    │   (Node.js custom)  │   │
│   │   client)   │                    └──────────┬──────────┘   │
│   └─────────────┘                               │              │
│                                                 │              │
│                                    ┌────────────┴────────────┐ │
│                                    │      ADAPTER            │ │
│                                    ├─────────────────────────┤ │
│                                    │  Sin Redis:             │ │
│                                    │  └── In-memory (1 inst) │ │
│                                    │                         │ │
│                                    │  Con Redis (escalar):   │ │
│                                    │  └── @socket.io/redis   │ │
│                                    └─────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Casos de uso:**
- Tracking de transportistas en tiempo real (GPS)
- Notificaciones instantáneas de órdenes
- Chat entre cliente y soporte
- Actualización de estados de envío
- Dashboard admin con datos en vivo

**Configuración Socket.io:**

```typescript
// Servidor Socket.io separado (puede correr junto a Next.js)
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'  // OPCIONAL
import { createClient } from 'redis'  // OPCIONAL

const io = new Server(3001, {
  cors: { origin: process.env.NEXT_PUBLIC_APP_URL }
})

// OPCIONAL: Solo si quieres escalar horizontalmente
if (process.env.REDIS_URL) {
  const pubClient = createClient({ url: process.env.REDIS_URL })
  const subClient = pubClient.duplicate()
  await Promise.all([pubClient.connect(), subClient.connect()])
  io.adapter(createAdapter(pubClient, subClient))
  console.log('✅ Socket.io con Redis adapter')
} else {
  console.log('⚡ Socket.io en modo single-instance (sin Redis)')
}

// Namespaces
const trackingNs = io.of('/tracking')
const notificationsNs = io.of('/notifications')
const adminNs = io.of('/admin')

// Eventos de tracking
trackingNs.on('connection', (socket) => {
  socket.on('seguir-envio', (envioId) => {
    socket.join(`envio:${envioId}`)
  })

  socket.on('actualizar-ubicacion', async (data) => {
    // Guardar en DB y broadcast
    trackingNs.to(`envio:${data.envioId}`).emit('ubicacion', data)
  })
})
```

**Cliente Socket.io:**

```typescript
// lib/socket.ts
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ['websocket', 'polling'],
      autoConnect: false
    })
  }
  return socket
}

// hooks/use-tracking.ts
export function useTracking(envioId: string) {
  const [ubicacion, setUbicacion] = useState(null)

  useEffect(() => {
    const socket = getSocket()
    socket.connect()

    const trackingSocket = socket.io.of('/tracking')
    trackingSocket.emit('seguir-envio', envioId)
    trackingSocket.on('ubicacion', setUbicacion)

    return () => {
      trackingSocket.off('ubicacion', setUbicacion)
    }
  }, [envioId])

  return ubicacion
}
```

### Storage

| Tecnología | Uso | Self-hosted |
|------------|-----|-------------|
| **MinIO** | Imágenes, modelos 3D (S3-compatible) | ✅ Docker |
| **Cloudflare R2** | Alternativa cloud barata | ❌ Cloud |

### Búsqueda

| Tecnología | Uso | Self-hosted |
|------------|-----|-------------|
| **Meilisearch** | Full-text search, filtros, facets | ✅ Docker |
| **pgvector** | Búsqueda semántica con embeddings | ✅ Extensión PG |

### IA/ML

| Tecnología | Uso |
|------------|-----|
| **Anthropic Claude API** | Chat, asistente, búsqueda semántica |
| **OpenAI DALL-E 3** | Generación de imágenes de muebles |
| **OpenAI Embeddings** | text-embedding-3-small para búsqueda |
| **Replicate** | Alternativa para imagen (Stable Diffusion) |

### AR (Realidad Aumentada)

| Tecnología | Uso |
|------------|-----|
| **model-viewer** | Componente web de Google para 3D/AR |
| **Three.js** | Escenas 3D custom |
| **WebXR** | AR en navegador |
| **Formato modelos** | GLTF/GLB con compresión Draco |

### Comunicación

| Servicio | Uso |
|----------|-----|
| **Resend** | Emails transaccionales |
| **WhatsApp Business API** | Notificaciones, coordinación transportistas |
| **Web Push** | Notificaciones navegador (sin servicio externo) |

### Pagos (Perú)

| Servicio | Uso |
|----------|-----|
| **Culqi** | Principal: tarjetas, Yape integrado |
| **MercadoPago** | Alternativa, múltiples métodos |
| **PagoEfectivo** | Pago en agentes/bodegas |

### Facturación Electrónica (SUNAT)

| Servicio | Tipo |
|----------|------|
| **Nubefact** | SaaS (más fácil) |
| **Greenter** | Open source PHP (self-hosted) |

### Infraestructura Self-Hosted

```
┌─────────────────────────────────────────────────────────────────┐
│  OPCIÓN A: VPS Simple (Inicio)                                  │
│  Hetzner / DigitalOcean / Contabo - ~$20-40/mes                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Docker Compose                                          │  │
│   │  ├── Next.js (app)                     :3000            │  │
│   │  ├── Socket.io Server                  :3001            │  │
│   │  ├── PostgreSQL                        :5432            │  │
│   │  ├── Redis (opcional)                  :6379            │  │
│   │  ├── Meilisearch                       :7700            │  │
│   │  └── MinIO                             :9000            │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Reverse Proxy: Caddy (HTTPS automático)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  OPCIÓN B: Coolify (PaaS Self-Hosted)                          │
│  Como Vercel/Railway pero en tu servidor                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   - Deploy desde GitHub con 1 click                            │
│   - SSL automático                                              │
│   - Databases con backup automático                            │
│   - Preview deployments                                         │
│   - Monitoreo incluido                                          │
│                                                                 │
│   curl -fsSL https://get.coolify.io | bash                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### CI/CD

```yaml
# GitHub Actions
- Build y test en cada PR
- Deploy automático a producción en merge a main
- Preview deployments para PRs
```

### Monitoreo (Self-Hosted)

| Herramienta | Uso |
|-------------|-----|
| **Prometheus + Grafana** | Métricas y dashboards |
| **Loki** | Logs centralizados |
| **Sentry** | Error tracking (tiene tier gratis) |

---

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTES                                    │
├─────────────────┬─────────────────┬─────────────────┬───────────────────┤
│    Web Store    │   Admin Panel   │ Portal Proveedor│ Mini-App Transport│
│    (público)    │   (/admin)      │  (/proveedor)   │   (/e/[codigo])   │
├─────────────────┴─────────────────┴─────────────────┴───────────────────┤
│                         Next.js 16 App                                   │
│                    React 19 + React Compiler                            │
│                  Tailwind 4 + shadcn/ui                                 │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
          ┌─────────▼─────────┐    ┌──────────▼──────────┐
          │   Server Actions  │    │    Socket.io        │
          │   (mutaciones)    │    │    (realtime)       │
          │                   │    │                     │
          │ • Crear orden     │    │ • Tracking GPS      │
          │ • Actualizar envío│    │ • Notificaciones    │
          │ • CRUD productos  │    │ • Updates en vivo   │
          └─────────┬─────────┘    └──────────┬──────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
   ┌──────▼──────┐       ┌───────▼───────┐     ┌───────▼───────┐
   │ PostgreSQL  │       │     Redis     │     │  Meilisearch  │
   │  + Drizzle  │       │  (opcional)   │     │   (search)    │
   │  + pgvector │       │               │     │               │
   └─────────────┘       └───────────────┘     └───────────────┘
          │
   ┌──────▼──────┐
   │    MinIO    │
   │  (storage)  │
   └─────────────┘
          │
   ┌──────┴──────────────────────────────────────────┐
   │              SERVICIOS EXTERNOS                  │
   ├────────┬────────┬────────┬────────┬─────────────┤
   │ Culqi  │ Resend │ Maps   │ Claude │ WhatsApp    │
   │(pagos) │(email) │(Google)│  (IA)  │ (mensajes)  │
   └────────┴────────┴────────┴────────┴─────────────┘
```

---

## Estructura del Proyecto

```
hogar/
├── apps/
│   ├── web/                          # Next.js 16 App
│   │   ├── app/
│   │   │   ├── (store)/              # Grupo: E-commerce público
│   │   │   │   ├── page.tsx          # Homepage
│   │   │   │   ├── productos/
│   │   │   │   ├── carrito/
│   │   │   │   ├── checkout/
│   │   │   │   └── cuenta/
│   │   │   │
│   │   │   ├── (admin)/              # Grupo: Panel admin
│   │   │   │   └── admin/
│   │   │   │       ├── dashboard/
│   │   │   │       ├── ordenes/
│   │   │   │       ├── proveedores/
│   │   │   │       ├── transportistas/
│   │   │   │       └── productos/
│   │   │   │
│   │   │   ├── (proveedor)/          # Grupo: Portal proveedor
│   │   │   │   └── proveedor/
│   │   │   │       ├── dashboard/
│   │   │   │       ├── productos/
│   │   │   │       └── ordenes/
│   │   │   │
│   │   │   ├── e/[codigo]/           # Mini-app transportista
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── api/                  # Solo webhooks externos
│   │   │   │   ├── webhooks/
│   │   │   │   │   ├── culqi/
│   │   │   │   │   └── whatsapp/
│   │   │   │   └── socket/           # Auth para Socket.io
│   │   │   │
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui
│   │   │   ├── store/                # Componentes e-commerce
│   │   │   ├── admin/                # Componentes admin
│   │   │   └── shared/               # Compartidos
│   │   │
│   │   ├── lib/
│   │   │   ├── db/                   # Drizzle client
│   │   │   ├── auth/                 # Better Auth config
│   │   │   ├── socket/               # Socket.io client
│   │   │   └── utils/
│   │   │
│   │   ├── actions/                  # Server Actions
│   │   │   ├── productos.ts
│   │   │   ├── ordenes.ts
│   │   │   ├── proveedores.ts
│   │   │   ├── transportistas.ts
│   │   │   └── envios.ts
│   │   │
│   │   └── hooks/                    # React hooks
│   │       ├── use-cart.ts
│   │       ├── use-tracking.ts
│   │       └── use-socket.ts
│   │
│   └── socket-server/                # Socket.io Server (Node.js)
│       ├── src/
│       │   ├── index.ts
│       │   ├── namespaces/
│       │   │   ├── tracking.ts
│       │   │   ├── notifications.ts
│       │   │   └── admin.ts
│       │   └── adapters/
│       │       └── redis.ts          # Opcional
│       ├── package.json
│       └── Dockerfile
│
├── packages/
│   ├── database/                     # Drizzle schema
│   │   ├── drizzle/
│   │   │   └── migrations/
│   │   ├── schema/
│   │   │   ├── users.ts
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   ├── providers.ts
│   │   │   ├── carriers.ts
│   │   │   └── index.ts
│   │   ├── seed.ts
│   │   └── drizzle.config.ts
│   │
│   └── shared/                       # Tipos y utils compartidos
│       ├── types/
│       └── constants/
│
├── docker/
│   ├── docker-compose.yml            # Dev environment
│   ├── docker-compose.prod.yml       # Production
│   └── Dockerfile.web
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## Docker Compose (Desarrollo)

```yaml
# docker/docker-compose.yml
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_USER: hogar
      POSTGRES_PASSWORD: hogar_dev
      POSTGRES_DB: hogar
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:  # OPCIONAL - solo si quieres escalar Socket.io
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  meilisearch:
    image: getmeili/meilisearch:v1.6
    environment:
      MEILI_ENV: development
      MEILI_MASTER_KEY: hogar_search_key
    ports:
      - "7700:7700"
    volumes:
      - meilisearch_data:/meili_data

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: hogar
      MINIO_ROOT_PASSWORD: hogar_minio
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  redis_data:
  meilisearch_data:
  minio_data:
```

---

## Modelo de Datos (Drizzle Schema)

```typescript
// packages/database/schema/index.ts
import { pgTable, text, timestamp, decimal, integer, boolean, jsonb, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============ USUARIOS ============
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  phone: text('phone'),
  role: text('role', { enum: ['customer', 'admin', 'provider', 'carrier'] }).default('customer'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const userAddresses = pgTable('user_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  label: text('label'), // "Casa", "Oficina"
  address: text('address').notNull(),
  district: text('district').notNull(), // Distrito de Lima
  city: text('city').default('Lima'),
  reference: text('reference'), // "Frente al parque"
  lat: decimal('lat', { precision: 10, scale: 7 }),
  lng: decimal('lng', { precision: 10, scale: 7 }),
  isDefault: boolean('is_default').default(false),
})

// ============ PROVEEDORES ============
export const providers = pgTable('providers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  name: text('name').notNull(),
  ruc: text('ruc').unique(),
  phone: text('phone'),
  whatsapp: text('whatsapp'),
  address: text('address'),
  district: text('district'),
  lat: decimal('lat', { precision: 10, scale: 7 }),
  lng: decimal('lng', { precision: 10, scale: 7 }),
  description: text('description'),
  logo: text('logo'),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0'),
  tier: text('tier', { enum: ['nuevo', 'verificado', 'premium', 'partner'] }).default('nuevo'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// ============ PRODUCTOS ============
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  parentId: uuid('parent_id').references(() => categories.id),
  image: text('image'),
  order: integer('order').default(0),
})

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  providerId: uuid('provider_id').references(() => providers.id).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  stock: integer('stock').default(0),
  status: text('status', { enum: ['draft', 'active', 'out_of_stock', 'discontinued'] }).default('draft'),
  fabricationDays: integer('fabrication_days').default(0), // 0 = en stock
  dimensions: jsonb('dimensions'), // { width, height, depth, weight }
  materials: text('materials').array(),
  style: text('style'), // moderno, rustico, etc
  has3dModel: boolean('has_3d_model').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  alt: text('alt'),
  order: integer('order').default(0),
  is3dModel: boolean('is_3d_model').default(false), // Para archivos .glb
})

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  sku: text('sku'),
  name: text('name'), // "Gris oscuro", "Grande"
  color: text('color'),
  size: text('size'),
  material: text('material'),
  priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).default('0'),
  stock: integer('stock').default(0),
  image: text('image'),
})

// ============ ÓRDENES ============
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('order_number').notNull().unique(), // HOG-2024-0001
  userId: uuid('user_id').references(() => users.id),
  status: text('status', {
    enum: ['pending', 'paid', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'refunded']
  }).default('pending'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shippingFee: decimal('shipping_fee', { precision: 10, scale: 2 }).default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb('shipping_address'), // Snapshot de dirección
  billingInfo: jsonb('billing_info'), // RUC, razón social para factura
  notes: text('notes'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id),
  variantId: uuid('variant_id').references(() => productVariants.id),
  providerId: uuid('provider_id').references(() => providers.id),
  name: text('name').notNull(), // Snapshot
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
})

// ============ TRANSPORTISTAS ============
export const carriers = pgTable('carriers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  name: text('name').notNull(),
  dni: text('dni'),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp'),
  type: text('type', { enum: ['independent', 'fleet', 'partner'] }).default('independent'),
  integrationLevel: text('integration_level', {
    enum: ['api', 'app', 'whatsapp', 'manual']
  }).default('manual'),
  vehicleType: text('vehicle_type'), // camioneta, van, camion
  vehiclePlate: text('vehicle_plate'),
  vehicleCapacity: jsonb('vehicle_capacity'), // { volume_m3, weight_kg }
  districts: text('districts').array(), // Distritos que cubre
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// ============ ENVÍOS ============
export const shipments = pgTable('shipments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id),
  carrierId: uuid('carrier_id').references(() => carriers.id),
  trackingCode: text('tracking_code').unique(), // Código público para cliente
  status: text('status', {
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'returned']
  }).default('pending'),
  originAddress: jsonb('origin_address'), // Dirección del proveedor
  destinationAddress: jsonb('destination_address'), // Dirección del cliente
  scheduledDate: timestamp('scheduled_date'),
  scheduledTimeSlot: text('scheduled_time_slot'), // "14:00-18:00"
  agreedFee: decimal('agreed_fee', { precision: 10, scale: 2 }),
  pickedUpAt: timestamp('picked_up_at'),
  deliveredAt: timestamp('delivered_at'),
  deliveryPhoto: text('delivery_photo'),
  deliverySignature: text('delivery_signature'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const shipmentTracking = pgTable('shipment_tracking', {
  id: uuid('id').primaryKey().defaultRandom(),
  shipmentId: uuid('shipment_id').references(() => shipments.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  lat: decimal('lat', { precision: 10, scale: 7 }),
  lng: decimal('lng', { precision: 10, scale: 7 }),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ============ REVIEWS ============
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  orderId: uuid('order_id').references(() => orders.id),
  rating: integer('rating').notNull(), // 1-5
  title: text('title'),
  body: text('body'),
  images: text('images').array(),
  isVerified: boolean('is_verified').default(false), // Compra verificada
  createdAt: timestamp('created_at').defaultNow(),
})

// ============ RELACIONES ============
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(userAddresses),
  orders: many(orders),
  reviews: many(reviews),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  provider: one(providers, { fields: [products.providerId], references: [providers.id] }),
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  variants: many(productVariants),
  reviews: many(reviews),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  shipments: many(shipments),
}))

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  order: one(orders, { fields: [shipments.orderId], references: [orders.id] }),
  carrier: one(carriers, { fields: [shipments.carrierId], references: [carriers.id] }),
  tracking: many(shipmentTracking),
}))
```

---

## Roadmap de Fases

### Fase 1: MVP Core (3-4 meses)
- [ ] Setup de infraestructura base
- [ ] Autenticación y gestión de usuarios
- [ ] CRUD de proveedores (admin)
- [ ] Catálogo de productos básico
- [ ] Carrito y checkout
- [ ] Pasarela de pagos (Stripe)
- [ ] Gestión de órdenes básica
- [ ] Panel de administración básico
- [ ] Panel de proveedor básico

### Fase 2: Logística (2-3 meses)
- [ ] Gestión de transportistas
- [ ] Algoritmo de matching básico
- [ ] Tracking de envíos
- [ ] Notificaciones de estado
- [ ] Zonas de cobertura
- [ ] Cálculo de costos de envío

### Fase 3: Personalización (2-3 meses)
- [ ] Sistema de perfiles y preferencias
- [ ] Motor de recomendaciones
- [ ] Búsqueda semántica con IA
- [ ] Chatbot básico
- [ ] Sistema de reviews

### Fase 4: IA + AR (3-4 meses)
- [ ] Generador de muebles con prompts
- [ ] Matching con catálogo
- [ ] Realidad aumentada (WebAR)
- [ ] Medición de espacios
- [ ] Room planner básico

### Fase 5: Monetización (2-3 meses)
- [ ] Sistema de financiamiento
- [ ] Programa de lealtad
- [ ] Sistema de referidos
- [ ] Ofertas y promociones
- [ ] Analytics avanzado

### Fase 6: Expansión (ongoing)
- [ ] App móvil nativa
- [ ] Portal B2B
- [ ] Marketplace de segunda mano
- [ ] Social commerce
- [ ] Servicio de diseño de interiores
- [ ] Internacionalización

---

## Métricas de Éxito (KPIs)

### Negocio
- **GMV**: Valor bruto de mercancía
- **Revenue**: Ingresos por comisiones
- **Take rate**: % de comisión promedio
- **AOV**: Valor promedio de orden

### Usuarios
- **MAU/DAU**: Usuarios activos
- **Conversion rate**: Visitas → Compras
- **CAC**: Costo de adquisición
- **LTV**: Valor de vida del cliente
- **NPS**: Net Promoter Score

### Operaciones
- **Fulfillment rate**: % de órdenes completadas
- **Delivery time**: Tiempo promedio de entrega
- **Return rate**: Tasa de devoluciones
- **Provider rating**: Calificación promedio

### Tecnología
- **Uptime**: Disponibilidad del sistema
- **Page load time**: Tiempo de carga
- **API latency**: Latencia de API
- **AR adoption**: % de usuarios que usan AR

---

## Equipo Sugerido

### Inicial (MVP)
- 1 Product Manager
- 2 Frontend developers
- 2 Backend developers
- 1 DevOps / Platform
- 1 Designer (UX/UI)
- 1 QA

### Escalado (Post-MVP)
- +1 Mobile developer
- +1 ML Engineer
- +1 Data Analyst
- +1 Customer Success
- +1 Growth / Marketing

---

## Consideraciones Legales

### Perú - Marco Regulatorio

**Protección al Consumidor (INDECOPI):**
- Código de Protección y Defensa del Consumidor (Ley 29571)
- Derecho de desistimiento (7 días para compras online)
- Información clara de precios (incluir IGV)
- Libro de reclamaciones virtual obligatorio
- Publicidad veraz, no engañosa

**Protección de Datos Personales:**
- Ley 29733 - Ley de Protección de Datos Personales
- Registro de bases de datos en la APDP
- Consentimiento expreso para tratamiento de datos
- Política de privacidad obligatoria
- Derecho ARCO (Acceso, Rectificación, Cancelación, Oposición)

**Tributario (SUNAT):**
- Facturación electrónica obligatoria
- Boletas y facturas electrónicas
- Guías de remisión electrónicas (para transporte)
- Retención de IGV si aplica
- Libros electrónicos (PLE)
- Régimen tributario apropiado (RUS, RER, Régimen General, MYPE)

**Comercio Electrónico:**
- Ley 27291 - Manifestación de voluntad por medios electrónicos
- Decreto Legislativo 1075 - Comercio Electrónico
- Términos y condiciones claros
- Proceso de compra transparente
- Confirmación de pedido por email

**Contratos:**
- Contratos con proveedores/fabricantes
- Contratos con transportistas
- Términos de servicio para usuarios
- Política de devoluciones y garantías
- Cláusulas de responsabilidad

### Pagos
- PCI DSS compliance
- Prevención de fraude y lavado de activos
- Política de reembolsos (dentro de 15 días hábiles)
- Cumplimiento con SBS para operaciones financieras

### Propiedad Intelectual (INDECOPI)
- Registro de marca en INDECOPI
- Términos de uso de contenido generado por usuarios
- Licencias de modelos 3D y fotografías
- Derechos de autor sobre diseños

### Laboral
- Si hay trabajadores: cumplimiento con SUNAFIL
- Para transportistas independientes: contratos de locación de servicios
- Evitar subordinación encubierta

---

## Moneda y Precios

- **Moneda**: Soles peruanos (PEN / S/)
- **IGV**: 18% (incluido en precios al consumidor)
- **Formato de precios**: S/ 1,299.00
- **Redondeo**: A céntimos (no hay monedas menores)

---

*Documento vivo - Última actualización: Enero 2026*
*Mercado: Lima Metropolitana, Perú*

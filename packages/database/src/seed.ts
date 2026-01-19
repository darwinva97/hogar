import { db } from './index'
import { categories, users } from './schema'

async function seed() {
  console.log('🌱 Seeding database...')

  // Crear usuario admin
  const [adminUser] = await db
    .insert(users)
    .values({
      email: 'admin@hogar.pe',
      name: 'Admin Hogar',
      role: 'admin',
      emailVerified: true,
    })
    .onConflictDoNothing()
    .returning()

  console.log('✅ Admin user created:', adminUser?.email)

  // Crear categorías principales
  const mainCategories = [
    { name: 'Sala', slug: 'sala', order: 1 },
    { name: 'Comedor', slug: 'comedor', order: 2 },
    { name: 'Dormitorio', slug: 'dormitorio', order: 3 },
    { name: 'Oficina', slug: 'oficina', order: 4 },
    { name: 'Exterior', slug: 'exterior', order: 5 },
    { name: 'Cocina', slug: 'cocina', order: 6 },
    { name: 'Infantil', slug: 'infantil', order: 7 },
  ]

  for (const cat of mainCategories) {
    const [created] = await db
      .insert(categories)
      .values(cat)
      .onConflictDoNothing()
      .returning()

    if (created) {
      console.log(`✅ Category created: ${created.name}`)

      // Subcategorías
      const subcategories = getSubcategories(created.slug, created.id)
      for (const subcat of subcategories) {
        await db.insert(categories).values(subcat).onConflictDoNothing()
      }
    }
  }

  console.log('🎉 Seeding completed!')
}

function getSubcategories(parentSlug: string, parentId: string) {
  const subcats: Record<string, { name: string; slug: string }[]> = {
    sala: [
      { name: 'Sofás', slug: 'sofas' },
      { name: 'Sillones', slug: 'sillones' },
      { name: 'Mesas de centro', slug: 'mesas-de-centro' },
      { name: 'Muebles de TV', slug: 'muebles-de-tv' },
      { name: 'Libreros', slug: 'libreros' },
      { name: 'Repisas', slug: 'repisas' },
    ],
    comedor: [
      { name: 'Mesas de comedor', slug: 'mesas-de-comedor' },
      { name: 'Sillas de comedor', slug: 'sillas-de-comedor' },
      { name: 'Bancos', slug: 'bancos' },
      { name: 'Vitrinas', slug: 'vitrinas' },
      { name: 'Aparadores', slug: 'aparadores' },
    ],
    dormitorio: [
      { name: 'Camas', slug: 'camas' },
      { name: 'Cabeceras', slug: 'cabeceras' },
      { name: 'Veladores', slug: 'veladores' },
      { name: 'Cómodas', slug: 'comodas' },
      { name: 'Tocadores', slug: 'tocadores' },
      { name: 'Clósets', slug: 'closets' },
    ],
    oficina: [
      { name: 'Escritorios', slug: 'escritorios' },
      { name: 'Sillas de oficina', slug: 'sillas-de-oficina' },
      { name: 'Estantes', slug: 'estantes' },
      { name: 'Archiveros', slug: 'archiveros' },
    ],
    exterior: [
      { name: 'Juegos de jardín', slug: 'juegos-de-jardin' },
      { name: 'Sillas de exterior', slug: 'sillas-de-exterior' },
      { name: 'Sombrillas', slug: 'sombrillas' },
      { name: 'Bancas', slug: 'bancas-exterior' },
    ],
    cocina: [
      { name: 'Mesas auxiliares', slug: 'mesas-auxiliares' },
      { name: 'Banquetas', slug: 'banquetas' },
      { name: 'Alacenas', slug: 'alacenas' },
      { name: 'Islas de cocina', slug: 'islas-de-cocina' },
    ],
    infantil: [
      { name: 'Camas infantiles', slug: 'camas-infantiles' },
      { name: 'Cunas', slug: 'cunas' },
      { name: 'Escritorios infantiles', slug: 'escritorios-infantiles' },
      { name: 'Almacenamiento', slug: 'almacenamiento-infantil' },
    ],
  }

  return (subcats[parentSlug] || []).map((sub, index) => ({
    ...sub,
    parentId,
    order: index + 1,
  }))
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seed error:', error)
    process.exit(1)
  })

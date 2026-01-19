'use server'

import { db } from '@hogar/database'
import { productImages } from '@hogar/database'
import { eq, and, max } from 'drizzle-orm'
import { requireRole } from '@/lib/auth'
import { uploadFile, deleteFile } from '@/lib/storage'
import { revalidatePath } from 'next/cache'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

interface UploadProductImageResult {
  success: boolean
  image?: {
    id: string
    url: string
    order: number
  }
  error?: string
}

/**
 * Upload a product image
 */
export async function uploadProductImage(
  productId: string,
  formData: FormData
): Promise<UploadProductImageResult> {
  await requireRole(['admin'])

  const file = formData.get('file') as File | null

  if (!file) {
    return { success: false, error: 'No se proporcionó archivo' }
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: 'Tipo de archivo no permitido. Usa JPG, PNG, WebP o GIF',
    }
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'El archivo es muy grande. Máximo 5MB',
    }
  }

  try {
    // Upload to storage
    const result = await uploadFile(file, `products/${productId}`)

    // Get next order number
    const maxOrder = await db
      .select({ max: max(productImages.order) })
      .from(productImages)
      .where(eq(productImages.productId, productId))

    const nextOrder = (maxOrder[0]?.max || 0) + 1

    // Save to database
    const [image] = await db
      .insert(productImages)
      .values({
        productId,
        url: result.url,
        alt: null,
        order: nextOrder,
      })
      .returning()

    revalidatePath(`/admin/productos/${productId}`)
    revalidatePath(`/producto`)

    return {
      success: true,
      image: {
        id: image.id,
        url: image.url,
        order: image.order,
      },
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Error al subir la imagen',
    }
  }
}

/**
 * Delete a product image
 */
export async function deleteProductImage(imageId: string): Promise<{ success: boolean; error?: string }> {
  await requireRole(['admin'])

  try {
    // Get image info
    const image = await db.query.productImages.findFirst({
      where: eq(productImages.id, imageId),
    })

    if (!image) {
      return { success: false, error: 'Imagen no encontrada' }
    }

    // Extract key from URL for deletion
    // URL could be /uploads/products/xxx/file.jpg or https://cdn.example.com/products/xxx/file.jpg
    const urlPath = new URL(image.url, 'http://localhost').pathname
    const key = urlPath.startsWith('/uploads/')
      ? urlPath.replace('/uploads/', '')
      : urlPath.replace(/^\//, '')

    // Delete from storage
    try {
      await deleteFile(key)
    } catch (storageError) {
      console.error('Storage delete error:', storageError)
      // Continue with DB deletion even if storage fails
    }

    // Delete from database
    await db.delete(productImages).where(eq(productImages.id, imageId))

    // Reorder remaining images
    const remainingImages = await db.query.productImages.findMany({
      where: eq(productImages.productId, image.productId),
      orderBy: (img, { asc }) => [asc(img.order)],
    })

    for (let i = 0; i < remainingImages.length; i++) {
      await db
        .update(productImages)
        .set({ order: i + 1 })
        .where(eq(productImages.id, remainingImages[i].id))
    }

    revalidatePath(`/admin/productos/${image.productId}`)
    revalidatePath(`/producto`)

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Error al eliminar la imagen' }
  }
}

/**
 * Reorder product images
 */
export async function reorderProductImages(
  productId: string,
  imageIds: string[]
): Promise<{ success: boolean; error?: string }> {
  await requireRole(['admin'])

  try {
    // Update order for each image
    for (let i = 0; i < imageIds.length; i++) {
      await db
        .update(productImages)
        .set({ order: i + 1 })
        .where(
          and(
            eq(productImages.id, imageIds[i]),
            eq(productImages.productId, productId)
          )
        )
    }

    revalidatePath(`/admin/productos/${productId}`)
    revalidatePath(`/producto`)

    return { success: true }
  } catch (error) {
    console.error('Reorder error:', error)
    return { success: false, error: 'Error al reordenar las imágenes' }
  }
}

/**
 * Update image alt text
 */
export async function updateImageAlt(
  imageId: string,
  alt: string
): Promise<{ success: boolean; error?: string }> {
  await requireRole(['admin'])

  try {
    const image = await db.query.productImages.findFirst({
      where: eq(productImages.id, imageId),
    })

    if (!image) {
      return { success: false, error: 'Imagen no encontrada' }
    }

    await db
      .update(productImages)
      .set({ alt })
      .where(eq(productImages.id, imageId))

    revalidatePath(`/admin/productos/${image.productId}`)

    return { success: true }
  } catch (error) {
    console.error('Update alt error:', error)
    return { success: false, error: 'Error al actualizar el texto alternativo' }
  }
}

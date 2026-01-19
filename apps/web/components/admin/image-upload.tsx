'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { uploadProductImage, deleteProductImage, reorderProductImages } from '@/lib/actions/upload'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ProductImage {
  id: string
  url: string
  alt: string | null
  order: number
}

interface ImageUploadProps {
  productId: string
  images: ProductImage[]
  onImagesChange?: (images: ProductImage[]) => void
}

export function ImageUpload({ productId, images: initialImages, onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const updateImages = (newImages: ProductImage[]) => {
    setImages(newImages)
    onImagesChange?.(newImages)
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const result = await uploadProductImage(productId, formData)

        if (result.success && result.image) {
          updateImages([...images, result.image as ProductImage])
          toast.success('Imagen subida')
        } else {
          toast.error(result.error || 'Error al subir imagen')
        }
      } catch {
        toast.error('Error al subir imagen')
      }
    }

    setIsUploading(false)
  }

  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId)

    try {
      const result = await deleteProductImage(imageId)

      if (result.success) {
        updateImages(images.filter((img) => img.id !== imageId))
        toast.success('Imagen eliminada')
      } else {
        toast.error(result.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error al eliminar imagen')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleUpload(e.dataTransfer.files)
    },
    [handleUpload]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files)
    e.target.value = '' // Reset input
  }

  const moveImage = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[newIndex]
    newImages[newIndex] = temp

    // Update order values
    newImages.forEach((img, i) => {
      img.order = i + 1
    })

    updateImages(newImages)

    // Save to server
    try {
      await reorderProductImages(
        productId,
        newImages.map((img) => img.id)
      )
    } catch {
      // Revert on error
      updateImages(images)
      toast.error('Error al reordenar')
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          id="image-upload"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />

        <svg
          className="mx-auto h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <p className="mt-2 text-sm text-muted-foreground">
          {isUploading ? (
            'Subiendo...'
          ) : (
            <>
              <label htmlFor="image-upload" className="text-primary hover:underline cursor-pointer">
                Selecciona archivos
              </label>
              {' '}o arrastra aquí
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, WebP o GIF. Máximo 5MB
        </p>
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images
            .sort((a, b) => a.order - b.order)
            .map((image, index) => (
              <div
                key={image.id}
                className="relative group aspect-square rounded-lg overflow-hidden border bg-gray-100"
              >
                <Image
                  src={image.url}
                  alt={image.alt || 'Imagen del producto'}
                  fill
                  className="object-cover"
                />

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Move up */}
                  {index > 0 && (
                    <button
                      onClick={() => moveImage(index, 'up')}
                      className="p-1.5 bg-white rounded-full hover:bg-gray-100"
                      title="Mover arriba"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Move down */}
                  {index < images.length - 1 && (
                    <button
                      onClick={() => moveImage(index, 'down')}
                      className="p-1.5 bg-white rounded-full hover:bg-gray-100"
                      title="Mover abajo"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(image.id)}
                    disabled={deletingId === image.id}
                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
                    title="Eliminar"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Order badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-xs rounded">
                    Principal
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No hay imágenes. Sube al menos una imagen para el producto.
        </p>
      )}
    </div>
  )
}

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Category {
  id: string
  name: string
  slug: string
  children?: Category[]
}

interface ProductFiltersProps {
  categories: Category[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '')

  const selectedCategory = searchParams.get('categoria')

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      // Reset page when filter changes
      params.delete('pagina')

      router.push(`/productos?${params.toString()}`)
    },
    [router, searchParams]
  )

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (minPrice) {
      params.set('min', minPrice)
    } else {
      params.delete('min')
    }

    if (maxPrice) {
      params.set('max', maxPrice)
    } else {
      params.delete('max')
    }

    params.delete('pagina')
    router.push(`/productos?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/productos')
    setMinPrice('')
    setMaxPrice('')
  }

  const hasActiveFilters = selectedCategory || minPrice || maxPrice

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filtros</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3">Categorías</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateFilter('categoria', null)}
              className={`block w-full text-left px-2 py-1.5 rounded text-sm hover:bg-gray-100 ${
                !selectedCategory ? 'bg-primary/10 text-primary font-medium' : ''
              }`}
            >
              Todas
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => updateFilter('categoria', category.slug)}
                className={`block w-full text-left px-2 py-1.5 rounded text-sm hover:bg-gray-100 ${
                  selectedCategory === category.slug
                    ? 'bg-primary/10 text-primary font-medium'
                    : ''
                }`}
              >
                {category.name}
              </button>

              {/* Subcategories */}
              {category.children && category.children.length > 0 && (
                <ul className="ml-3 mt-1 space-y-1">
                  {category.children.map((sub) => (
                    <li key={sub.id}>
                      <button
                        onClick={() => updateFilter('categoria', sub.slug)}
                        className={`block w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-100 ${
                          selectedCategory === sub.slug
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3">Precio</h3>
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Label htmlFor="min" className="sr-only">
              Mínimo
            </Label>
            <Input
              id="min"
              type="number"
              placeholder="Mín"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-9"
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="flex-1">
            <Label htmlFor="max" className="sr-only">
              Máximo
            </Label>
            <Input
              id="max"
              type="number"
              placeholder="Máx"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={applyPriceFilter}
        >
          Aplicar
        </Button>
      </div>
    </div>
  )
}

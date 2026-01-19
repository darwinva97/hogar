import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
          Tu hogar, tu estilo,
          <br />
          <span className="text-primary-600">tu elección</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
          Conectamos a los mejores fabricantes de muebles de Lima contigo.
          Visualiza con realidad aumentada y recibe en tu hogar.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/productos">Explorar muebles</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/como-funciona">¿Cómo funciona?</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            ¿Por qué Hogar?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon="🏭"
              title="Directo del fabricante"
              description="Sin intermediarios. Mejores precios y calidad garantizada de talleres verificados."
            />
            <FeatureCard
              icon="📱"
              title="Realidad aumentada"
              description="Visualiza cómo quedaría el mueble en tu espacio antes de comprarlo."
            />
            <FeatureCard
              icon="🚚"
              title="Entrega coordinada"
              description="Seguimiento en tiempo real y coordinación directa con el transportista."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">¿Eres fabricante de muebles?</h2>
          <p className="mb-8 text-lg text-primary-100">
            Únete a nuestra red de proveedores y llega a más clientes en Lima.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/proveedor/registro">Registrar mi taller</Link>
          </Button>
        </div>
      </section>
    </>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

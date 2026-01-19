import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Hogar</h3>
            <p className="text-sm text-muted-foreground">
              El marketplace de muebles más grande del Perú. Conectamos
              fabricantes con compradores para ofrecerte los mejores precios
              y calidad.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">Comprar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/categoria/sala"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sala
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/comedor"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Comedor
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/dormitorio"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dormitorio
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/oficina"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Oficina
                </Link>
              </li>
              <li>
                <Link
                  href="/ofertas"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h4 className="mb-4 font-semibold">Vender</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/vender"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Vende en Hogar
                </Link>
              </li>
              <li>
                <Link
                  href="/vender/registro"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Registrar tienda
                </Link>
              </li>
              <li>
                <Link
                  href="/vender/tarifas"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Tarifas
                </Link>
              </li>
              <li>
                <Link
                  href="/vender/guia"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Guía del vendedor
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-4 font-semibold">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/ayuda"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link
                  href="/ayuda/envios"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Envíos
                </Link>
              </li>
              <li>
                <Link
                  href="/ayuda/devoluciones"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-8 border-t pt-8">
          <h4 className="mb-4 text-sm font-semibold">Métodos de pago</h4>
          <div className="flex flex-wrap gap-4">
            <span className="rounded bg-white px-3 py-1 text-xs shadow">
              Visa
            </span>
            <span className="rounded bg-white px-3 py-1 text-xs shadow">
              Mastercard
            </span>
            <span className="rounded bg-[#00D1AE] px-3 py-1 text-xs text-white shadow">
              Yape
            </span>
            <span className="rounded bg-[#00DDB4] px-3 py-1 text-xs text-white shadow">
              Plin
            </span>
            <span className="rounded bg-white px-3 py-1 text-xs shadow">
              Transferencia
            </span>
            <span className="rounded bg-white px-3 py-1 text-xs shadow">
              PagoEfectivo
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <p>&copy; 2024 Hogar. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/terminos" className="hover:text-foreground">
              Términos y condiciones
            </Link>
            <Link href="/privacidad" className="hover:text-foreground">
              Política de privacidad
            </Link>
            <Link href="/libro-reclamaciones" className="hover:text-foreground">
              Libro de reclamaciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

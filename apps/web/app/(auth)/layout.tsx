import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span className="text-3xl font-bold text-primary">Hogar</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:block relative flex-1 bg-primary">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <h2 className="text-4xl font-bold mb-4">
            Tu hogar, tu estilo
          </h2>
          <p className="text-xl text-primary-100 text-center max-w-md">
            Conectamos a los mejores fabricantes de muebles de Lima contigo.
          </p>
        </div>
      </div>
    </div>
  )
}

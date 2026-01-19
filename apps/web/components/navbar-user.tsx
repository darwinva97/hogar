import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user-menu'

export async function NavbarUser() {
  const session = await getSession()

  if (session?.user) {
    return <UserMenu user={session.user} />
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Ingresar</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/registro">Registrarse</Link>
      </Button>
    </div>
  )
}

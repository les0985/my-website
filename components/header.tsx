import Link from "next/link"

export function Header() {
  return (
    <header className="w-full bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="text-white font-bold text-2xl">
            <span className="block">FLASHCARD</span>
            <span className="block">APP</span>
            <span className="block italic text-sm"></span>
          </div>
        </Link>
      </div>
    </header>
  )
}

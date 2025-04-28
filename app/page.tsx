import Link from "next/link"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f3ee]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-4xl font-bold">My Flashcard App</h1>
          <p className="text-xl">15 Min Blocks Throughout The Day</p>
          <div className="flex gap-4">
            <Link href="/search" className="bg-[#5a95c2] hover:bg-[#4a85b2] text-white font-bold py-3 px-6 rounded">
              Search Flashcards
            </Link>
            <Link href="/study" className="bg-[#5a95c2] hover:bg-[#4a85b2] text-white font-bold py-3 px-6 rounded">
              Study Flashcards
            </Link>
          </div>
          <div className="mt-4">
            <Link href="/admin/import" className="text-[#5a95c2] hover:underline">
              Import CSV Data
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

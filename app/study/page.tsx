"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { getStudyDeck, toggleStarred, type Sentence } from "@/lib/supabase"
import { Star } from "lucide-react"

export default function StudyPage() {
  const [studyDeck, setStudyDeck] = useState<Sentence[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showEnglish, setShowEnglish] = useState(false)
  const [loading, setLoading] = useState(true)
  const [starredOnly, setStarredOnly] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchStudyDeck(starredOnly)
  }, [starredOnly])

  const fetchStudyDeck = async (starredFilter: boolean) => {
    setLoading(true)
    const deck = await getStudyDeck(starredFilter)
    setStudyDeck(deck)
    setCurrentIndex(0)
    setShowEnglish(false)
    setLoading(false)
  }

  const handleNext = () => {
    if (currentIndex < studyDeck.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowEnglish(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowEnglish(false)
    }
  }

  const handleToggleStarred = async () => {
    if (studyDeck.length === 0) return

    const currentCard = studyDeck[currentIndex]
    const newStarredStatus = !currentCard.is_starred

    const success = await toggleStarred(currentCard.id, newStarredStatus)
    if (success) {
      // Update the local state
      const updatedDeck = [...studyDeck]
      updatedDeck[currentIndex] = {
        ...updatedDeck[currentIndex],
        is_starred: newStarredStatus,
      }
      setStudyDeck(updatedDeck)
    }
  }

  const handleToggleStarredFilter = () => {
    setStarredOnly(!starredOnly)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ee]">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <p>Loading your flashcards...</p>
        </main>
      </div>
    )
  }

  if (studyDeck.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f3ee]">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">No Flashcards Found</h1>
          <p className="mb-6">
            {starredOnly
              ? "You don't have any starred flashcards. Try turning off the starred filter."
              : "You don't have any flashcards in your study deck yet. Go to the search page to add some!"}
          </p>
          {starredOnly && (
            <button
              onClick={handleToggleStarredFilter}
              className="bg-[#5a95c2] hover:bg-[#4a85b2] text-white font-bold py-2 px-4 rounded mr-4"
            >
              Show All Cards
            </button>
          )}
          <button
            onClick={() => router.push("/search")}
            className="bg-[#5a95c2] hover:bg-[#4a85b2] text-white font-bold py-2 px-4 rounded"
          >
            Go to Search
          </button>
        </main>
      </div>
    )
  }

  const currentCard = studyDeck[currentIndex]
  const deckName = currentCard.deck_name
  const progress = `${currentIndex + 1}/${studyDeck.length}`

  return (
    <div className="min-h-screen bg-[#f5f3ee]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">{deckName}</h1>
          <p className="text-gray-600">{progress}</p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-6">
          <div
            className="border-4 border-[#c9b991] rounded-lg bg-white p-8 min-h-[300px] flex items-center justify-center cursor-pointer"
            onClick={() => setShowEnglish(!showEnglish)}
          >
            <p className="text-2xl text-center">{showEnglish ? currentCard.english : currentCard.spanish}</p>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleToggleStarred()
              }}
              className="absolute top-2 right-2 p-2"
              aria-label={currentCard.is_starred ? "Unstar card" : "Star card"}
            >
              <Star
                className={`h-6 w-6 ${currentCard.is_starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
              />
            </button>
          </div>

          <div className="absolute top-0 right-0 transform -translate-y-full">
            <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-t">
              Add to my flashcards
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-[#5a95c2] hover:bg-[#4a85b2] disabled:bg-gray-400 text-white font-bold py-2 px-8 rounded w-40"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === studyDeck.length - 1}
            className="bg-[#5a95c2] hover:bg-[#4a85b2] disabled:bg-gray-400 text-white font-bold py-2 px-8 rounded w-40"
          >
            Next
          </button>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="bg-[#5a95c2] hover:bg-[#4a85b2] text-white font-bold py-2 px-8 rounded w-40"
          >
            Back
          </button>

          <button
            onClick={() => router.push("/search")}
            className="bg-[#5a95c2] hover:bg-[#4a85b2] text-white font-bold py-2 px-8 rounded w-40"
          >
            Back to Menu
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleToggleStarredFilter}
            className="inline-flex items-center bg-white border border-gray-300 rounded px-4 py-2"
          >
            <Star className={`h-5 w-5 mr-2 ${starredOnly ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
            {starredOnly ? "Show All Cards" : "Show Starred Only"}
          </button>
        </div>
      </main>
    </div>
  )
}

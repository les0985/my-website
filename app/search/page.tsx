"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { searchSentences, getDeckNames, addToStudyDeck, type Sentence } from "@/lib/supabase"

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDeck, setSelectedDeck] = useState<string>("All Lessons")
  const [deckNames, setDeckNames] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<Sentence[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDeckNames = async () => {
      const names = await getDeckNames()
      setDeckNames(["All Lessons", ...names])
    }

    fetchDeckNames()
  }, [])

  const handleSearch = async () => {
    if (!searchTerm && selectedDeck === "All Lessons") return

    setLoading(true)
    const results = await searchSentences(searchTerm, selectedDeck === "All Lessons" ? undefined : selectedDeck)
    setSearchResults(results)
    setLoading(false)
  }

  const handleAddToStudyDeck = async (sentenceId: number) => {
    const success = await addToStudyDeck(sentenceId)
    if (success) {
      alert("Added to your study deck!")
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3ee]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Flashcard Finder</h1>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for words or phrases"
              className="w-full p-3 border border-gray-300 rounded"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <div className="mt-4">
              <h3 className="font-medium mb-2">Selected Tags:</h3>
              {searchTerm && <div className="bg-[#5a95c2] text-white p-3 rounded inline-block">{searchTerm}</div>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">Course:</label>
              <select className="w-full p-3 border border-gray-300 rounded">
                <option>LearnCraft Spanish</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">From:</label>
              <select
                className="w-full p-3 border border-gray-300 rounded"
                value={selectedDeck}
                onChange={(e) => setSelectedDeck(e.target.value)}
              >
                {deckNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">To:</label>
              <select className="w-full p-3 border border-gray-300 rounded">
                <option>Lesson 250</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="mr-2">Include Spanglish:</label>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300">
                <input type="checkbox" className="sr-only" />
                <span className="block w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out" />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-[#5a95c2] hover:bg-[#4a85b2] text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : searchResults.length > 0 ? (
          <div>
            <div className="flex justify-between items-center bg-[#7a6b5a] text-white p-4 rounded-t">
              <button className="font-medium">Copy Table</button>
              <div>{searchResults.length} flashcards showing</div>
            </div>

            <div className="border border-gray-300 rounded-b overflow-hidden">
              {searchResults.map((sentence) => (
                <div key={sentence.id} className="flex border-b last:border-b-0">
                  <div className="flex-1 p-4 border-r">{sentence.spanish}</div>
                  <div className="flex-1 p-4">{sentence.english}</div>
                  <button
                    onClick={() => handleAddToStudyDeck(sentence.id)}
                    className="bg-green-700 hover:bg-green-800 text-white font-bold px-6 flex items-center justify-center"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          searchTerm && <div className="text-center py-8">No results found. Try a different search term.</div>
        )}
      </main>
    </div>
  )
}

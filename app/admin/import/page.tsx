"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [deckName, setDeckName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setMessage("Please select a CSV file")
      setIsError(true)
      return
    }

    setLoading(true)
    setMessage("")
    setIsError(false)

    const formData = new FormData()
    formData.append("file", file)
    if (deckName) {
      formData.append("deckName", deckName)
    }

    try {
      const response = await fetch("/api/import-csv", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to import CSV")
      }

      setMessage(data.message)
      setIsError(false)
      setFile(null)
      setDeckName("")
    } catch (error) {
      console.error("Error importing CSV:", error)
      setMessage(error instanceof Error ? error.message : "An error occurred")
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3ee]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Import CSV</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="file" className="block mb-1">
                CSV File
              </label>
              <input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <p className="text-sm text-gray-500 mt-1">
                CSV should have columns: english, spanish, deck_name (optional)
              </p>
            </div>

            <div>
              <label htmlFor="deckName" className="block mb-1">
                Deck Name (optional)
              </label>
              <input
                id="deckName"
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="e.g., Lesson 1"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <p className="text-sm text-gray-500 mt-1">
                If provided, this will override the deck_name column in the CSV
              </p>
            </div>

            {message && (
              <div
                className={`p-3 ${isError ? "bg-red-100 border-red-400 text-red-800" : "bg-green-100 border-green-400 text-green-800"} rounded border`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#5a95c2] hover:bg-[#4a85b2] text-white font-bold py-2 px-4 rounded"
              >
                {loading ? "Importing..." : "Import CSV"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

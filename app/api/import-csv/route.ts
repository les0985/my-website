import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Get the CSV data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Parse CSV content
    const text = await file.text()
    const rows = text.split("\n").map((row) => row.split(","))

    // Skip header row
    const dataRows = rows.slice(1)

    // Extract deck name from file name or form data
    const deckName = (formData.get("deckName") as string) || "Unknown Deck"

    // Prepare data for insertion
    const sentences = dataRows
      .map((row) => {
        if (row.length >= 2) {
          return {
            english: row[0]?.trim(),
            spanish: row[1]?.trim(),
            deck_name: row[2]?.trim() || deckName,
          }
        }
        return null
      })
      .filter(Boolean)

    // Insert data into Supabase
    const { data, error } = await supabase.from("sentences").insert(sentences)

    if (error) {
      console.error("Error importing CSV:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${sentences.length} sentences successfully`,
    })
  } catch (error) {
    console.error("Error processing CSV import:", error)
    return NextResponse.json(
      {
        error: "Failed to process CSV import",
      },
      { status: 500 },
    )
  }
}

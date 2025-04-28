import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Sentence = {
  id: number
  english: string
  spanish: string
  deck_name: string
  is_starred?: boolean
}

export async function searchSentences(searchTerm: string, deckName?: string): Promise<Sentence[]> {
  let query = supabase.from("sentences").select("*")

  if (searchTerm) {
    query = query.or(`english.ilike.%${searchTerm}%,spanish.ilike.%${searchTerm}%`)
  }

  if (deckName && deckName !== "All Lessons") {
    query = query.eq("deck_name", deckName)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching sentences:", error)
    return []
  }

  return data || []
}

export async function getDeckNames(): Promise<string[]> {
  const { data, error } = await supabase.from("sentences").select("deck_name").order("deck_name")

  if (error) {
    console.error("Error fetching deck names:", error)
    return []
  }

  // Extract unique deck names
  const uniqueDeckNames = [...new Set(data.map((item) => item.deck_name))]
  return uniqueDeckNames
}

export async function addToStudyDeck(sentenceId: number): Promise<boolean> {
  // Check if the sentence is already in the study deck
  const { data: existing } = await supabase.from("study_deck").select("id").eq("sentence_id", sentenceId).single()

  if (existing) {
    // Already in study deck
    return true
  }

  const { error } = await supabase.from("study_deck").insert({ sentence_id: sentenceId })

  if (error) {
    console.error("Error adding to study deck:", error)
    return false
  }

  return true
}

export async function getStudyDeck(starredOnly = false): Promise<Sentence[]> {
  let query = supabase.from("study_deck").select(`
      id,
      sentence_id,
      is_starred,
      sentences:sentence_id(*)
    `)

  if (starredOnly) {
    query = query.eq("is_starred", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching study deck:", error)
    return []
  }

  // Transform the data to match the Sentence type
  return data.map((item) => ({
    ...item.sentences,
    is_starred: item.is_starred,
  }))
}

export async function toggleStarred(sentenceId: number, isStarred: boolean): Promise<boolean> {
  const { error } = await supabase.from("study_deck").update({ is_starred: isStarred }).eq("sentence_id", sentenceId)

  if (error) {
    console.error("Error updating starred status:", error)
    return false
  }

  return true
}

export async function removeFromStudyDeck(sentenceId: number): Promise<boolean> {
  const { error } = await supabase.from("study_deck").delete().eq("sentence_id", sentenceId)

  if (error) {
    console.error("Error removing from study deck:", error)
    return false
  }

  return true
}

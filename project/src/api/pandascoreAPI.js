import axios from "axios"

// API Token
const TOKEN = "c8_-vkD8efogVVy52d0iMpl9MPWMECT-LdMZ5I05b_HRQeKBuqM"

// Create API client with the same baseURL
const api = axios.create({
  baseURL: "/api", // This will be handled by Vercel rewrites in production
  params: {
    token: TOKEN,
  },
})

const GAME_SLUGS = ["lol", "csgo", "dota2", "valorant"]

export const getAllTournaments = async () => {
  try {
    console.log("Fetching all tournaments...")
    const allTournaments = await Promise.all(
      GAME_SLUGS.map(async (slug) => {
        console.log(`Fetching tournaments for ${slug}...`)
        // This will work both locally and in production
        const response = await api.get(`/${slug}/tournaments`)
        console.log(`Received ${response.data.length} tournaments for ${slug}`)

        return response.data.map((tournament) => ({
          id: tournament.id.toString(),
          name: tournament.name,
          status: "upcoming",
          startTime: tournament.begin_at,
          game: {
            id: slug,
            name: tournament.videogame?.name || slug,
          },
          teams: (tournament.teams || []).slice(0, 2).map((team) => ({
            id: team.id?.toString(),
            name: team.name,
            logo: team.image_url,
          })),
          odds: [1.5, 2.2],
        }))
      }),
    )

    const result = allTournaments.flat()
    console.log(`Total tournaments fetched: ${result.length}`)
    return result
  } catch (error) {
    console.error("❌ Error fetching all tournaments:", error)
    if (error.response) {
      console.error("Response data:", error.response.data)
      console.error("Response status:", error.response.status)
    }
    throw error
  }
}

import axios from "axios"

const BASE_URL = "https://api.pandascore.co"
const GAME_SLUGS = ["lol", "csgo", "dota2", "valorant"]

// Перевірка токену
const TOKEN = "c8_-vkD8efogVVy52d0iMpl9MPWMECT-LdMZ5I05b_HRQeKBuqM"

if (!TOKEN) {
  console.warn("⚠️ PANDASCORE API token is missing! Make sure it's defined in .env.local as NEXT_PUBLIC_PANDASCORE_API_TOKEN")
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
})
  

export const getAllTournaments = async () => {
  try {
    const allTournaments = await Promise.all(
      GAME_SLUGS.map(async (slug) => {
        const response = await api.get(`/${slug}/tournaments`);
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
        }));
      })
    );

    return allTournaments.flat();
  } catch (error) {
    console.error("❌ Error fetching all tournaments:", error);
    throw error;
  }
};

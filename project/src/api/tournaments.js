import axios from 'axios';

const BASE_URL = "https://api.pandascore.co";
const TOKEN = process.env.NEXT_PUBLIC_PANDASCORE_API_TOKEN;

if (!TOKEN) {
  console.error("Missing Pandascore API token!");
}

export default async (req, res) => {
  try {
    const { slug } = req.query;
    const response = await axios.get(`${BASE_URL}/${slug}/tournaments`, {
      params: { token: TOKEN },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
};

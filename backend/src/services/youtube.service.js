import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

//To search by season in YouTube
const getSeasonQuery = (dateStr) => {
    if (!dateStr) return null;
    const month = new Date(dateStr).getMonth() + 1;
    return null;
};

export const searchYouTubeVideos = async (locationName, country, latitude, departureDate) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    //Reminder: Southern Hemisphere has inverted seasons
    const getSeason = (month, isNorthern) => {
        const seasons = isNorthern
            ? { winter:[12,1,2], spring:[3,4,5], summer:[6,7,8], fall:[9,10,11] }
            : { summer:[12,1,2], fall:[3,4,5], winter:[6,7,8], spring:[9,10,11] };
        return Object.entries(seasons).find(([, months]) => months.includes(month))?.[0];
    };

    const month = departureDate ? new Date(departureDate).getMonth() + 1 : new Date().getMonth() + 1;
    const monthName = new Date(0, month - 1).toLocaleString("en-US", { month: "long" });
    const isNorthern = latitude >= 0;
    const season = getSeason(month, isNorthern);

    const queries = [
        `${locationName} ${season} travel`,
        `${locationName} travel`,
        `${country} travel`
    ];

    for (const q of queries) {
        try {
            const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    part: "snippet",
                    q,
                    type: "video",
                    maxResults: 3,
                    relevanceLanguage: "en",
                    key: apiKey
                }
            });
            if (response.data.items?.length) {
            return {
                query: q,
                videos: response.data.items.map(item => ({
                    videoId: item.id.videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.medium.url,
                    channel: item.snippet.channelTitle
                }))
            };
        }

        } catch (err) {
            console.error("YouTube API error:", err.response?.data || err.message);
            break;
        }
    }

    return { query: null, videos: [] };
};
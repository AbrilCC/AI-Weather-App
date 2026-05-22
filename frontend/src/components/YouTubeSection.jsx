export default function YouTubeSection({ videos, locationName }) {
    if (!videos?.length) return null;

    const decodeHtml = (str) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value;
    };

    const searchQuery = encodeURIComponent(`${locationName} travel`);

    return (
        <div className="youtube-section">
            <h3>Might interest you:</h3>
            <div className="youtube-grid">
                {videos.map(video => (
                    <a key={video.videoId}
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="youtube-card">

                        <img src={video.thumbnail} alt={video.title} />
                        <div className="youtube-info">
                            <p className="youtube-title">{decodeHtml(video.title)}</p>
                            <p className="youtube-channel">{video.channel}</p>
                        </div>
                    </a>
                ))}
            </div>
            <a href={`https://www.youtube.com/results?search_query=${searchQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-more-btn">
                See more on YouTube →
            </a>
        </div>
    );
}
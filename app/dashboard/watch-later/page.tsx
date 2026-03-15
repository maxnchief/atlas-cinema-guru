"use client";

import { useEffect, useState } from "react";
import { Star, StarOff, Clock } from "lucide-react";

interface WatchLaterMovie {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  genres: string[];
  favorited: boolean;
  watchLater: boolean;
  image: string;
}

export default function WatchLaterPage() {
  const [movies, setMovies] = useState<WatchLaterMovie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch watch later from API
  const PAGE_SIZE = 8;
  const [totalPages, setTotalPages] = useState(1);
  const fetchWatchLater = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/watch-later?page=${page}`);
      const data = await res.json();
      setMovies(data.watchLater || []);
      setTotalPages(data.totalPages || (data.watchLater ? Math.max(1, Math.ceil((data.watchLater.length || 0) / PAGE_SIZE)) : 1));
    } catch (err) {
      console.error("Failed to fetch watch-later:", err);
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchLater();
  }, [page]);

  const toggleFavorite = (id: string, favorited: boolean) => {
    // Toggle favorite via API
    fetch(`/api/favorites/${id}`, { method: favorited ? "DELETE" : "POST" })
      .then(() => fetchWatchLater())
      .catch((err) => console.error("Failed to toggle favorite:", err));
  };

  const toggleWatchLater = (id: string) => {
    // Remove from watch later via API
    fetch(`/api/watch-later/${id}`, { method: "DELETE" })
      .then(() => fetchWatchLater())
      .catch((err) => console.error("Failed to remove from watch-later:", err));
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">⏰ My Watch Later</h1>
      {loading ? (
        <p className="text-gray-400">Loading watch-later movies...</p>
      ) : movies.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from(new Map(movies.map(m => [m.id, m])).values()).map((movie) => (
            <div
              key={movie.id}
              className="relative group bg-[#0b0b4a] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                <h2 className="text-lg font-bold text-[#1ED2AF]">{movie.title}</h2>
                <p className="text-xs text-gray-200 line-clamp-2">{movie.synopsis}</p>
                <p className="text-sm mt-2 text-[#1ED2AF]">
                  {movie.releaseYear} • {(movie.genres || []).join(", ")}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => toggleFavorite(movie.id, movie.favorited)}
                    className="hover:scale-110 transition"
                  >
                    {movie.favorited ? (
                      <Star className="text-yellow-400" />
                    ) : (
                      <StarOff className="text-yellow-400" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleWatchLater(movie.id)}
                    className="hover:scale-110 transition"
                  >
                    <Clock className={movie.watchLater ? "text-[#1ED2AF]" : "text-gray-300"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 col-span-full">No movies in Watch Later.</p>
      )}
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-[#0b0b4a] rounded-md hover:bg-[#1ED2AF]/20 disabled:opacity-50 transition"
        >
          ◀ Prev
        </button>
        <span className="text-sm text-[#1ED2AF]">Page {page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-4 py-2 bg-[#0b0b4a] rounded-md hover:bg-[#1ED2AF]/20 transition"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

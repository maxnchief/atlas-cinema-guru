"use client";

import { useEffect, useState } from "react";
import { Star, StarOff, Clock } from "lucide-react";

interface FavoriteMovie {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  genres: string[];
  favorited: boolean;
  watchLater: boolean;
  image: string;
}

export default function FavoritesPage() {
  const [movies, setMovies] = useState<FavoriteMovie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const PAGE_SIZE = 8;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch favorites from API
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/favorites?page=${page}`);
      const data = await res.json();
      setMovies(data.favorites || []);
      // If API returns total count, use it for pagination. Otherwise, estimate pages.
      setTotalPages(data.totalPages || (data.favorites ? Math.max(1, Math.ceil((data.favorites.length || 0) / PAGE_SIZE)) : 1));
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [page]);

  const toggleFavorite = (id: string) => {
    // Remove favorite via API
    fetch(`/api/favorites/${id}`, { method: "DELETE" })
      .then(() => fetchFavorites())
      .catch((err) => console.error("Failed to remove favorite:", err));
  };

  const toggleWatchLater = (id: string, watchLater: boolean) => {
    // Toggle watch later via API
    fetch(`/api/watch-later/${id}`, { method: watchLater ? "DELETE" : "POST" })
      .then(() => fetchFavorites())
      .catch((err) => console.error("Failed to toggle watch later:", err));
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-[#1ED5AF]">💛 My Favorites</h1>
      {loading ? (
        <p className="text-gray-400">Loading favorites...</p>
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
                <h2 className="text-lg font-bold text-[#1ED5AF]">{movie.title}</h2>
                <p className="text-xs text-gray-200 line-clamp-2">{movie.synopsis}</p>
                <p className="text-sm mt-2 text-[#1ED5AF]">
                  {movie.releaseYear} • {(movie.genres || []).join(", ")}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => toggleFavorite(movie.id)}
                    className="hover:scale-110 transition"
                  >
                    <Star className="text-yellow-400" />
                  </button>
                  <button
                    onClick={() => toggleWatchLater(movie.id, movie.watchLater)}
                    className="hover:scale-110 transition"
                  >
                    <Clock className={movie.watchLater ? "text-[#1ED5AF]" : "text-gray-300"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 col-span-full">No favorites found.</p>
      )}
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-[#0b0b4a] rounded-md hover:bg-[#1ED5AF]/20 disabled:opacity-50 transition"
        >
          ◀ Prev
        </button>
        <span className="text-sm text-[#1ED5AF]">Page {page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-4 py-2 bg-[#0b0b4a] rounded-md hover:bg-[#1ED5AF]/20 transition"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

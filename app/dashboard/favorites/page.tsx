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

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/favorites?page=${page}`);
      const data = await res.json();

      // Map API response to expected structure
      const mappedMovies = (data.favorites || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        synopsis: m.synopsis,
        releaseYear: m.released,
        genres: m.genre ? [m.genre] : [],
        favorited: true, // All on this page are favorited
        watchLater: m.watchLater || false,
        image: m.image || "/placeholder.jpg",
      }));

      setMovies(mappedMovies);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [page]);

  const toggleFavorite = async (id: string) => {
    try {
      await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      fetchFavorites();
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const toggleWatchLater = async (id: string, watchLater: boolean) => {
    try {
      await fetch(`/api/watch-later/${id}`, {
        method: watchLater ? "DELETE" : "POST",
      });
      fetchFavorites();
    } catch (err) {
      console.error("Failed to toggle watch later:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💛 My Favorites</h1>

      {loading ? (
        <p className="text-gray-400">Loading favorites...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {movies.length ? (
              movies.map((movie) => (
                <div
                  key={movie.id}
                  className="relative group bg-[#0b0b4a] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                    <h2 className="text-lg font-bold">{movie.title}</h2>
                    <p className="text-xs text-gray-300 line-clamp-2">
                      {movie.synopsis}
                    </p>
                    <p className="text-sm mt-2 text-[#1ED2AF]">
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
                        onClick={() =>
                          toggleWatchLater(movie.id, movie.watchLater)
                        }
                        className="hover:scale-110 transition"
                      >
                        <Clock
                          className={`${
                            movie.watchLater ? "text-blue-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full">
                No favorites found.
              </p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-[#0b0b4a] rounded-md hover:bg-[#1ED2AF]/20 disabled:opacity-50"
            >
              ◀ Prev
            </button>
            <span className="text-sm">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-[#0b0b4a] rounded-md hover:bg-[#1ED2AF]/20"
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const movies = pgTable("movies", {
  id: varchar("id").primaryKey(),
  tmdbId: integer("tmdb_id").unique().notNull(),
  title: text("title").notNull(),
  overview: text("overview"),
  releaseDate: text("release_date"),
  runtime: integer("runtime"),
  rating: real("rating"),
  genres: jsonb("genres").$type<string[]>().default([]),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  cast: jsonb("cast").$type<Array<{name: string, character: string, profilePath?: string}>>().default([]),
  director: text("director"),
  studio: text("studio"),
  language: text("language").default("en"),
  country: text("country").default("US"),
});

export const tvShows = pgTable("tv_shows", {
  id: varchar("id").primaryKey(),
  tmdbId: integer("tmdb_id").unique().notNull(),
  title: text("title").notNull(),
  overview: text("overview"),
  firstAirDate: text("first_air_date"),
  lastAirDate: text("last_air_date"),
  numberOfSeasons: integer("number_of_seasons").default(1),
  numberOfEpisodes: integer("number_of_episodes").default(1),
  rating: real("rating"),
  genres: jsonb("genres").$type<string[]>().default([]),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  cast: jsonb("cast").$type<Array<{name: string, character: string, profilePath?: string}>>().default([]),
  creator: text("creator"),
  studio: text("studio"),
  language: text("language").default("en"),
  country: text("country").default("US"),
});

export const episodes = pgTable("episodes", {
  id: varchar("id").primaryKey(),
  tvShowId: varchar("tv_show_id").references(() => tvShows.id).notNull(),
  seasonNumber: integer("season_number").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  title: text("title").notNull(),
  overview: text("overview"),
  airDate: text("air_date"),
  runtime: integer("runtime"),
  rating: real("rating"),
  stillPath: text("still_path"),
});

export const watchlist = pgTable("watchlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  contentId: varchar("content_id").notNull(),
  contentType: text("content_type").notNull(), // 'movie' or 'tv'
  addedAt: text("added_at").default(sql`datetime('now')`),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
});

export const insertTvShowSchema = createInsertSchema(tvShows).omit({
  id: true,
});

export const insertEpisodeSchema = createInsertSchema(episodes).omit({
  id: true,
});

export const insertWatchlistSchema = createInsertSchema(watchlist).omit({
  id: true,
  addedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;

export type InsertTvShow = z.infer<typeof insertTvShowSchema>;
export type TvShow = typeof tvShows.$inferSelect;

export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type Episode = typeof episodes.$inferSelect;

export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type WatchlistItem = typeof watchlist.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

import { useMemo, useState } from "react";
import { BookOpen, CalendarDays, Flame, Heart, Library, Star, User, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { allTitles } from "@/data/catalog";
import { useLibrary } from "@/contexts/LibraryContext";
import EmptyState from "@/components/common/EmptyState";
import SectionHeader from "@/components/common/SectionHeader";
import TitleCard from "@/components/common/TitleCard";
import { displayTitle, progressLabel } from "@/lib/title";

export default function ProfilePage() {
  const { entries, favorites, continueItems, stats } = useLibrary();
  const [username, setUsername] = useState("Gaurav");
  const [bio, setBio] = useState("Anime, manga, manhwa, manhua, and novel enthusiast.");
  const [saved, setSaved] = useState(false);

  const recent = useMemo(() => entries.slice(0, 6), [entries]);
  const completed = useMemo(() => entries.filter((entry) => entry.status === "completed"), [entries]);
  const totalProgress = entries.reduce((sum, entry) => sum + entry.progress, 0);
  const totalLength = entries.reduce((sum, entry) => sum + entry.totalProgress, 0);

  const handleSave = () => {
    window.localStorage.setItem("gauravanime:profile", JSON.stringify({ username, bio }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <main className="container py-12">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-br from-primary/15 via-background to-accent/10 p-8 sm:p-12">
        <div className="absolute right-10 top-10 text-primary/20"><User className="h-28 w-28" /></div>
        <div className="relative max-w-2xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-2xl font-extrabold text-white shadow-lg shadow-primary/25">{username.charAt(0).toUpperCase()}</div>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Your profile</h1>
          <p className="mt-3 text-muted-foreground">A local-first profile for your GAURAVANIME journey.</p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5"><Library className="h-5 w-5 text-primary" /><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Library</p><p className="mt-1 font-display text-3xl font-extrabold">{entries.length}</p></div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5"><Heart className="h-5 w-5 text-accent" /><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Favorites</p><p className="mt-1 font-display text-3xl font-extrabold">{favorites.length}</p></div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5"><Flame className="h-5 w-5 text-amber-400" /><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed</p><p className="mt-1 font-display text-3xl font-extrabold">{completed.length}</p></div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5"><Zap className="h-5 w-5 text-sky-400" /><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progress</p><p className="mt-1 font-display text-3xl font-extrabold">{progressLabel(totalProgress, totalLength || undefined)}</p></div>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
          <SectionHeader title="Profile details" description="Your profile is stored locally in this browser." />
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display name</label>
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="mb-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</label>
          <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={4} className="mb-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
          <button onClick={handleSave} className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5">{saved ? "Saved" : "Save profile"}</button>
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="h-4 w-4" /> Member since 2026</div>
        </div>

        <div>
          <SectionHeader title="Recent activity" description="The latest titles you added or updated." />
          {recent.length === 0 ? <EmptyState icon="heart" title="No activity yet" description="Add your first title from the catalogue to begin your journey." actionLabel="Browse catalogue" actionHref="/browse" /> : (
            <div className="grid gap-3">
              {recent.map((entry) => {
                const title = allTitles.find((item) => item.id === entry.titleId);
                if (!title) return null;
                return (
                  <Link key={entry.titleId} to={`/${title.type}/${title.id}`} className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/40 p-3 transition hover:border-primary/40 hover:bg-card/70">
                    <img src={title.image} alt={displayTitle(title)} className="h-14 w-10 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{displayTitle(title)}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Updated {new Date(entry.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-primary">{entry.status.replace(/_/g, " ")}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="container py-12">
        <SectionHeader title="Favorites" description="Titles you have marked as favorites." />
        {favorites.length === 0 ? <EmptyState icon="heart" title="No favorites yet" description="Tap the heart on any title to keep it close." actionLabel="Explore titles" actionHref="/browse" /> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{favorites.map((entry) => { const title = allTitles.find((item) => item.id === entry.titleId); return title ? <TitleCard key={entry.titleId} title={title} /> : null; })}</div>}</section>

      <section className="container pb-24 pt-12">
        <SectionHeader title="Reading and watching stats" description="A quick snapshot of your local collection." />
        <div className="grid gap-4 rounded-2xl border border-border/50 bg-card/40 p-6 sm:grid-cols-3">
          <div><BookOpen className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-semibold">Average rating</p><p className="mt-1 font-display text-2xl font-extrabold">{stats.averageRating ? `${stats.averageRating.toFixed(1)} / 10` : "Not rated yet"}</p></div>
          <div><Star className="h-5 w-5 text-amber-400" /><p className="mt-3 text-sm font-semibold">Total progress</p><p className="mt-1 font-display text-2xl font-extrabold">{progressLabel(totalProgress, totalLength || undefined)}</p></div>
          <div><Flame className="h-5 w-5 text-accent" /><p className="mt-3 text-sm font-semibold">Currently in progress</p><p className="mt-1 font-display text-2xl font-extrabold">{continueItems.length}</p></div>
        </div>
      </section>
    </main>
  );
}

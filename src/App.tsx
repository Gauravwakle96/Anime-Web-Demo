import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { ToastContextProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const HomePage = lazy(() => import("@/pages/HomePage"));
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const DetailsPage = lazy(() => import("@/pages/DetailsPage"));
const LibraryPage = lazy(() => import("@/pages/LibraryPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const AdminUsersPage = lazy(() => import("@/pages/AdminUsersPage"));

export default function App() {
  return (
    <ToastContextProvider>
      <AuthProvider>
        <LibraryProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes — no auth required */}
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<CatalogPage />} />
                  <Route path="/anime" element={<CatalogPage />} />
                  <Route path="/manga" element={<CatalogPage />} />
                  <Route path="/manhwa" element={<CatalogPage />} />
                  <Route path="/manhua" element={<CatalogPage />} />
                  <Route path="/novels" element={<CatalogPage />} />
                  <Route path="/search" element={<CatalogPage />} />
                  <Route path="/genre/:genre" element={<CatalogPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/:type/:id" element={<DetailsPage />} />
                  <Route path="*" element={<NotFoundPage />} />

                  {/* Protected routes — require authentication */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/library" element={<LibraryPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>
        </LibraryProvider>
      </AuthProvider>
    </ToastContextProvider>
  );
}

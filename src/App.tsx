import { Routes, Route } from "react-router-dom";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { ToastContextProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import DetailsPage from "@/pages/DetailsPage";
import LibraryPage from "@/pages/LibraryPage";
import ProfilePage from "@/pages/ProfilePage";
import CalendarPage from "@/pages/CalendarPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <ToastContextProvider>
      <AuthProvider>
      <LibraryProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route element={<ProtectedRoute />}>
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
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/:type/:id" element={<DetailsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </LibraryProvider>
      </AuthProvider>
    </ToastContextProvider>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import Resources from "./pages/Resources";
import BreathingExercise from "./pages/BreathingExercise";
import EmergencyContacts from "./pages/EmergencyContacts";
import PsychoEducation from "./pages/PsychoEducation";
import PsychoLesson from "./pages/PsychoLesson";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/breathing" element={<BreathingExercise />} />
          <Route path="/resources/emergency" element={<EmergencyContacts />} />
          <Route path="/resources/psychoeducation" element={<PsychoEducation />} />
          <Route path="/resources/psychoeducation/:id" element={<PsychoLesson />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
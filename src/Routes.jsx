import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import FamilyMemoriesScrapbookPage from './pages/family-memories-scrapbook-page';
import BirthdayCountdownLandingPage from './pages/birthday-countdown-landing-page';
import GirlyDashboard from './pages/girly-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<GirlyDashboard />} />
        <Route path="/girly-dashboard" element={<GirlyDashboard />} />
        <Route path="/family-memories-scrapbook-page" element={<FamilyMemoriesScrapbookPage />} />
        <Route path="/birthday-countdown-landing-page" element={<BirthdayCountdownLandingPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
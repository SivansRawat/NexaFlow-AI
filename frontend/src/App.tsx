"use client"

import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PayButton from "./components/razorpay/PayButton";
import { Header } from "@/components/homepage/header";
import { InteractiveFeatureCards } from "@/components/homepage/interactive-feature-cards";
import { HowItWorks } from "@/components/homepage/how-it-works";
import { MainHero } from "@/components/homepage/main-hero";
import { Footer } from "@/components/homepage/footer";
import { ConnectUs } from "@/components/homepage/connectus";
import SEO from "./components/common/SEO";
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loaded suite & feature components
const EmailWizardPage = lazy(() => import("./components/premium/mailcraftai/EmailWizardPage"));
const SubjectLineOptimizer = lazy(() => import("./components/premium/mailcraftai/subjectlineoptimizer"));
const TonePolisher = lazy(() => import("./components/premium/mailcraftai/tonepolisher"));
const PremiumDashboard = lazy(() => import("./components/premium/premium"));
const ChartBuilderPage = lazy(() => import("./components/premium/excel/ChartBuilderPage"));
const AISheetSummarizerPage = lazy(() => import("./components/premium/excel/AISheetSummarizerPage"));
const ExcelSuitePage = lazy(() => import("./components/premium/excel/ExcelSuitePage"));
const PDFHubPage = lazy(() => import("./components/premium/pdf/PDFHubPage"));
const AIWorkmatePage = lazy(() => import("./components/premium/aiworkmate/AIWorkmatePage"));
const AIAgentPage = lazy(() => import("./components/premium/aiworkmate/AIAgentPage"));
const MailCraftPage = lazy(() => import("./components/premium/mailcraftai/MailCraftPage"));
const SocialProPage = lazy(() => import("./components/premium/socialpro/SocialProPage"));
const CaptionProPage = lazy(() => import("./components/premium/socialpro/CaptionProPage"));
const HashtagStrategistPage = lazy(() => import("./components/premium/socialpro/HashtagStrategistPage"));
const AdCaptionGeneratorPage = lazy(() => import("./components/premium/socialpro/AdCaptionGeneratorPage"));
const SmartDocsPage = lazy(() => import("./components/premium/smartdocs/SmartDocsPage"));
const OfferLetterGeneratorPage = lazy(() => import("./components/premium/smartdocs/OfferLetterGeneratorPage"));
const DataFillPage = lazy(() => import("./components/premium/datafill/DataFillPage"));
const BulkMailerPage = lazy(() => import("./components/premium/bulkmailer/BulkMailerPage"));
const ExcelToEmailEnginePage = lazy(() => import("./components/premium/bulkmailer/ExcelToEmailEnginePage"));
const SmartTemplateLibraryPage = lazy(() => import("./components/premium/bulkmailer/SmartTemplateLibraryPage"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./components/admin/Adminlogin"));
const Dashboard = lazy(() => import("./components/premium/components/Dashboard"));
const ExcelSuite = lazy(() => import("./components/premium/components/ExcelSuite"));
const ErrorTrendDetectorNew = lazy(() => import('./components/premium/excel/ErrorTrendDetectorNew'));
const FormulaMaster = lazy(() => import("./components/premium/excel/FormulaMaster"));
const ExportWizard = lazy(() => import("./components/premium/excel/ExportWizard"));
const Settings = lazy(() => import("./components/premium/Settings"));
const PDFBrainPageWrapper = lazy(() => import("./components/premium/pdf/PDFBrainPageWrapper"));
const PDFChatAgentPage = lazy(() => import("./components/premium/pdf/PDFChatAgentPage"));
const SmartInvoiceGeneratorPage = lazy(() => import("./components/premium/smartdocs/SmartInvoiceGeneratorPage"));
const CaptionRewriterPage = lazy(() => import("./components/premium/socialpro/CaptionRewriterPage"));
const SmartDataExtractorPage = lazy(() => import("./components/premium/pdf/SmartDataExtractorPage"));
const PDFConverterPro = lazy(() => import("./components/premium/pdf/PDFConverterPro"));
const MailMergeAI = lazy(() => import("./components/premium/bulkmailer/mailmergeai"));
const BulkPDFToolkitPage = lazy(() => import("./components/premium/pdf/BulkPDFToolkitPage"));

import PageLoader from "./components/common/PageLoader";

function SuiteLoadingFallback() {
  return <PageLoader label="Loading Suite Module..." />;
}

function HomePage() {
  return (
    <div className="text-white relative overflow-hidden">
      <SEO
        title="Universal RAG & Enterprise AI Automation Suite"
        description="Transform your workflow with NexaFlow AI. Powerful PDF document intelligence, Excel formula automation, MailCraft AI copywriting, and enterprise vector search RAG."
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "NexaFlow AI",
          "operatingSystem": "Web, All",
          "applicationCategory": "BusinessApplication",
          "description": "Enterprise AI automation suite featuring Universal RAG vector retrieval, PDF Intelligence, Excel analytics, MailCraft AI, and SocialPro AI.",
          "url": "https://nexa-flow-ai.vercel.app/",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
          }
        }}
      />
      <Header />
      <div className="relative z-10">
        <div className="pb-8">
          <MainHero />
        </div>
        <div className="pt-4">
          <InteractiveFeatureCards />
        </div>
        <HowItWorks />
        <ConnectUs />
      </div>
      <Footer />
    </div>
  );
}

// Route guards

function PremiumRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Admin route guard
function AdminRoute({ children }: { children: React.ReactNode }) {
  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  if (!adminToken) return <Navigate to="/adminlogin" replace />;
  return <>{children}</>;
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <PageLoader label="Authenticating Account..." />;
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
        toastClassName="custom-toast"
      />
      <div className="fade-in">
        <Suspense fallback={<SuiteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Full-screen SmartDocs routes (outside premium layout) */}
            <Route path="/smartdocs/offerletter" element={<OfferLetterGeneratorPage />} />
            <Route path="/smartdocs/smartinvoice" element={<SmartInvoiceGeneratorPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/paynow" element={<PayButton />} />
            <Route element={<PremiumRoute />}>
              <Route path="/premium" element={<PremiumDashboard />}>
                <Route index element={<Dashboard />} />
                <Route path="excel" element={<ExcelSuitePage />}>
                  <Route index element={<ExcelSuite />} />
                  <Route path="chartbuilder" element={<ChartBuilderPage />} />
                  <Route path="aisheet/:chatId?" element={<AISheetSummarizerPage />} />
                  <Route path="formulamaster/:chatId?" element={<FormulaMaster />} />
                  <Route path="detect/:analysisId?" element={<ErrorTrendDetectorNew />} />
                  <Route path="exportwizard" element={<ExportWizard />} />
                </Route>
                <Route path="pdfhub" element={<PDFHubPage />} />
                <Route path="pdfhub/brain" element={<PDFBrainPageWrapper />} />
                <Route path="pdfhub/chatagent" element={<PDFChatAgentPage />} />
                <Route path="pdfhub/smartdata" element={<SmartDataExtractorPage />} />  
                <Route path="pdfhub/bulk-toolkit" element={<BulkPDFToolkitPage />} />
                <Route path="pdfhub/converterpro" element={<PDFConverterPro />} />
                <Route path="aiworkmate/:sessionId?" element={<AIWorkmatePage />} />
                <Route path="aiworkmate/aiagent" element={<AIAgentPage />} />
                <Route path="mailcraft" element={<MailCraftPage />} />
                <Route path="mailcraft/emailwizard" element={<EmailWizardPage/>} />
                <Route path="mailcraft/subjectlineoptimizer" element={<SubjectLineOptimizer/>} />
                <Route path="mailcraft/tonepolisher" element={<TonePolisher/>} />
                <Route path="socialpro" element={<SocialProPage />} />
                <Route path="socialpro/captionpro" element={<CaptionProPage />} />
                <Route path="socialpro/hashtagstrategist" element={<HashtagStrategistPage />} />
                <Route path="socialpro/adcaption" element={<AdCaptionGeneratorPage />} />
                <Route path="socialpro/captionrewriter" element={<CaptionRewriterPage />} />
                <Route path="smartdocs" element={<SmartDocsPage />} />
                <Route path="bulkmailer/mailmergeai" element={<MailMergeAI />} />
                <Route path="datafill" element={<DataFillPage />} />
                <Route path="bulkmailer" element={<BulkMailerPage />} />
                <Route path="bulkmailer/smarttemplates" element={<SmartTemplateLibraryPage />} />
                <Route path="bulkmailer/excel-engine" element={<ExcelToEmailEnginePage />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/adminlogin" element={<AdminLogin/>}/>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;

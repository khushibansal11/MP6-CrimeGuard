import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import QueryAnalysis from "./pages/QueryAnalysis";
import PredictiveAnalysis from "./pages/PredictiveAnalysis";
import GraphAnalysis from "./pages/GraphAnalysis";
import CrimeMap from "./pages/CrimeMap";
import CrimeTrends from "./pages/CrimeTrends";
import CrimeStats from "./pages/CrimeStats";
import CrimeSeverityHeatmap from "./pages/CrimeSeverityHeatmap";
import AboutCrimeGuard from "./pages/About";
import ContactUs from "./pages/Contact";

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/services" element={<Services />} />
        {/* <Route path="/contact" element={<Contact />} /> */}

        <Route path="/service/query-analysis" element={<QueryAnalysis />}/>
        <Route path="/service/predictive-analysis" element={<PredictiveAnalysis />}/>
        <Route path="/service/graph-analysis" element={<GraphAnalysis />}/>
        <Route path="/service/crime-map" element={<CrimeMap />}/>
        <Route path="/service/crime-trends" element={<CrimeTrends />}/>
        <Route path="/service/crime-stats" element={<CrimeStats />}/>
        <Route path="/service/crime-severity-heatmap" element={<CrimeSeverityHeatmap />}/>
        <Route path="/about" element={<AboutCrimeGuard />}/>
        <Route path="/contact" element={<ContactUs />}/>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
};

export default App;

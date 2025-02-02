import { useState } from "react";
import { useEffect } from "react";
import { CVupload } from "./components/cv-upload/CVupload"
import { getCvAnalysis } from "./services/cvServiceApi";
import { CVAnalysis } from "./types/cv_types";
import Interview from "./components/interview/Interview";

function App() {
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);

  useEffect(() => {
    const fetchCvAnalysis = async () => {
      const cvAnalysis = await getCvAnalysis();
      setCvAnalysis(cvAnalysis);
    }
    fetchCvAnalysis();
  }, []);

  return <>{!cvAnalysis ? <CVupload onUpload={() => {}} /> : <Interview />}</>
}

export default App

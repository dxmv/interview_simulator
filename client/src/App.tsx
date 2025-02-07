import { useState } from "react";
import { useEffect } from "react";
import Register from "./components/register/Register";

function App() {
  // const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);

  // useEffect(() => {
  //   const fetchCvAnalysis = async () => {
  //     const cvAnalysis = await getCvAnalysis();
  //     setCvAnalysis(cvAnalysis);
  //   }
  //   fetchCvAnalysis();
  // }, []);

  return <Register />

}

export default App

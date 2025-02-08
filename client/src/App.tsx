import { useState } from "react";
import { useEffect } from "react";
import Register from "./components/register/Register";
import Login from "./components/login/Login";

function App() {
  // const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);

  // useEffect(() => {
  //   const fetchCvAnalysis = async () => {
  //     const cvAnalysis = await getCvAnalysis();
  //     setCvAnalysis(cvAnalysis);
  //   }
  //   fetchCvAnalysis();
  // }, []);

  return <Login />

}

export default App

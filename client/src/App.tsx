import { useState } from "react";
import { useEffect } from "react";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import { getToken } from "./auth/local_storage";
import Home from "./components/home/Home";
import { CVupload } from "./components/cv-upload/CVupload";
function App() {
  // const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);

  // useEffect(() => {
  //   const fetchCvAnalysis = async () => {
  //     const cvAnalysis = await getCvAnalysis();
  //     setCvAnalysis(cvAnalysis);
  //   }
  //   fetchCvAnalysis();
  // }, []);

  const token = getToken();
  if (token) {
    return <CVupload onUpload={() => {}} />
  }

  return <Login />

}

export default App


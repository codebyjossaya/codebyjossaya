
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import About from './pages/about/About';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useState } from 'react';


const firebaseConfig = {
  apiKey: "AIzaSyD2XHCZtjSk65vvQX0nPbXxvlv6yF_LFXU",
  authDomain: "jcamille-tech.firebaseapp.com",
  projectId: "jcamille-tech",
  storageBucket: "jcamille-tech.appspot.com",
  messagingSenderId: "484292122701",
  appId: "1:484292122701:web:59b0828f4a61803487e404",
  measurementId: "G-KP1SLMXH8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
let other_element;
let render_func;
function App() {
  const [other_render,setRenderTrigger] = useState(false);
  const [ele,setEle] = useState(null)
  render_func = setRenderTrigger;
  other_element = setEle;
  return other_render ? ele : (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </Router>
  );
}

function RenderOtherElement({children}) {
  other_element(children);
  render_func(true);
}


export default App;
export { app, analytics, RenderOtherElement };  // Export the app and analytics objects for use in other files

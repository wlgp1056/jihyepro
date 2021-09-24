import AppRouter from "./Router";
import {useState} from "react";

function App() {
   // 상수 선언, ES6문번의 구조 분해 할당
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  return (
      <>
        <AppRouter isLoggedIn={isLoggedIn}></AppRouter>
        <footer>&copy; {new Date().getFullYear()}Nwitter</footer>
      </>
      
  );
}

export default App;

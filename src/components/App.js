import AppRouter from "./Router";
import {useEffect, useState} from "react";
import {authService} from "fbase";

function App() {
  //console.log(authService.currentUser);
   // 상수 선언, ES6문번의 구조 분해 할당
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  useEffect(()=>{
    //console.log(authService.currentUser);
    //setIsLoggedIn(authService.currentUser);
    authService.onAuthStateChanged((user)=>{
      if(user){
        setIsLoggedIn(user);
      } else { // 로그인x
        setIsLoggedIn(false);
      }
      setInit(true);
    }); // 이벤트 핸들러 - 인증정보변경되면 실행된다.
  }, []);

  // 현재 접속자 확인
 // console.log(authService.currentUser);
  return (
      <>
        {init ? <AppRouter isLoggedIn={isLoggedIn}></AppRouter> : "initalizing..."}
        <footer>&copy; {new Date().getFullYear()}Nwitter</footer>
      </>
      
  );
}

export default App;

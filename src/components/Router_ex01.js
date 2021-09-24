import {useState} from "react";
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = () => {
    // 함수의 내부 - 연산, 호출 ...
    // 상수 선언, ES6문번의 구조 분해 할당
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [number, setNumber] = useState(0);

    const onLogIn = () => {
        setIsLoggedIn(true);
    }
    const onLogOut = () => {
        setIsLoggedIn(false);

    }

    const OnIncrease = () => {
        setNumber(number+1);
    }

    const OnDecrease = () => {
        setNumber(number-1);
    }

    return (
        <Router>
            <p>{number}</p>
            <button onClick={OnIncrease}>증가</button>
            <button onClick={OnDecrease}>감소</button>
            <hr />
            <Switch>
                {isLoggedIn ? (
                    <Route exact path="/">
                        <Home></Home>
                        <p>{"state : "+ isLoggedIn}</p>
                        <button onClick={onLogOut}>LogOut</button>
                    </Route>
                ) : (
                    <Route exact path="/">
                        <Auth></Auth>
                        <p>{"state : "+ isLoggedIn}</p>
                        <button onClick={onLogIn}>LogIn</button>
                    </Route>
                )}
            </Switch>
        </Router>
    );
};

export default AppRouter;
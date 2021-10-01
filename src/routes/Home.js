// import { useState } from "react/cjs/react.development";
import { useEffect, useState } from "react";
import { dbService } from "fbase";
import Nweet from "./Nweet";

const Home = ({userObj}) => {
    //console.log("userObj => ",userObj);
    const [nweet, setNweet] = useState(''); // setNweet 은 nweet 값을 변경
    const [nweets, setNweets] = useState([]);

    //console.dir(userObj);
    //console.log(userObj.email);

    // 리스트 가져오기
    const getNweets = async() => {
        // firestore db에서 데이터를 가져와서 출력.
        const dbNweets = await dbService.collection('nweets').get();
        //console.log(dbNweets); 

        let newList = [];
        dbNweets.forEach((doc) => {
            //console.log(doc.id, doc.data());
            let data = doc.data();
            data.docId = doc.id;
            
            //console.log(data.docId);
            //console.log(data);
            
            newList.push(data);
        });
        //console.log(newList);
        setNweets(newList);
    };

    
    /* useEffect 라는 훅 : 컴포넌트가 마운트 됐을 때 (처음 나타났을 때), 언마운트 됐을 때 (사라질 때), 그리고 업데이트 될 때 (특정 props가 바뀔 때) 
       특정 작업을 처리*/
    // 실시간으로 처리
    useEffect(()=>{
        //getNweets();
        // firestore에서 데이터 변경이 일어나면 자동 갱신 하도록 한다.
        // onSnapshot 이벤트 핸들러 함수를 사용한다.
        dbService.collection('nweets').onSnapshot((snapshot)=>{
            const newArray = snapshot.docs.map((doc)=>{
               return {docId:doc.id, ...doc.data()}
            });
            setNweets(newArray);
        });
    }, []);

    // 데이터 저장
    const onSubmit = async (event) => {
        event.preventDefault(); // 새로고침 방지
        // firestore는 MongoDB구조와 같다
        // firebase와 같은 nosql계통의 collection은 RDB의 table이다.
        // RDB에서 row == firebase의 Document (JS 객체)

        // 비동기처리를 콜백으로 안하기 위해 : async , await
        // await 비동기_처리_메소드명
        await dbService.collection('nweets').add ({
            text : nweet,
            createAt : Date.now(),
            creatorId : userObj.uid, // 로그인했을때 로그인아이디
            email : userObj.email,
        });
        setNweet('');
    };

    // value값 변경
    const onChange = (event) => {
        event.preventDefault();
        //setNweet(event.target.value);
        // event를 객체를 구조분해 하기
        const {
            target : { value },
        } = event;
        setNweet(value);
    };

    return (
    <div>
        {/*console.log(nweets)*/}
        <span>Home</span><br />
        <span>{nweet}</span><br />
        <form onSubmit={onSubmit}>
            <input type="text" value={nweet} onChange={onChange} />
            <input type="submit" value="Nweet"/>
        </form>
        <div>
            {
                // 만들어진 neweets를 활용해서 목록 만듬
                nweets.map((neweet)=>{
                    return <Nweet key={neweet.docId} nweetObj={neweet} userObj={userObj} />
                    
                })

            }
        </div>
    </div>);   
}

export default Home;
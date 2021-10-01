// import { useState } from "react/cjs/react.development";
import { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import Nweet from "./Nweet";
import { v4 as uuidv4 } from "uuid"

const Home = ({userObj}) => {
    //console.log("userObj => ",userObj);
    const [nweet, setNweet] = useState(''); // setNweet 은 nweet 값을 변경
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    const [file, setFile] = useState("");
    
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
        // 1. 파일을 storage에 upload하고 
        // 2. 그 URL을 firestore에 저장한다.
        // storage에 저장 할 때는 UID가 자동 생성 되지 않게 설계되었다.
        // 먼저 uuid 모듈 설치 : uid 자동 생성기 (npm install uuid)
        // https://github.com/uuidjs/uuid/#readme
        // console.log(uuidv4());
        // 만들어질 디렉토리와 파일명을 준비한다.

        let downloadUrl = "";
        if (attachment !== "") {
            const attachmentRef  = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url")
            // console.log(await response.ref.getDownloadURL());
            downloadUrl = await response.ref.getDownloadURL()
        }

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
            attachmentUrl : downloadUrl,
        });
        setNweet('');
        setAttachment('');
        setFile('');
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

    const onFileChange = (event) => {
        //console.dir(event.target.files[0]);
        const {
            target : {files, value},
        } = event;
        console.log(files[0]);

        const reader = new FileReader();

        setFile(value)
        // 모두 읽어 들이면 후속 처리하기 (이벤트 핸들러)
        reader.onloadend = (ProgressEvent) => {
            //console.dir(ProgressEvent.currentTarget.result);
            const {
                currentTarget : {result},
            } = ProgressEvent;
            setAttachment(result);
        }

        // 로컬의 파일을 읽어 올때도 Ajax 사용처럼 비동기 처리 된다.
        reader.readAsDataURL(files[0]);

    }

    return (
    <div>
        {/*console.log(nweets)*/}
        <span>Home</span><br />
        <span>{nweet}</span><br />
        <form onSubmit={onSubmit}>
            <input type="text" value={nweet} onChange={onChange} />
            <input type="submit" value="Nweet"/>
            {attachment && (
            <>
                <img src={attachment} height='70px' />
                <input type="button" 
                        value="제거" 
                        onClick={(event)=>{
                            setAttachment('');
                            setFile('');
                        }}
                />
            </>
        )}
        <input type="file" accept="image/*" onChange={onFileChange} value={file}/>
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
import { dbService } from "fbase";
import { useState } from "react";

const Nweet = ({nweetObj, userObj}) => {

    const [isEdit, setIsEdit] = useState(false);
    const [newText, setNewText] = useState(nweetObj.text);

    
    const textStyle = {
        color: 'orange',
        fontSize: '16pt',
        display : 'inline-block',
        width : '450px',
      };
     
    const onDeleteClick = async (event) => {
        let ok = window.confirm("정말로 삭제 하시겠습니까?");
        //console.log(ok);
        if (ok) {
            console.log(nweetObj.docId);
            let data = await dbService.collection('nweets').doc(nweetObj.docId).delete();
            console.log(data);
        }

    };

    const onChange = (event) => {
        event.preventDefault();
        setNewText(event.target.value);
    }

    return (
        <div>
            {isEdit ? (
                <span>
                    <input type="text" value={newText} onChange={onChange}/>
                    <input type="button" value="OK" onClick={(event) => {
                         dbService.collection('nweets').doc(nweetObj.docId).update({
                            text : newText,
                        });
                        setIsEdit(false);
                    }} />
                </span>
            ) : (
                <span style={textStyle}>
                    {nweetObj.text} ({nweetObj.email})
                </span>    
            )}
            { userObj.uid === nweetObj.creatorId ? (
                <span>
                    <button onClick={onDeleteClick}>Del</button>
                    <button onClick={(event)=>{
                        // 수정 버튼을 누르면 ...text가 input창으로 변경
                        setIsEdit(true);
                        //setIsEdit(!isEdit);
                    }}>
                        {isEdit ? 'Cancel' :'Edit' }</button>
                </span>
            )  : <span></span>
            }
        </div>   
    );
};

export default Nweet;

/*
1. firestore에 수정 명령어 찾기
2. 바뀔 데이터 입력 받는 방법 찾기
 2-1 방법 1 : 자바스크립트 팝업창에서 입력 받는 방법
 2-2 방법 2 : input 엘리먼트로 입력 받는 방법
 2-3 방법 3 : 입력창을 활용
3. 화면에 적용 해 보기
 3-1 수정버튼 이벤트 구현
 3-2 input엘리먼트 보이고 감추기
 3-3 입력받은 데이터 firebase에 적용하기

*/

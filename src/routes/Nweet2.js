import { dbService } from "fbase";
import { useState } from "react";

const Nweet2 = ({nweetObj, userObj}) => {

    const [editing, setEditing] = useState(false);
    const [nweet, setNweet] = useState(nweetObj.text);

    const check = () => {
        setEditing((prev) => !prev)
    }
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

    const onSubmit = async (event) => {
        let ok = window.confirm("정말로 수정 하시겠습니까?");
        if (ok) {
            let data = await dbService.collection('nweets').doc(nweetObj.docId).update({ text: nweet });
            setEditing(false);
        }
    };

    const onChange = (event) => {
        event.preventDefault();
        setNweet(event.target.value);
    };


    return (
        <div>
            {editing ? (
                <div>
                    <form onSubmit={onSubmit}>
                        <input onChange={onChange} type="text" value={nweet} />
                        <input type="submit" value="Update"/>
                    </form>
                    <button onClick={check}>Cancel</button>
                </div>
            ): (
            <div>
            <span style={textStyle}>{nweetObj.text} ({nweetObj.email})</span> 
            { userObj.uid === nweetObj.creatorId ? (
                <span>
                    <button onClick={onDeleteClick}>Del</button>
                    <button onClick={check}>Edit</button>
                </span>
            )  : <span></span>
            }
            </div> 
            )}
        </div>   
    );
};

export default Nweet2;
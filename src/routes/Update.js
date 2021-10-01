import { dbService } from "fbase";
import { useState } from "react";

const Update = ({nweetObj}) => {

    const [nweet, setNweet] = useState(nweetObj.text);


    const onSubmit = async (event) => {
        let ok = window.confirm("정말로 수정 하시겠습니까?");
        if (ok) {
            let data = await dbService.collection('nweets').doc(nweetObj.docId).update({ text: nweet });
           
        }
    };

    const onChange = (event) => {
        event.preventDefault();
        setNweet(event.target.value);
    };


    return (
        <div>
                <div>
                    <form onSubmit={onSubmit}>
                        <input onChange={onChange} type="text" value={nweet} />
                        <input type="submit" value="Update"/>
                    </form>
                </div>
           
        </div>   
    );
};

export default Update;
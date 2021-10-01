import React, {useEffect} from "react";
import firebase from "firebase";

const List = () => {
    useEffect(() => {
        let db = firebase.firestore();
        db.collection("user")
          .get()
          .then((querySnapshot) => {
              
            querySnapshot.forEach((doc) => {

                const user = doc.data();
               
                console.log(user);
            });
          });
      }, []);
return (
    <>
    <h1>List..</h1>
    </>
)
}


export default List;
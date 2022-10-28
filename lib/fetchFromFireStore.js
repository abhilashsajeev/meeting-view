import app from "./firebase";
import dayjs from "dayjs";
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

const db = getFirestore(app);

export const getAllUsers = async () => {
  const collectionRef = query(
    collection(db, "meeting_users"),
    where("hidden", "==", false)
  );
  const snapShot = await getDocs(collectionRef);
  let usersData = [];
  snapShot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    usersData.push(doc.data());
  });
  return usersData.map((user) => {
    return {
      params: {
        id: user.uid,
      },
    };
  });
};
export const getAllUsersData = async () => {
  const collectionRef = query(
    collection(db, "meeting_users"),
    where("hidden", "==", false)
  );
  const snapShot = await getDocs(collectionRef);
  let usersData = [];
  snapShot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    usersData.push(doc.data());
  });
  return usersData;
};

export const getMeetingDataForUserId = async (id, meetingDate = dayjs()) => {
  const meetingDateTimeStamp = meetingDate.valueOf();
  const collectionRef = query(
    collection(db, "meeting_schedule"),
    where("user_for", "==", id),
    orderBy("time_start", "asc")
  );
  const snapShot = await getDocs(collectionRef);
  let postData = [];
  snapShot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    let newDataObj = {
      ...doc.data(),
      id: doc.id,
    };
    postData.push(newDataObj);
  });
  return postData;
};

export const getUserForId = async (id) => {
  const collectionRef = query(
    collection(db, "meeting_users"),
    where("uid", "==", id)
  );
  const snapShot = await getDocs(collectionRef);
  let postData = [];
  snapShot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    postData.push(doc.data());
  });
  return postData.length > 0
    ? postData[0]
    : {
        name: "User not found",
      };
};

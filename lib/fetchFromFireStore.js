import app from "./firebase";
import dayjs from "dayjs";
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const db = getFirestore(app);

export function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
}

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
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const collectionRef = query(
    collection(db, "meeting_schedule"),
    where("user_for", "==", id),
    where("time_start", ">=", startOfDay),
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
export const getSnapShotOfMeetingDataForUserId = async (id, cb) => {
  var startOfDay = new Date();
  console.log("user id ", id);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const collectionRef = query(
    collection(db, "meeting_schedule"),
    where("user_for", "==", id),
    where("time_start", ">=", startOfDay),
    orderBy("time_start", "asc")
  );
  return onSnapshot(collectionRef, cb);
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

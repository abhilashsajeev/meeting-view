import Head from "next/head";
import {
  getAllUsers,
  getMeetingDataForUserId,
  getUserForId,
  getSnapShotOfMeetingDataForUserId,
} from "../../lib/fetchFromFireStore";
import dayjs from "dayjs";
import { Navbar, NavbarBrand } from "reactstrap";
import taskCss from "../../styles/task.module.css";
import MeetingTable from "../../components/MeetingTable";
import { useEffect, useState } from "react";

export default function MeetingData({ postData, userData }) {
  const meetResult = JSON.parse(postData);
  const [meetingData, setMeetingData] = useState(meetResult);
  const user = JSON.parse(userData);
  useEffect(() => {
    var unsubscribe = () => {};
    (async () => {
      unsubscribe = await getSnapShotOfMeetingDataForUserId(
        user.uid,
        (querySnapshot) => {
          let meetings = [];
          querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
            let meetingObj = {
              id: doc.id,
              ...doc.data(),
            };
            meetings.push(meetingObj);
          });
          setMeetingData(meetings);
        }
      );
    })();
    return () => {
      unsubscribe();
    };
  }, [user.id]);

  return (
    <>
      <Head>
        <title>Meeting Data</title>
      </Head>
      <Navbar color="warning" dark>
        <NavbarBrand href="/">Meeting Schedule for {user.name} </NavbarBrand>
      </Navbar>
      <div className={taskCss.centerText}>
        <h3>Todays Date {dayjs().format("DD/MM/YYYY")}</h3>
      </div>
      <MeetingTable meetingData={meetingData} />

      <div></div>
    </>
  );
}

export async function getStaticPaths() {
  const paths = await getAllUsers();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Add the "await" keyword like this:
  const user = await getUserForId(params.id);
  const result = await getMeetingDataForUserId(params.id);
  const postData = JSON.stringify(result);
  const userData = JSON.stringify(user);
  return {
    props: {
      userData,
      postData,
    },
  };
}

import Head from "next/head";
import {
  getAllUsers,
  getMeetingDataForUserId,
  getUserForId,
  getSnapShotOfMeetingDataForUserId,
} from "../../lib/fetchFromFireStore";
import dayjs from "dayjs";
import { Alert, Navbar, NavbarBrand } from "reactstrap";
import taskCss from "../../styles/task.module.css";
import MeetingTable from "../../components/MeetingTable";
import { useEffect, useState } from "react";
import { BiStopwatch } from "react-icons/bi";
import styles from "../../styles/NavBarNew.module.css";

export default function MeetingData({ postData, userData }) {
  const meetResult = JSON.parse(postData);
  const current = meetResult.filter((item) => {
    return dayjs(item.time_start.seconds * 1000).isSame(dayjs(), "day");
  });
  const upcoming = meetResult.filter((item) => {
    return dayjs(item.time_start.seconds * 1000).isAfter(dayjs(), "day");
  });
  const [currentMeetingData, setCurrentMeetingData] = useState(current);
  const [upcomingMeetingData, setUpcomingMeetingData] = useState(upcoming);
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
          const current = meetings.filter((item) => {
            return dayjs(item.time_start.seconds * 1000).isSame(dayjs(), "day");
          });
          const upcoming = meetings.filter((item) => {
            return dayjs(item.time_start.seconds * 1000).isAfter(
              dayjs(),
              "day"
            );
          });
          console.log("upcoming", upcoming);
          setCurrentMeetingData(current);
          setUpcomingMeetingData(upcoming);
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
      <Navbar className={styles.header_gradient} dark>
        <NavbarBrand href="/">Meeting Schedule for {user.name} </NavbarBrand>
      </Navbar>
      <div className={taskCss.centerText}>
        <h3>
          <u>Todays Date {dayjs().format("DD/MM/YYYY")}</u>
        </h3>
      </div>
      {currentMeetingData.length > 0 && (
        <MeetingTable meetingData={currentMeetingData} />
      )}
      {currentMeetingData.length === 0 && (
        <Alert color="primary" className={taskCss.centerText}>
          <h5>
            <BiStopwatch size={30} /> No Scheduled Events for Today
          </h5>
        </Alert>
      )}

      <div className={taskCss.centerText}>
        <h3>
          <u>Upcoming Meetings</u>
        </h3>
      </div>
      <MeetingTable meetingData={upcomingMeetingData} />
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
    revalidate: 10,
  };
}

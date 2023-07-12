import Head from "next/head";
import {
  getAllUsers,
  getMeetingDataForUserId,
  getUserForId,
  getSnapShotOfMeetingDataForUserId,
} from "../../lib/fetchFromFireStore";
import dayjs from "dayjs";
import { Alert, Col, Navbar, NavbarBrand, Row } from "reactstrap";
import taskCss from "../../styles/task.module.css";
import MeetingTable from "../../components/MeetingTable";
import MeetingTableAnimated from "../../components/MeetingTableAnimated";
import { useEffect, useState } from "react";
import { BiStopwatch } from "react-icons/bi";
import styles from "../../styles/NavBarNew.module.css";
import Image from "next/image";

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
  const [today, setToday] = useState("");
  const user = JSON.parse(userData);
  useEffect(() => {
    var unsubscribe = () => {};
    (async () => {
      unsubscribe = await getSnapShotOfMeetingDataForUserId(
        user.uid,
        (querySnapshot) => {
          let meetings = [];
          querySnapshot.forEach((doc) => {
            let meetingObj = {
              id: doc.id,
              ...doc.data(),
            };
            meetings.push(meetingObj);
          });
          let current = meetings.filter((item) => {
            return dayjs(item.time_start.seconds * 1000).isSame(dayjs(), "day");
          });
          // remove those with status completed
          current = current.filter((item) => {
            return item.status?.toLowerCase() !== "completed";
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000 * 60 * 10);
          const upcoming = meetings.filter((item) => {
            return dayjs(item.time_start.seconds * 1000).isAfter(
              dayjs(),
              "day"
            );
          });

          setCurrentMeetingData(current);
          setUpcomingMeetingData(upcoming);
        }
      );
    })();

    const timer = setInterval(() => {
      let todaysText = `${dayjs().format("hh:mm:ss A")} -
          ${dayjs().format("DD-MMM-YYYY")} ${dayjs().format("dddd")}`;
      setToday(todaysText);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [user.id]);

  return (
    <>
      <Head>
        <title>Meeting Data</title>
        <meta name="description" content="Meeting data" />
      </Head>
      <Navbar className={styles.header_gradient} dark>
        <NavbarBrand className={styles.navbar_link_head} href="/">
          {user.name.toUpperCase()}
          {" - "}MEETING SCHEDULE
        </NavbarBrand>
      </Navbar>
      <Col className={styles.timer}>
        <span>{today}</span>
        <Image src="/highcourt.webp" width={50} height={50} />
      </Col>
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

      <div className={taskCss.meetingTitle}>
        <strong>Upcoming Meetings</strong>
      </div>
      <MeetingTableAnimated meetingData={upcomingMeetingData} />
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
  let result = await getMeetingDataForUserId(params.id);
  result = result.filter((item) => {
    return item.status?.toLowerCase() !== "completed";
  });
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

import Head from "next/head";
import {
  getAllUsers,
  getMeetingDataForUserId,
  getUserForId,
  getSnapShotOfMeetingDataForUserId,
} from "../../lib/fetchFromFireStore";
import dayjs from "dayjs";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Col,
  List,
  Navbar,
  NavbarBrand,
  NavbarText,
  Row,
} from "reactstrap";
import taskCss from "../../styles/task.module.css";
import { useEffect, useState } from "react";
import { BiStopwatch } from "react-icons/bi";
import styles from "../../styles/NavBarNew.module.css";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Swiper styles

export default function MeetingData({ postData, userData }) {
  const meetResult = JSON.parse(postData);
  const current = meetResult.filter((item) => {
    return dayjs(item.time_start.seconds * 1000).isSame(dayjs(), "day");
  });
  const upcoming = meetResult.filter((item) => {
    return dayjs(item.time_start.seconds * 1000).isAfter(dayjs(), "day");
  });
  const [currentMeetingData, setCurrentMeetingData] = useState(current);
  const [tomorrowMeetingData, setTomorrowMeetingData] = useState([]);
  const [upcomingMeetingData, setUpcomingMeetingData] = useState(upcoming);
  const [maxHeight, setMaxHeight] = useState("630px");
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
          let upcoming = meetings.filter((item) => {
            return dayjs(item.time_start.seconds * 1000).isAfter(
              dayjs(),
              "day"
            );
          });

          setCurrentMeetingData(current);
          const tomorrow = meetings.filter(tomorrowItemsFilter);
          setTomorrowMeetingData(tomorrow);
          // remove tomorrow items from upcoming
          upcoming.forEach((item) => {
            tomorrow.forEach((tomorrowItem) => {
              if (item.id === tomorrowItem.id) {
                upcoming.splice(upcoming.indexOf(item), 1);
              }
            });
          });
          setUpcomingMeetingData(upcoming);
        }
      );
    })();
    let containerFluid = document.querySelector(".container-fluid");
    if (containerFluid) {
      let maxheightVal = window.innerHeight - containerFluid.clientHeight;
      setMaxHeight(`${maxheightVal}px`);
    }

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

  const cardTemplate = (item) => {
    return (
      <Card
        className={getColorForNextDay(item.time_start.seconds * 1000)}
        style={{ margin: "5px", borderRadius: "10px" }}
        key={item.id}
      >
        <CardHeader tag="h3">
          {item.description}
          <span style={{ color: "orange" }}> at {item.venue}</span>
        </CardHeader>
        <CardBody>
          <CardTitle tag="h6">{item.remarks}</CardTitle>
          <CardSubtitle tag="h5">
            <span style={{ color: "#4DC918" }}>
              Today - {dayjs(item.time_start.seconds * 1000).format("hh:mm A")}{" "}
              -{" "}
            </span>
            {item.status}
          </CardSubtitle>
        </CardBody>
      </Card>
    );
  };
  const cardTemplateUpcoming = (item) => {
    return (
      <Card
        style={{
          borderRadius: "10px",
        }}
        className={getColorForNextDay(item.time_start.seconds * 1000)}
        // color={getColorForNextDay(item.time_start.seconds * 1000)}
        key={item.id}
      >
        <CardHeader tag="h4">
          {item.description}
          <span style={{ color: "#993D00" }}> at {item.venue}</span>
        </CardHeader>
        <CardBody>
          <CardTitle tag="h6">{item.remarks}</CardTitle>
          <CardSubtitle tag="h5">
            <span style={{ color: "#1B0AFF" }}>
              {dayjs(item.time_start.seconds * 1000).format("DD/MM/YYYY")}{" "}
              {dayjs(item.time_start.seconds * 1000).format("hh:mm A")} -{" "}
            </span>
            {item.status}
          </CardSubtitle>
        </CardBody>
      </Card>
    );
  };

  var settings = {
    arrows: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    vertical: true,
    autoplay: true,
    rtl: false,
  };

  const tomorrowItemsFilter = (item) => {
    const datevar = item.time_start.seconds * 1000;
    if (dayjs().add(1, "day").day() === 0) {
      // if next day sunday
      if (dayjs().add(2, "day").isSame(dayjs(datevar), "day")) {
        return true;
      }
    } else {
      if (dayjs().add(1, "day").isSame(dayjs(datevar), "day")) {
        return true;
      }
    }
    return false;
  };
  const getColorForNextDay = (datevar) => {
    if (dayjs().isSame(dayjs(datevar), "day")) {
      return styles.card_black_1;
    }
    // if next day is sunday then make monday large else next day large
    if (dayjs().add(1, "day").day() === 0) {
      // if next day sunday
      if (dayjs().add(2, "day").isSame(dayjs(datevar), "day")) {
        return styles.card_black_2;
      }
    } else {
      if (dayjs().add(1, "day").isSame(dayjs(datevar), "day")) {
        return styles.card_black_2;
      }
    }
    return styles.card_black_3;
  };
  const isSliderRequired = () => {
    const total = currentMeetingData.length + tomorrowMeetingData.length;
    if (total > 4) {
      return true;
    }
    return false;
  };
  return (
    <>
      <Head>
        <title>Meeting Data</title>
        <meta name="description" content="Meeting data" />
      </Head>
      <Navbar className={styles.header_gradient} dark>
        <NavbarText className={styles.nav_text_white}>{today}</NavbarText>

        <NavbarBrand className={styles.navbar_link_head} href="/">
          <Image src="/highcourt.webp" width={50} height={50} />
        </NavbarBrand>
        <NavbarText className={styles.nav_text_white}>
          {" "}
          {user.name.toUpperCase()}
          {" - "}MEETING SCHEDULE
        </NavbarText>
      </Navbar>
      <Row
        xs="12"
        noguttrs
        style={{
          maxHeight: maxHeight,
          color: "white",
          position: "static",
          background: "#252525",
          overflow: "hidden",
          paddingRight: "0px",
          paddingLeft: "2px",
        }}
      >
        {currentMeetingData.length !== 0 &&
          upcomingMeetingData.length !== 0 && (
            <>
              <Col xs={7} style={{ background: "white", paddingRight: "0px" }}>
                {isSliderRequired() && (
                  <Slider {...settings}>
                    {currentMeetingData.map(cardTemplate)}
                    {tomorrowMeetingData.map(cardTemplate)}
                  </Slider>
                )}
                {!isSliderRequired() && (
                  <div>
                    {currentMeetingData.map(cardTemplate)}
                    {tomorrowMeetingData.map(cardTemplate)}
                  </div>
                )}
              </Col>
              <Col xs={5} style={{ background: "white", paddingLeft: "0px" }}>
                <Slider {...settings}>
                  {upcomingMeetingData.map(cardTemplateUpcoming)}
                </Slider>
              </Col>
            </>
          )}
        {currentMeetingData.length !== 0 &&
          upcomingMeetingData.length === 0 && (
            <>
              <Col xs={12}>
                <h4>Todays Meetings</h4>
                <Slider {...settings}>
                  {currentMeetingData.map(cardTemplate)}
                </Slider>
              </Col>
            </>
          )}
        {currentMeetingData.length === 0 &&
          upcomingMeetingData.length !== 0 && (
            <>
              <Col xs={5}>
                <h4>Upcoming Meetings</h4>
                <Slider {...settings}>
                  {upcomingMeetingData.map(cardTemplateUpcoming)}
                </Slider>
              </Col>
            </>
          )}
      </Row>
      {currentMeetingData.length === 0 && (
        <Alert color="primary" className={taskCss.centerText}>
          <h5>
            <BiStopwatch size={30} /> No Scheduled Events for Today
          </h5>
        </Alert>
      )}

      {/* <MeetingTableAnimated meetingData={upcomingMeetingData} /> */}
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

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
    return dayjs(item.time_start).isSame(dayjs(), "day");
  });
  const upcoming = meetResult.filter((item) => {
    return dayjs(item.time_start).isAfter(dayjs(), "day");
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
            return dayjs(item.time_start.toDate()).isSame(dayjs(), "day");
          });
          // remove those with status completed
          current = current.filter((item) => {
            return item.status?.toLowerCase() !== "completed";
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000 * 60 * 10);
          let upcoming = meetings.filter((item) => {
            return dayjs(item.time_start.toDate()).isAfter(dayjs(), "day");
          });

          setCurrentMeetingData(current);
          const tomorrow = meetings.filter(tomorrowItemsFilter);
          setTomorrowMeetingData(tomorrow);

          // remove tomorrow items from upcoming
          const filteredUpcoming = upcoming.filter((item) => {
            return !tomorrow.includes(item);
          });
          setUpcomingMeetingData(filteredUpcoming);
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
        className={getColorForNextDay(item.time_start.toDate())}
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
              Today - {dayjs(item.time_start.toDate()).format("hh:mm A")} -{" "}
            </span>
            {item.status}
          </CardSubtitle>
        </CardBody>
      </Card>
    );
  };
  const cardTemplateTomorrow = (item) => {
    return (
      <Card
        className={getColorForNextDay(item.time_start.toDate())}
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
              {dayjs(item.time_start.toDate()).format("DD/MM/YYYY")}{" "}
              {dayjs(item.time_start.toDate()).format("hh:mm A")} -{" "}
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
        className={getColorForNextDay(item.time_start.toDate())}
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
              {dayjs(item.time_start.toDate()).format("DD/MM/YYYY")}{" "}
              {dayjs(item.time_start.toDate()).format("hh:mm A")} -{" "}
            </span>
            {item.status}
          </CardSubtitle>
        </CardBody>
      </Card>
    );
  };

  var settings = {
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    vertical: true,
    autoplay: true,
    rtl: false,
  };

  const tomorrowItemsFilter = (item) => {
    const datevar = item.time_start.toDate();
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
    if (total > 3) {
      return true;
    }
    return false;
  };

  console.log("currentMeetingData", currentMeetingData);
  console.log("tomorrowMeetingData", tomorrowMeetingData);

  const checkWhatToShow = () => {
    if (
      currentMeetingData.length !== 0 &&
      tomorrowMeetingData.length !== 0 &&
      upcomingMeetingData.length !== 0
    ) {
      return 1; // all 3
    }
    if (
      currentMeetingData.length !== 0 &&
      tomorrowMeetingData.length !== 0 &&
      upcomingMeetingData.length === 0
    ) {
      return 3; // current and tomorrow
    }
    if (
      currentMeetingData.length !== 0 &&
      tomorrowMeetingData.length === 0 &&
      upcomingMeetingData.length !== 0
    ) {
      return 1; // current and upcoming
    }
    if (
      currentMeetingData.length === 0 &&
      tomorrowMeetingData.length !== 0 &&
      upcomingMeetingData.length !== 0
    ) {
      return 1; // tomorrow and upcoming
    }
    if (
      currentMeetingData.length !== 0 &&
      tomorrowMeetingData.length === 0 &&
      upcomingMeetingData.length === 0
    ) {
      return 2; // current full screen
    }
    if (
      currentMeetingData.length === 0 &&
      tomorrowMeetingData.length !== 0 &&
      upcomingMeetingData.length === 0
    ) {
      return 2; // tomorrow full screen
    }
    if (
      currentMeetingData.length === 0 &&
      tomorrowMeetingData.length === 0 &&
      upcomingMeetingData.length !== 0
    ) {
      return 3; // upcoming full screen
    }
    return 0;
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
        {checkWhatToShow() === 1 && (
          <>
            <Col xs={7} style={{ background: "white", paddingRight: "0px" }}>
              {isSliderRequired() && (
                <Slider {...settings}>
                  {currentMeetingData.map(cardTemplate)}
                  {tomorrowMeetingData.map(cardTemplateTomorrow)}
                </Slider>
              )}
              {!isSliderRequired() && (
                <div>
                  {currentMeetingData.map(cardTemplate)}
                  {tomorrowMeetingData.map(cardTemplateTomorrow)}
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
        {checkWhatToShow() === 2 && (
          <>
            <Col xs={12}>
              <h4>Todays/Tomorrows Meetings</h4>
              {isSliderRequired() && (
                <Slider {...settings}>
                  {currentMeetingData.map(cardTemplate)}
                  {tomorrowMeetingData.map(cardTemplateTomorrow)}
                </Slider>
              )}
              {!isSliderRequired() && (
                <div>
                  {currentMeetingData.map(cardTemplate)}
                  {tomorrowMeetingData.map(cardTemplateTomorrow)}
                </div>
              )}
            </Col>
          </>
        )}
        {checkWhatToShow() === 3 && (
          <>
            <Col xs={12}>
              <h4>Upcoming Meetings</h4>
              <Slider {...settings}>
                {upcomingMeetingData.map(cardTemplateUpcoming)}
              </Slider>
            </Col>
          </>
        )}
      </Row>
      {checkWhatToShow() === 0 && (
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

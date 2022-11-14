import { Table } from "reactstrap";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import styles from "./meeting.module.css";
import Head from "next/head";
import Script from "next/script";
export default function MeetingTableAnimated({ meetingData }) {
  const tableRef = useRef();

  useEffect(() => {
    if (typeof window !== "undefined" && window.$) {
      var $el = $(".table-responsive");
      function anim() {
        var st = $el.scrollTop();
        var sb = $el.prop("scrollHeight") - $el.innerHeight();
        $el.animate({ scrollTop: st < sb / 2 ? sb : 0 }, 15000, anim);
      }
      function stop() {
        $el.stop();
      }
      anim();
    }

    () => {
      stop();
    };
  }, []);
  const getLargeClass = (meetingDate) => {
    // if date is equal to today
    const datevar = dayjs(meetingDate.seconds * 1000);
    if (dayjs(datevar).isSame(dayjs(), "day")) {
      return styles.trlarge;
    }
    // if next day is sunday then make monday large else next day large
    if (dayjs().add(1, "day").day() === 0) {
      // if next day sunday
      if (dayjs().add(2, "day").isSame(dayjs(datevar), "day")) {
        return styles.trmedium;
      }
    } else {
      if (dayjs().add(1, "day").isSame(dayjs(datevar), "day")) {
        return styles.trmedium;
      }
    }

    return "trnormal";
  };

  return (
    <>
      <Script
        src="https://code.jquery.com/jquery-3.6.1.js"
        integrity="sha256-3zlB5s2uwoUzrXK3BT7AX3FyvojsraNFxCc2vC/7pNI="
        crossorigin="anonymous"
      ></Script>

      <Table dark responsive innerRef={tableRef}>
        <thead>
          <tr>
            <th>#</th>
            <th>Description of Event</th>
            <th>Time</th>
            <th>Venue</th>
            <th>Remarks</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="tbs">
          {meetingData.map((meeting, index) => (
            <tr key={index} className={getLargeClass(meeting.time_start)}>
              <th scope="row">{index + 1}</th>
              <td>{meeting.description}</td>
              <td>
                {dayjs(meeting.time_start.seconds * 1000).format("DD/MM/YYYY")}
                {dayjs(meeting.time_start.seconds * 1000).format(" hh:mm A")}
              </td>
              <td>{meeting.venue}</td>
              <td>{meeting.remarks}</td>
              <td>{meeting.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

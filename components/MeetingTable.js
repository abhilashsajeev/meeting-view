import { Table } from "reactstrap";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import styles from "./meeting.module.css";

export default function MeetingTable({ meetingData }) {
  const tableRef = useRef();

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
      <Table dark innerRef={tableRef} style={{ marginBottom: 0 }}>
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

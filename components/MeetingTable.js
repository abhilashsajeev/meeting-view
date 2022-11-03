import { Table } from "reactstrap";
import dayjs from "dayjs";
import styles from "./meeting.module.css";

export default function MeetingTable({ meetingData }) {
  const getLargeClass = (meetingDate) => {
    // if date is equal to today
    const datevar = dayjs(meetingDate.seconds * 1000);
    if (dayjs(datevar).isSame(dayjs(), "day")) {
      return styles.trlarge;
    }
    return "trnormal";
  };
  return (
    <>
      <Table dark responsive>
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
        <tbody>
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

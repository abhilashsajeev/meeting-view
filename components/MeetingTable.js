import { Table } from "reactstrap";
import dayjs from "dayjs";

export default function MeetingTable({ meetingData }) {
  return (
    <>
      <Table dark striped responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Meeting </th>
            <th>Venue</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {meetingData.map((meeting, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{meeting.description}</td>
              <td>{meeting.meeting_with}</td>
              <td>{meeting.venue}</td>
              <td>
                {dayjs(meeting.time_start.seconds * 1000).format(" hh:mm A")} -
                {dayjs(meeting.time_end.seconds * 1000).format(" hh:mm A")}
              </td>

              <td>{meeting.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

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
            <th>Meeting With</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {meetingData.map((meeting, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{meeting.description}</td>
              <td>{meeting.meeting_with}</td>
              <td>
                {dayjs(meeting.time_start.seconds * 1000).format(
                  "DD/MM/YYYY hh:mm A"
                )}
              </td>
              <td>
                {dayjs(meeting.time_end.seconds * 1000).format(
                  "DD/MM/YYYY hh:mm A"
                )}
              </td>

              <td>{meeting.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

import { Table, Button } from "reactstrap";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useFormContext } from "react-hook-form";
import { deleteTask } from "../lib/saveToFireStore";

dayjs.extend(timezone);

function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
}

export default function MeetingTableEditable({ meetingData, isEdit }) {
  const { reset } = useFormContext();
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
    } catch (e) {
      console.log(e);
      alert("Error in delete");
    }
  };

  const handleEdit = async (item) => {
    console.log("resetting item", item);
    const resetObj = {
      ...item,
    };
    resetObj.time_start = toIsoString(
      dayjs.unix(resetObj.time_start.seconds).$d
    ).slice(0, 16);
    resetObj.time_end = toIsoString(
      dayjs.unix(resetObj.time_end.seconds).$d
    ).slice(0, 16);

    reset(resetObj);
  };
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
            {isEdit && <th>Actions</th>}
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
              {isEdit && (
                <td>
                  <Button
                    outline
                    onClick={() => {
                      handleDelete(meeting.id);
                    }}
                  >
                    <AiFillDelete style={{ color: "red" }} />
                  </Button>
                  <Button
                    outline
                    onClick={() => {
                      handleEdit(meeting);
                    }}
                  >
                    <AiFillEdit style={{ color: "green" }} />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

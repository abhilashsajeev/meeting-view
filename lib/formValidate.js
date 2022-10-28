import * as yup from "yup";

export const addUserSchema = yup.object().shape({
  name: yup.string().required(),
  fullname: yup.string().required(),
  designation: yup.string().required(),
  phone_number: yup.number().nullable(),
  hidden: yup.boolean().nullable(),
});

export const addTaskSchema = yup.object().shape({
  date_added: yup.date().required(),
  description: yup.string().required("Description is required"),
  meeting_with: yup.string().required("Meeting with is required"),
  status: yup.string().required("Status is required"),
  time_end: yup
    .date()
    .required("Time end is required")
    .min(yup.ref("time_start"), "End time must be after start time"),
  time_start: yup.date().required("Time start is required"),
  user_for: yup.string().required("User for is required"),
  venue: yup.string().required("Venue is required"),
});

export const defaultTaskValues = {
  date_added: new Date(),
  description: "",
  meeting_with: "",
  status: "Pending",
  time_end: new Date(),
  time_start: new Date(),
  user_for: "",
  venue: "",
};

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
  remarks: yup.string().notRequired(),
  status: yup.string().required("Status is required"),
  time_start: yup.date().required("Time start is required"),
  user_for: yup.string().required("User for is required"),
  venue: yup.string().required("Venue is required"),
});

export const defaultTaskValues = {
  date_added: new Date(),
  description: "",
  remarks: "",
  status: "Pending",
  time_start: new Date(),
  user_for: "",
  venue: "",
};

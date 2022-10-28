import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormGroup, Row, Label, FormFeedback } from "reactstrap";
import RHFInput from "./RHFInput";

export default function AddMeetingForm({ user }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  useEffect(() => {
    setValue("date_added", dayjs());
    setValue("user_for", user.uid);
  }, [user, setValue]);

  return (
    <>
      <Row>
        <RHFInput
          control={control}
          errors={errors}
          name="meeting_with"
          label="Meeting With"
        />
        <RHFInput
          control={control}
          errors={errors}
          name="description"
          label="Description"
        />
        <RHFInput
          control={control}
          errors={errors}
          name="status"
          label="Status"
        />
        <RHFInput
          control={control}
          errors={errors}
          name="venue"
          label="Venue"
        />
        <RHFInput
          control={control}
          errors={errors}
          name="time_start"
          label="Start Time"
          inputType="datetime-local"
        />
        <RHFInput
          control={control}
          errors={errors}
          name="time_end"
          label="End Time"
          inputType="datetime-local"
        />
      </Row>
    </>
  );
}

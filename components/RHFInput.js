import { FormGroup, Input, FormFeedback, Label, Col } from "reactstrap";
import { Controller } from "react-hook-form";
export default function RHFInput({
  label,
  control,
  name,
  errors,
  md,
  inputType,
  disabled,
}) {
  return (
    <Col md={md}>
      <Controller
        control={control}
        name={name}
        render={({ field: { ref, ...fieldProps } }) => (
          <FormGroup>
            <Label>{label}</Label>
            <Input
              disabled={disabled}
              type={inputType}
              invalid={errors[name]}
              name={name}
              ref={ref}
              {...fieldProps}
            />
            {errors[name] && (
              <FormFeedback>{errors[name]?.message}</FormFeedback>
            )}
          </FormGroup>
        )}
      />
    </Col>
  );
}

RHFInput.defaultProps = {
  md: 6,
  inputType: "text",
  disabled: false,
};

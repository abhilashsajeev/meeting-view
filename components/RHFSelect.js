import { FormGroup, Input, FormFeedback, Label, Col } from "reactstrap";
import { Controller } from "react-hook-form";
export default function RHFSelect({
  label,
  control,
  name,
  errors,
  md,
  disabled,
  options,
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
              type="select"
              invalid={errors[name]}
              name={name}
              ref={ref}
              {...fieldProps}
            >
              {options.map((option) => (
                <option>{option}</option>
              ))}
            </Input>
            {errors[name] && (
              <FormFeedback>{errors[name]?.message}</FormFeedback>
            )}
          </FormGroup>
        )}
      />
    </Col>
  );
}

RHFSelect.defaultProps = {
  md: 6,
  inputType: "text",
  disabled: false,
  options: [],
};

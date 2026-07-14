import { ReactNode } from "react";

export interface FormTcdModel {
  children?: ReactNode;
  isAutocompleteForm?: boolean;
}

export default function FormTcd(props: FormTcdModel) {
  return (
    <form
      autoComplete={props.isAutocompleteForm === true ? "on" : "off"}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <button style={{ display: "none" }}>fake</button>

      {props.children}
    </form>
  );
}

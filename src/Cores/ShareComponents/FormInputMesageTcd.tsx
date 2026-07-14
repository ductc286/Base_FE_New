import { JSX } from "react";

interface IFormInputMesageTcd {
  error?: string | JSX.Element;
}

export default function FormInputMesageTcd(props: IFormInputMesageTcd) {
  return <>{props.error && <small className="p-error">{props.error}</small>}</>;
}

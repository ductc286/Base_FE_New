import CommonHelper from "../Helpers/CommonHelper";

interface ScrollTcdModel {
  children: any;
  className?: string;
}

export default function ScrollTcd(props: ScrollTcdModel) {
  return (
    <div
      className={CommonHelper.concatClassNames("scroll-tcd", props.className)}
    >
      {props.children}
    </div>
  );

  // return  <ScrollPanel style={{ width: '100%', maxHeight: '100vh', height: "100vh" }} className="custombar1">{props.children}</ScrollPanel>
}

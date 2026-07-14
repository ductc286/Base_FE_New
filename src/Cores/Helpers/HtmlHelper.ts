import parse from "html-react-parser";

const HtmlHelper = {
  parseHtml(htmlText: any) {
    return parse(htmlText || "");
  },
};

export default HtmlHelper;

import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi" style={{ fontSize: "14px" }}>
      <Head />
      {/* <link href="/MyPublicFolders/css/style.css" rel="stylesheet"></link> */}
      {/* <link href="/MyPublicFolders/Cores/Fonts/fontawesome/css/all.css" rel="stylesheet"></link> */}
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" defer></script> */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/jodit@latest/es2021/jodit.fat.min.css"
      />
      <script
        src="https://unpkg.com/jodit@latest/es2021/jodit.min.js"
        async
      ></script>

      {/* <script src="/GlobalConfig.js" defer></script> */}
      <body style={{ margin: "0" }}>
        {/* <link href="/MyPublicFolders/Cores/Css/CommonCss.css" rel="stylesheet" /> */}
        {/* <link href="/MyPublicFolders/css/MyCss.css?v=1" rel="stylesheet" /> */}

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

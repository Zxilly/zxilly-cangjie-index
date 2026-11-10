import type { ReactNode } from "react";
import { Links, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./styles/main.scss";

const title = "仓颉开发工具与开源项目索引 | Zxilly Cangjie Index";
const description =
  "查找仓颉 SDK 版本管理、在线运行与教程、C 与 Objective-C 绑定、Windows API 和编译器相关开源项目，浏览项目说明、文档与源码仓库。";
const url = "https://cj.zxilly.com/";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content="zh_CN" />
        <meta name="twitter:card" content="summary" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Links />
        <script
          defer
          src="https://trail.learningman.top/script.js"
          data-website-id="43517c68-32f0-4fed-9703-678507d3a72a"
          data-domains="cj.zxilly.com"
          data-exclude-search="true"
          data-exclude-hash="true"
        />
      </head>
      <body>
        <div id="root">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

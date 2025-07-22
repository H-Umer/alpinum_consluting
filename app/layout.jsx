"use client";
import { useEffect } from "react";
import "rc-slider/assets/index.css";
import "../public/styles.css";
import "photoswipe/style.css";
import "../public/stylesheets/colors/color-themes.scss";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import ClientProvider from "@/context/client-provider";
import "../app/global.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  useEffect(() => {
    setTimeout(() => {
      const header = document.querySelector("header");

      if (header && header.classList.contains("header-fixed")) {
        const nav = document.getElementById("header");

        if (nav) {
          const offsetTop = nav.offsetTop;
          const headerHeight = nav.offsetHeight;
          let injectSpace = document.getElementById("inject-space")
            ? document.getElementById("inject-space")
            : document.createElement("div");

          injectSpace.style.height = `${headerHeight}px`;
          injectSpace.style.display = "none";
          injectSpace.setAttribute("id", "inject-space"); // Add an ID

          if (!header.classList.contains("style-absolute")) {
            if (!document.getElementById("inject-space")) {
              nav.insertAdjacentElement("afterend", injectSpace);
            } else {
              injectSpace = document.getElementById("inject-space");
            }
          }

          const handleScroll = () => {
            if (window.scrollY > offsetTop + headerHeight) {
              nav.classList.add("is-fixed");
              injectSpace.style.display = "block";
            } else {
              nav.classList.remove("is-fixed");
              injectSpace.style.display = "none";
            }

            if (window.scrollY > 150) {
              nav.classList.add("is-small");
            } else {
              nav.classList.remove("is-small");
            }
          };

          window.addEventListener("load", handleScroll);
          window.addEventListener("scroll", handleScroll);

          return () => {
            window.removeEventListener("load", handleScroll);
            window.removeEventListener("scroll", handleScroll);
          };
        }
      }
    });
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Import the script only on the client side
      import("bootstrap/dist/js/bootstrap.esm").then(() => {
        // Module is imported, you can access any exported functionality if
      });
    }
  }, []);
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      <html lang="en">
        <body className="tf-popup-auto">
          <div className="wrapper-layout-container boxed">
            <ClientProvider>{children}</ClientProvider>
          </div>
        </body>
      </html>
    </>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Image from "next/image";

export function Navbar() {
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const userData = async () => {
      try {
        const user = await axios.get(
          "http://localhost:8000//api/v1/users/getcurrentuser"
        );
        if (user.status >= 200 && user.status <= 300) {
          setIsLoggedIn(true);
          setUserData(user.data.payload);
        }
      } catch (error) {
        console.log("Error occured while fetching user", error);
      }
    };

    userData();
  }, []);

  return (
    <div className="flex gap-5 subpixel-antialiased">
      <div className="p-3  pl-[100px]">
        <h2 className="font-extrabold text-3xl text-blue-700 italic tracking-wide">
          Infinite
        </h2>
        <p className="font-bold text-yellow-500 italic tracking-wide">
          Pickings
        </p>
      </div>
      <div className="flex h-16">
        <div className="mt-5 p-2 pt-3 bg-gray-100 w-10 rounded-tl-lg rounded-bl-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="grey"
            class="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
        <input
          className="mt-5 w-[550px] bg-gray-100 outline-none rounded-tr-lg rounded-br-lg"
          placeholder="Search for Products, Brands and More"
        ></input>
      </div>
      <div
        className={` cursor-pointer bg-white hover:bg-blue-600 pt-3 mt-4 mb-4 rounded-lg pr-2 transition-colors duration-300 ${
          open ? "bg-blue-600" : "bg-white"
        }`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="hover:bg-blue-600">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex gap-3" open={open}>
                  <div className="flex gap-3">
                    <div className="pl-4 font-bold text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="30"
                      height="30"
                      viewBox="0 0 256 256"
                    >
                      <defs></defs>
                      <g
                        style={{
                          stroke: "none",
                          strokeWidth: 0,
                          strokeDasharray: "none",
                          strokeLinecap: "butt",
                          strokeLinejoin: "miter",
                          strokeMiterlimit: 10,
                          fill: "none",
                          fillRule: "nonzero",
                          opacity: 1,
                        }}
                        transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                      >
                        <path
                          d="M 79.635 73.696 C 86.104 65.901 90 55.898 90 45 C 90 20.187 69.813 0 45 0 C 20.187 0 0 20.187 0 45 c 0 10.898 3.896 20.901 10.365 28.696 c 0.105 0.161 0.227 0.315 0.383 0.445 c 0.002 0.002 0.005 0.003 0.007 0.005 C 19.015 83.837 31.298 90 45 90 c 13.702 0 25.985 -6.163 34.245 -15.854 c 0.003 -0.002 0.005 -0.003 0.008 -0.005 C 79.408 74.01 79.53 73.857 79.635 73.696 z M 45 4 c 22.607 0 41 18.393 41 41 c 0 9.169 -3.026 17.645 -8.132 24.482 c -6.081 -6.505 -13.876 -10.99 -22.402 -13.023 c 6.497 -3.669 10.901 -10.629 10.901 -18.609 c 0 -11.782 -9.585 -21.367 -21.367 -21.367 c -11.782 0 -21.367 9.585 -21.367 21.367 c 0 7.979 4.404 14.939 10.901 18.608 c -8.526 2.033 -16.321 6.518 -22.402 13.023 C 7.026 62.645 4 54.169 4 45 C 4 22.393 22.393 4 45 4 z M 45 55.217 c -9.576 0 -17.367 -7.791 -17.367 -17.367 S 35.424 20.482 45 20.482 s 17.367 7.791 17.367 17.367 S 54.576 55.217 45 55.217 z M 45 86 c -11.986 0 -22.787 -5.171 -30.29 -13.399 C 22.48 64.079 33.418 59.217 45 59.217 c 11.581 0 22.52 4.863 30.29 13.384 C 67.787 80.829 56.986 86 45 86 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(0,0,0)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform="matrix(1 0 0 1 0 0)"
                          strokeLinecap="round"
                        />
                      </g>
                    </svg>
                    </div>
                    <div className="font-semibold text-lg">
                    {isloggedIn ? (
                      <div>{userData.firstName}</div>
                    ) : (
                      <div>Login</div>
                    )}
                    </div>
                  </div>
                </NavigationMenuTrigger>
                { (
                  <NavigationMenuContent className="flex flex-col w-[150px] pl-12 pr-12 pt-1 pb-1">
                    <NavigationMenuLink href="/order">
                      Orders
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/order">
                      Orders
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/order">
                      Orders
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="flex mt-[15px] gap-2 p-2 cursor-pointer">
        <div className="font-bold">
          <svg height="34" className="bold" viewBox="0 0 24 24" width="34" xmlns="http://www.w3.org/2000/svg"><path d="m5.50835165 12.5914912c-.00106615-.0057657-.00203337-.011566-.00289985-.0173991l-1.22011509-7.32069058c-.12054699-.72328196-.74633216-1.25340152-1.47959089-1.25340152h-.30574582c-.27614237 0-.5-.22385763-.5-.5s.22385763-.5.5-.5h.30574582c1.1918179 0 2.21327948.84029234 2.44951006 2h16.24474412c.3321894 0 .5720214.31795246.480762.63736056l-2 7.00000004c-.0613288.2146507-.2575218.3626394-.480762.3626394h-12.90976979l.12443308.7465985c.12054699.7232819.74633216 1.2534015 1.47959089 1.2534015h11.30574582c.2761424 0 .5.2238576.5.5s-.2238576.5-.5.5h-11.30574582c-1.22209789 0-2.26507316-.8835326-2.46598481-2.0890025l-.21991747-1.3195048zm-.08478811-6.5914912 1 6h12.69928576l1.7142857-6zm2.57643646 15c-1.1045695 0-2-.8954305-2-2s.8954305-2 2-2 2 .8954305 2 2-.8954305 2-2 2zm0-1c.55228475 0 1-.4477153 1-1s-.44771525-1-1-1-1 .4477153-1 1 .44771525 1 1 1zm9 1c-1.1045695 0-2-.8954305-2-2s.8954305-2 2-2 2 .8954305 2 2-.8954305 2-2 2zm0-1c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1-1 .4477153-1 1 .4477153 1 1 1z"/></svg>
        </div>
        <div className="font-semibold p-[2px] text-lg">Cart</div>
      </div>
      <div className="flex gap-2 mt-2 pt-4 cursor-pointer">
        <div>
          <img width="32" height="32" src="https://img.icons8.com/windows/32/online-store.png" alt="online-store"/>
        </div>
        <div className="pt-[1px] text-lg">
          Become a Seller
        </div>
      </div>
    </div>
  );
}

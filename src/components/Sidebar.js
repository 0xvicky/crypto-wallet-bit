import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdSend, MdOutlineCallReceived } from "react-icons/md";
import {
  AiOutlineFieldTime,
  AiOutlineLogout,
  AiOutlineQrcode,
  AiTwotoneSetting,
} from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { getUserBalance } from "../web3";
import { useIndexedDB } from "react-indexed-db";
import { STORENAME } from "../utils/dbConfig";
import { useNavigate } from "react-router-dom";
const Sidebar = ({ active, setActive, menuRef, account }) => {
  const [balance, setBalance] = useState(0);
  const { getByID, update } = useIndexedDB(STORENAME);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const balance = await getUserBalance(account.address);
        // console.log("balance", balance);
        setBalance(balance);
      } catch (error) {
        console.log(error);
      }
    };

    const intervalId = setInterval(() => {
      if (account?.address) {
        getData();
      }
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, [account]);

  const logOut = async () => {
    try {
      const wallet = await getByID(1);
      if (!wallet.wallet) {
        return;
      }
      const res = await update({ ...wallet, active: false });
      setTimeout(() => {
        navigate("/login");
      }, 500);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const sidebarList = [
    {
      text: "Recent transactions",
      icon: <AiOutlineFieldTime />,
      handler: () => {},
    },
    {
      text: "Settings",
      icon: <AiTwotoneSetting />,
      handler: () => {},
    },
    {
      text: "Support",
      icon: <BiSupport />,
      handler: () => {},
    },
    {
      text: "Get your QR code",
      icon: <AiOutlineQrcode />,
      handler: () => {},
    },
    {
      text: "Logout",
      icon: <AiOutlineLogout />,
      handler: () => logOut(),
    },
  ];

  return (
    <div
      ref={menuRef}
      className={`fixed h-full bg-dark-600  max-w-[300px] w-full ${
        active ? "left-0" : "-left-full "
      } top-0 left-0 rounded-r-3xl transition-all duration-300"`}
    >
      <div className="flex justify-end items-center p-8 text-2xl">
        <button
          className="text-primary"
          onClick={() => setActive((prev) => !prev)}
        >
          <FaTimes />
        </button>
      </div>
      <div className="px-4 border-b pb-6 border-gray-600">
        <p className="mt-4">Account 1</p>
        <h1 className="mb-6 text-4xl font-bold mt-4">{balance} MATIC</h1>
        <div className="grid grid-flow-col gap-2 justify-start items-center">
          <button className=" bg-primary py-2 px-6 grid grid-flow-col gap-2 justify-center items-center rounded-lg ">
            <p>Send</p> <MdSend />
          </button>
          <button className=" bg-primary py-2 px-6 grid grid-flow-col gap-2 justify-center items-center rounded-lg ">
            <p>Received</p> <MdOutlineCallReceived />
          </button>
        </div>
      </div>
      <div className="grid gap-y-4 p-4">
        {sidebarList.map((val, i) => (
          <button
            key={i}
            className="grid grid-flow-col justify-start gap-2 items-center"
            onClick={val.handler}
          >
            <span className="text-primary">{val.icon}</span>
            <p>{val.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

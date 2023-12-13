//navbar
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  return (
    <Disclosure
      as="nav"
      //   className="pr-[60px] pl-[60px]"
    >
      {({ open }) => (
        <>
          <div className="mx-auto  max-w-8xl px-2 sm:px-6 lg:px-10 border-[#0000001a] border-solid shadow-navShadow">
            <div className="relative flex h-24 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  ) : (
                    <Bars3Icon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center  sm:justify-start ">
                <div className="flex flex-shrink-0 items-center ">
                  <button className="hidden rounded-lg border-2 border-solid border-4870ad py-3 px-8 text-000000 border-backgroundButton text-center font-assistant font-semibold text-sm leading-5'">
                    התנתק
                  </button>
                </div>
                <div className="">
                  <img
                    className="h-10 w-auto"
                    src="/img/company-logo.png"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden ">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="container flex justify-around items-center  max-w-lg">
                <div className="flex justify-between">
                  <h5 className="font-bold text-sm">דוא"ל :</h5>
                  <p className="text-sm pr-1 text-blue-900">
                    kissufim@kissufim.co.il
                  </p>
                </div>
                <div className="flex">
                  <h5 className="font-bold text-sm">טלפון :</h5>
                  <p className="text-sm pr-1">08-5552266</p>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;

import { Disclosure } from "@headlessui/react";
import NavBarLogo from "./NavBarLogo";
import NavBarContact from "./NavBarContact";
import NavBarButton from "./NavBarButton";

const Navbar = () => {
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="mx-auto  max-w-8xl px-2 sm:px-6 lg:px-10 border-[#0000001a] border-solid shadow-navShadow">
            <div className="relative flex h-24 items-center justify-between">
              <NavBarLogo />
              <NavBarContact />
              <NavBarButton />
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;

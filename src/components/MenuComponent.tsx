import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { RiMenuUnfold4Fill } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";

/* import { ThemeSwitch } from "./theme-switch"; */

interface MenuComponentProps {
  handleOpenKumiteDisplay?: () => void;
  handleOpenKataDisplay?: () => void;
}

export const MenuComponent = ({
  handleOpenKumiteDisplay,
  handleOpenKataDisplay,
}: MenuComponentProps) => {
  const navigate = useNavigate();
  const { pathname: href } = useLocation();

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Button isIconOnly>
          <RiMenuUnfold4Fill />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownSection showDivider aria-label="Actions">
          <DropdownItem
            key="kata"
            href={
              href === "/kata" ? "/kumite" : href === "/kumite" ? "/kata" : ""
            }
          >
            {href === "/kata" ? "Kumite" : href === "/kumite" ? "Kata" : ""}
          </DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider aria-label="Section Action">
          <DropdownItem
            key="kataWindow"
            className="bg-gray-500 text-white font-semibold hover:bg-gray-400 rounded-md"
            onPress={
              href === "/kumite"
                ? handleOpenKumiteDisplay
                : href === "/kata"
                  ? handleOpenKataDisplay
                  : () => {}
            }
          >
            Abrir Ventana
          </DropdownItem>
          <DropdownItem key="back" onPress={() => navigate("/inicio")}>
            Inicio
          </DropdownItem>
        </DropdownSection>
        {/*  <DropdownSection showDivider aria-label="Theme">
          <DropdownItem
            key="theme"
            isReadOnly
            className="hover:bg-transparent data-[hover=true]:bg-transparent cursor-default"
            onPress={() => {}}
          >
            <ThemeSwitch />
          </DropdownItem>
        </DropdownSection> */}
      </DropdownMenu>
    </Dropdown>
  );
};

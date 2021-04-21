import React from "react";
import {BsToggleOff , BsToggleOn } from "react-icons/bs";
import tw from "twin.macro";
import {ThemeContext} from "./themeContext";

const Toggle = () => {
  const {theme, setTheme} = React.useContext(ThemeContext);

  return (
    <div tw="transition duration-500 ease-in-out rounded-full p-2">
      {theme === "dark" ? (
        <BsToggleOn
          tw="text-white text-3xl cursor-pointer"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      ) : (
        <BsToggleOff
          tw="text-black  text-3xl cursor-pointer"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      )}
    </div>
  );
};

export default Toggle;

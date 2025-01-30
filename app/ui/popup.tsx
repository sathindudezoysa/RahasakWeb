import { FC, useEffect } from "react";

// Define the props interface
interface PopupProp {
  trigger: boolean;
  childern: React.ReactNode;
}

const PopUp = ({ childern, trigger }: PopupProp) => {
  if (!trigger) return null;

  return (
    <>
      <div className="popup">
        <div className="popup-inner">{childern}</div>
      </div>
    </>
  );
};

export default PopUp;

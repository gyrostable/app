import { useState } from "react";

const useDisappearing = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  function appear() {
    setVisible(true);
    setOpen(true);
  }

  function disappear() {
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
    }, 200);
  }

  function toggle() {
    visible ? disappear() : appear();
  }

  return { open, visible, appear, disappear, toggle };
};

export default useDisappearing;

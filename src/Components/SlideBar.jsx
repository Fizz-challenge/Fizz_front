import React from "react";
import "./SlideBar.css";

const SlideBar = ({ nowSelected, setNowSelected, items }) => {
  return (
    <div className="slide-bar">
      {items.map((item, index) => (
        <div
          key={index}
          className={`slide-bar-btn ${
            nowSelected === index ? "slide-bar-selected-content" : ""
          }`}
          onClick={() => setNowSelected(index)}
        >
          {nowSelected === index && item.activeIcon ? (
            <item.activeIcon className="ionicon" />
          ) : item.inactiveIcon ? (
            <item.inactiveIcon className="ionicon" />
          ) : null}
          {item.text}
        </div>
      ))}
      <div className={`slide-btn select${nowSelected}`}></div>
    </div>
  );
};

export default SlideBar;

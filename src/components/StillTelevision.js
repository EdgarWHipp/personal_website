import React from "react";

export default function StillTelevision({
  color,
  image,
  alt,
  caption,
  channel,
}) {
  return (
    <figure className={`still-tv still-tv--${color}`}>
      <div className="still-tv__body">
        <div className="still-tv__screen">
          <img src={image} alt={alt} className="still-tv__image" />
          <div className="still-tv__scanlines" aria-hidden="true" />
          <div className="still-tv__tracking" aria-hidden="true" />
          <span className="still-tv__channel" aria-hidden="true">
            CH {channel}
          </span>
          <span className="still-tv__play" aria-hidden="true">
            ▶ PLAY
          </span>
        </div>
        <div className="still-tv__controls" aria-hidden="true">
          <div className="still-tv__speaker" />
          <span className="still-tv__brand">EH·{channel}00</span>
          <div className="still-tv__knob" />
          <span className="still-tv__light" />
        </div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

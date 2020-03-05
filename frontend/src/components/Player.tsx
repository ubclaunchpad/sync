import React from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: Function;
    YT: any;
  }
}

enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}

class Player extends React.Component<YT.PlayerOptions> {
  constructor(props: YT.PlayerOptions) {
    super(props);
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    window["onYouTubeIframeAPIReady"] = () => {
      new window["YT"].Player("player", this.props);
    };
  }

  render() {
    return <div id="player"></div>;
  }
}

export { Player as default, PlayerState };

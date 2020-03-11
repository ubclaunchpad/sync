import React from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: Function;
    YT: any;
  }
}

class Player extends React.Component<YT.PlayerOptions> {
  private internalPlayer: any;

  constructor(props: YT.PlayerOptions) {
    super(props);
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    window["onYouTubeIframeAPIReady"] = () => {
      this.internalPlayer = new window["YT"].Player("player", this.props);
    };
  }

  shouldUpdateVideo(prevProps: YT.PlayerOptions, props: YT.PlayerOptions) {
    return prevProps.videoId !== props.videoId;
  }

  updateVideo(): void {
    if (!this.props.videoId) {
      this.internalPlayer.stopVideo();
      return;
    }

    this.internalPlayer.loadVideoById(this.props.videoId);
  }

  componentDidUpdate(prevProps: YT.PlayerOptions) {
    if (this.shouldUpdateVideo(prevProps, this.props)) {
      this.updateVideo();
    }
  }

  render() {
    return <div id="player"></div>;
  }
}

export { Player as default };

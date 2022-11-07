import config from "../config.json";
import styled from "styled-components";
import { CSSReset } from "../src/components/CSSReset";
import Menu from "../src/components/Menu";
import { StyledTimeline } from "../src/components/Timeline";

import banner from '../src/assets/img/banner.png'

export default function HomePage() {

    return (
        <>
            <CSSReset />
            <div style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
            }}>
                <Menu />
                <Header />
                <Timeline playlists={config.playlists} />
            </div>
        </>
    );
}

const StyledHeader = styled.div`
    img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }
    .user-info {
        margin-top: 50px;
        display: flex;
        align-items: center;
        width: 100%;
        padding: 16px 32px;
        gap: 16px;
    }
`;

const StyledBanner = styled.section`
    img {
        height: 250px;
        aspect-ratio: 16/9;
        object-fit: cover;
        width: 100%;
    }
`;

function Header() {
    return (
        <>
            <StyledBanner >
                <img src="https://images.unsplash.com/photo-1506430730356-91514bf7359c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80" alt="banner" />
            </StyledBanner>
            <StyledHeader>

                <section className="user-info">
                    <img src={`https://github.com/${config.github}.png`} />
                    <div>
                        <h2>
                            {config.name}
                        </h2>
                        <p>
                            {config.job}
                        </p>
                    </div>
                </section>
            </StyledHeader>
        </>
    )
}

function Timeline(props) {

    const playlistNames = Object.keys(props.playlists);

    return (
        <StyledTimeline>
            {playlistNames.map((playlistName, index) => {
                const videos = props.playlists[playlistName];
                return (
                    <section key={index}>
                        <h2>{playlistName}</h2>
                        <div>
                            {videos.map((video, i) => {
                                return (
                                    <a href={video.url} key={i}>
                                        <img src={video.thumb} />
                                        <span style={{ fontWeight: 'bold' }}>
                                            {video.title}
                                        </span>
                                        <span style={{ fontSize: 12, color: '#aaa' }}>{video.channel}</span>
                                        <span style={{ fontSize: 12, color: '#aaa' }}>99mil visualizações</span>

                                    </a>
                                )
                            })}
                        </div>
                    </section>
                )
            })}
        </StyledTimeline>
    )
}
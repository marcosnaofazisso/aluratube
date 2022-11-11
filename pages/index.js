import React from "react";
import config from "../config.json";
import styled from "styled-components";
import Menu from "../src/components/Menu";
import { StyledTimeline } from "../src/components/Timeline";
import { videoService } from "../src/services/videoService";
import { createClient } from "@supabase/supabase-js";


const PROJECT_URL = "https://zwsndgmbsdgjescqjpjh.supabase.co"
const PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3c25kZ21ic2RnamVzY3FqcGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxODI1MzAsImV4cCI6MTk4Mzc1ODUzMH0.BXUkUctSuQn_Sujps3cEXJK4TRiO6ZilNQwl1DXWsJ8"
const supabase = createClient(PROJECT_URL, PUBLIC_KEY);


export default function HomePage() {

    const service = videoService();

    const [valorDoFiltro, setValorDoFiltro] = React.useState("");
    const [playlists, setPlaylists] = React.useState({});
    const [reloading, setReloading] = React.useState(false);


    React.useEffect(() => {
        service
            .getAllVideos()
            .then((dados) => {
                console.log("Data: ", dados.data);
                const novasPlaylists = {};
                dados.data.forEach((video) => {
                    if (!novasPlaylists[video.playlist]) novasPlaylists[video.playlist] = [];
                    novasPlaylists[video.playlist] = [
                        video,
                        ...novasPlaylists[video.playlist],
                    ];
                });

                setPlaylists(novasPlaylists);
            });
    }, []);

    supabase
        .channel('*')
        .on('postgres_changes', { event: '*', schema: '*' }, payload => {
            window.location.reload(false);
        })
        .subscribe()

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
            }}>
                <Menu valorDoFiltro={valorDoFiltro} setValorDoFiltro={setValorDoFiltro} />
                <Header />
                <Timeline searchValue={valorDoFiltro} playlists={playlists} />
            </div>
        </>
    );
}

const StyledHeader = styled.div`
    background-color: ${({ theme }) => theme.backgroundLevel1};
    
    img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }
    .user-info {
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
                <img src={config.backgroundLight} alt="banner" />
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

function Timeline({ searchValue, ...props }) {

    const playlistNames = Object.keys(props.playlists);

    return (
        <StyledTimeline>
            {playlistNames.map((playlistName, index) => {
                const videos = props.playlists[playlistName];
                return (
                    <section key={playlistName + index}>
                        {Object.keys(playlistName).length > 0 && <h2>{playlistName}</h2>}
                        <div>
                            {videos
                                .filter((video) => {
                                    const titleNormalized = video.titulo.toLowerCase();
                                    const searchValueNormalized = searchValue.toLowerCase();
                                    return titleNormalized.includes(searchValueNormalized);
                                })
                                .map((video, index) => {
                                    return (
                                        <a key={index + video.url} href={video.url}>
                                            <img src={video.thumb} />
                                            <span>
                                                {video.titulo}
                                            </span>
                                            <span style={{ fontSize: 12, color: '#aaa' }}>{video.canal}</span>
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
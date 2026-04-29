"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { T, ff } from "@/lib/theme";
import Reveal from "./Reveal";
import Hr from "./Hr";

export default function ExperienceVideoSection({ experience }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const playersRef = useRef({});
  const scriptLoadedRef = useRef(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "experience_videos")
          .single();

        if (error) throw error;
        if (data?.value && data.value[experience]) {
          setVideos(data.value[experience]);
        }
      } catch (err) {
        console.error("Error fetching experience videos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();

    // Load YouTube API script
    if (!window.YT) {
      if (!document.getElementById("youtube-api-script")) {
        const tag = document.createElement("script");
        tag.id = "youtube-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    } else {
      scriptLoadedRef.current = true;
    }

    window.onYouTubeIframeAPIReady = () => {
      scriptLoadedRef.current = true;
    };
  }, [experience]);

  const onPlayerStateChange = (event, videoId) => {
    // 1 is playing
    if (event.data === 1) {
      // Pause all other videos
      Object.keys(playersRef.current).forEach((id) => {
        if (id !== videoId && playersRef.current[id] && playersRef.current[id].pauseVideo) {
          playersRef.current[id].pauseVideo();
        }
      });
    }
  };

  const initPlayer = (id, youtubeId) => {
    if (playersRef.current[id]) return;

    if (window.YT && window.YT.Player) {
      playersRef.current[id] = new window.YT.Player(`player-${id}`, {
        height: "100%",
        width: "100%",
        videoId: youtubeId,
        playerVars: {
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event) => onPlayerStateChange(event, id),
        },
      });
    }
  };

  // Extract YouTube ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)/);
    return match ? match[1] : null;
  };

  if (loading) return null;
  if (videos.length === 0) return null;

  return (
    <section id="videos" style={{ padding: "120px 56px", background: T.bg }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
          <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
            Visual Stories
          </h2>
          <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
            Immerse yourself in the craft through our curated collection of producer stories and heritage films.
          </p>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "32px"
        }}>
          {videos.map((v, i) => {
            const youtubeId = getYouTubeId(v.youtubeUrl);
            if (!youtubeId) return null;

            return (
              <Reveal key={v.id || i} delay={i * 0.1}>
                <div style={{
                  background: T.paper,
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: `1px solid ${T.cream}`,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "56.25%", // 16:9
                    background: T.ink
                  }}>
                    <div
                      id={`player-${v.id || i}`}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    />
                    {/* Intersection Observer or similar to init player when needed? 
                        For now, we'll try to init when the component renders if script is ready */}
                    <PlayerInitializer 
                      id={v.id || i} 
                      youtubeId={youtubeId} 
                      initFn={initPlayer} 
                    />
                  </div>
                  <div style={{ padding: "24px" }}>
                    <h3 style={{ fontFamily: ff.h, fontSize: "20px", color: T.ink, marginBottom: "8px" }}>
                      {v.title}
                    </h3>
                    {v.placement && (
                      <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.gold, fontWeight: 700 }}>
                        {v.placement}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Simple helper to trigger initialization once script is ready
function PlayerInitializer({ id, youtubeId, initFn }) {
  useEffect(() => {
    const checkAndInit = () => {
      if (window.YT && window.YT.Player) {
        initFn(id, youtubeId);
      } else {
        setTimeout(checkAndInit, 500);
      }
    };
    checkAndInit();
  }, [id, youtubeId, initFn]);
  return null;
}

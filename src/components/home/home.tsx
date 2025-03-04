import React, { useEffect, useState } from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Book from "@src/assets/icons/home/book.svg";
import Learn from "@src/assets/icons/home/learning.svg";
import Clock from "@src/assets/icons/home/clock.svg";
import Analytics from "@src/assets/icons/home/analytics.svg";
import { baseUrl, post } from "@utils/coreApiServices";

type Enrollment = {
  id: string;
  name: string;
};

type UserMessage = {
  heading: string;
  text: string;
};

type Card = {
  heading: string;
  text: string;
};

type Redirect = string[];

type MiddleCard = {
  type: "study" | "practice" | "test" | "analytics";
  title: string;
  subject?: string;
  chapter?: string;
  message?: string;
  redirect: Redirect;
};

type BottomCard = {
  type: "study" | "practice";
  title: string;
  subject: string;
  chapter: string;
  redirect: Redirect;
};

type ResponseData = {
  enrollments: Enrollment[];
  streak: string;
  user_id: string;
  user_message: UserMessage;
  top_cards: Card[];
  middle_cards: MiddleCard[];
  bottom_cards: BottomCard[];
};

const Home: React.FC = () => {
  const [homeData, setHomeData] = useState<ResponseData | null>(null);
  const token = localStorage.getItem("accessToken");

  // const recomendedVideos = [
  //   {
  //     title: "Quantum Mechanics Basics",
  //     des: "Master the fundamentals of quantum mechanics with practice problems.",
  //     duriation: "45 mins",
  //     subject: "Physics",
  //   },
  //   {
  //     title: "Organic Chemistry Reactions",
  //     des: "Learn important reaction mechanisms with visual aids.",
  //     duriation: "30 mins",
  //     subject: "Chemistry",
  //   },
  //   {
  //     title: "Calculus Problem Solving",
  //     des: "Practice advanced calculus problems with step- by-step solutions.",
  //     duriation: "60 mins",
  //     subject: "Mathematics",
  //   },
  // ];
  const quickActions = [
    {
      title: "study",
      img: Book,
    },
    {
      title: "practice",
      img: Learn,
    },
    {
      title: "test",
      img: Clock,
    },
    {
      title: "analytics",
      img: Analytics,
    },
  ];
  function LinearProgressWithLabel(
    props: LinearProgressProps & { bgcolor: string }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: "100%",
            mr: 1,
            "& .MuiLinearProgress-root": {
              background: "#E5E7EB",
            },
            "& .MuiLinearProgress-bar": {
              backgroundColor: props.color, // Custom blue color
            },
          }}
        >
          <LinearProgress variant="determinate" {...props} sx={{}} />
        </Box>
      </Box>
    );
  }
  const getHomeData = async () => {
    const res = await post(
      `${baseUrl}api/v1/home/`,
      {},
      { AUTHORIZATION: `Bearer ${token}` }
    );
    setHomeData(res?.data);
  };
  useEffect(() => {
    getHomeData();
  }, []);
  return (
    <div className="container">
      <div className="welcome-streak-count d-flex align-center justify-between">
        <div className="welcome-txt d-flex  flex-column">
          <p>{homeData?.user_message?.heading}</p>
          <span>{homeData?.user_message?.heading}</span>
        </div>
        <div className="streak-count d-flex align-center card">
          <p>Streak Count</p> <p className="count">{homeData?.streak} 🔥</p>
        </div>
      </div>
      <div className="progress-card-wrapper align-center">
        {homeData?.top_cards?.map((data) => (
          <div
            className="card progress-card d-flex flex-column"
            key={data.heading}
          >
            <p className="title">{data.heading}</p>
            {
              <LinearProgressWithLabel
                value={parseInt(data.text.split("%")[0])}
                bgcolor={"#2563EB"}
              />
            }
            <p>{data.text}</p>
          </div>
        ))}
      </div>
      <div className="quick-actions-wrapper d-flex flex-column">
        <h3>Quick Actions</h3>
        <div className="quick-actions-card-wrapper align-center">
          {homeData?.middle_cards?.map((data) => (
            <div
              className="card actions-card d-flex flex-column align-center justify-center"
              key={data.title}
            >
              <img
                alt={data.title}
                src={quickActions?.find((e) => e.title === data.type)?.img}
              />
              <p className="title">{data.title}</p>

              <p className="des">
                {data.message ?? `${data.subject} - ${data.chapter}`}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="quick-actions-wrapper d-flex flex-column">
        <h3>Recommended for You</h3>
        <div className="recomendetation-card-wrapper align-center">
          {homeData?.bottom_cards?.map((data) => (
            <div
              className="card recomendetation-card d-flex flex-column "
              key={data.title}
            >
              <div className="details d-flex flex-column">
                <div className="d-flex align-center justify-between">
                  {" "}
                  <p className={`sub ${data.subject}`}>{data.subject}</p>
                  <p className="dur">{"40 mins"}</p>
                </div>
                <p className="title">{data.title}</p>

                <p className="des">{data.chapter}</p>
              </div>
              <p className="start-learning">Start Learning →</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

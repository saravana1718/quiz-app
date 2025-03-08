import React, { useEffect, useState } from "react";
import Physics from "@src/assets/icons/physics.svg";
import Chemistry from "@src/assets/icons/chemistry.svg";
import Maths from "@src/assets/icons/maths.svg";
import Arrow from "@src/assets/icons/goArrow.svg";
import Back from "@src/assets/icons/back.svg";
import Done from "@src/assets/icons/done.svg";
import Lock from "@src/assets/icons/lock.svg";
import Continue from "@src/assets/icons/continue.svg";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { Box } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import VideoPlayer from "@components/common/videoPlayer";
import QuizApp from "@components/common/quiz";
import { baseUrl, get, post } from "@utils/coreApiServices";

type ContinueLearningOption = {
  chapter: string;
  subject: string;
  redirect: [string, string]; // Tuple for exact two-element array
};

type ContinueLearning = {
  options: ContinueLearningOption[];
  title: string;
};
type Data = {
  content_chooser: ContentChooser;
  continue_learning: ContinueLearning;
};

type ContentChooser = {
  title: string;
  content: Record<string, Subject>;
};

type Subject = {
  name: string;
 
  total_units: number;
  total_chapters: number;
};

type Unit = {
  name: string;
  chapters: Record<string, Chapter>;
};

type Chapter = {
  name: string;
  lectures: Record<string, Lecture>;
  total_lectures: string;
  progress: string;
  previously_player: string;
  completed: boolean;
};

type Lecture = {
  name: string;
  bucket_path: string;
 
};

const StudyZone: React.FC = () => {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const sub = searchParams.get("sub");
  const id = searchParams.get("val");
  const unit = searchParams.get("unit");
  const Chapter = searchParams.get("chapter");
  const [studyZoneData, setStudyZoneData] = useState<Data>();
  const [units,setUnits]=useState<Record<string, string>>()
  const [chapters,setChapters]=useState<Record<string, string>>()
  const[lecture,setLecture]=useState<Record<string, Lecture>>()
  const token = localStorage.getItem("accessToken");
  const [videoUrl, setVideoUrl] = useState("");
  const [fileName, setFilename] = useState("");
  const [subject, setsubject] = useState("");
  const subjects = [
    {
      title: "Physics",
      img: Physics,
      des: "Master mechanics, electricity, and modern physics",
    },
    {
      title: "Chemistry",
      img: Chemistry,
      des: "Explore organic, inorganic, and physical chemistry",
    },
    {
      title: "Maths",
      img: Maths,
      des: "Learn calculus, algebra, and coordinate geometry",
    },
  ];
  const navigate = useNavigate();
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
          <LinearProgress variant="determinate" {...props} />
        </Box>
      </Box>
    );
  }

  const getHomeData = async () => {
    const res = await post(
      `${baseUrl}api/v1/study/`,
      {
        enrollments: [
          {
            id: "67b07d24b5dcfe3ad81a7e60",
            name: "Chemistry",
          },
          {
            id: "67b07d25b5dcfe3ad81a7e62",
            name: "Maths",
          },
          {
            id: "67b07d25b5dcfe3ad81a7e63",
            name: "Physics",
          },
        ],
      },
      { AUTHORIZATION: `Bearer ${token}` }
    );
    setStudyZoneData(res?.data);
  };
 
  const getVideoUrl = async (obj: string) => {
    const res = await post(
      `${baseUrl}api/v1/study/url`,
      {
        object_name: obj,
        bucket_name: "matrix_edu_enrollments",
        expiration_minutes: 60,
      },
      { AUTHORIZATION: `Bearer ${token}` }
    );
    setFilename(obj);
    setsubject(sub || "");
    setVideoUrl(res?.data?.signed_url);
  };
  const getUnits = async (id: string) => {
    const res = await get(
      `${baseUrl}api/v1/study/units/${id}`,
      { AUTHORIZATION: `Bearer ${token}` },
     
    );
  setUnits(res?.data)
  };
  const getChapters = async (id: string) => {
    const res = await get(
      `${baseUrl}api/v1/study/chapters/${id}`,
      { AUTHORIZATION: `Bearer ${token}` },
     
    );
    setChapters(res?.data)
  };
  const getLectures = async (id: string) => {
    const res = await get(
      `${baseUrl}api/v1/study/lectures/${id}`,
      { AUTHORIZATION: `Bearer ${token}` },
     
    );
    setLecture(res?.data)
  };
  useEffect(() => {
    getHomeData();
  }, []);
  useEffect(() => {
    if(id){
      setUnits({});
      setChapters({});
      setLecture({});
      getUnits(id);
    }
  }, [id]);
  useEffect(() => {
    if(unit){
      getChapters(unit);
    }
  }, [unit]);
  useEffect(() => {
    if(Chapter){
      getLectures(Chapter);
    }
  }, [Chapter]);
  return (
    <div className="container">
      {!section ? (
        <>
          <div className="quick-actions-wrapper d-flex flex-column mt-0">
            <h3>Choose Your Subject</h3>
            <div className="subject-card-wrapper align-center">
              {studyZoneData &&
                Object.entries(studyZoneData?.content_chooser.content)?.map(
                  ([key, data]) => (
                    <div
                      className="card subject-card d-flex flex-column "
                      key={data.name}
                      onClick={() =>
                        navigate(
                          `/study-zone?section=unit&val=${key}&sub=${data.name}`
                        )
                      }
                    >
                      <div className={`img ${data.name}`}>
                        {" "}
                        <img
                          alt={data.name}
                          src={
                            subjects?.find((e) => e.title === data.name)?.img
                          }
                        />
                      </div>
                      <p className="title">{data.name}</p>

                      <p className="des">
                        {subjects?.find((e) => e.title === data.name)?.des}
                      </p>
                      <div className="chapter d-flex align-center justify-between">
                        {data.total_chapters} Chapters{" "}
                        <img alt="arrow" src={Arrow} />
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
          <div className="quick-actions-wrapper d-flex flex-column ">
            <h3>Continue Learning</h3>
            <div className="video-card-wrapper d-flex flex-column ">
              {studyZoneData?.continue_learning?.options?.map((data) => (
                <div
                  className="card video-card d-flex align-center justify-between"
                  key={data.chapter}
                >
                  <div className="d-flex details flex-column">
                    <p className="title">{data.chapter}</p>

                    <div className="sub">{`${
                      data.subject
                    } • Chapter ${"8"}`}</div>
                    {/* {
                      <LinearProgressWithLabel
                        value={data.val}
                        bgcolor={data.color}
                      />
                    } */}
                  </div>
                  <button>
                    Continue{" "}
                    <p>
                      <img alt="img" src={Continue} />
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : section === "unit" ? (
        <>
          <div
            className="goback d-flex align-center"
            onClick={() => navigate("/study-zone")}
          >
            <img src={Back} alt="back" /> Back to Subjects
          </div>
          <div className="quick-actions-wrapper d-flex flex-column ">
            <h3>{studyZoneData?.content_chooser.content[id as string].name}</h3>
            <div className="video-card-wrapper video-grid d-flex flex-column ">
              {units &&
                Object.entries(
                 units
                )?.map(([key, data]) => (
                  <div
                    className="card video-card d-flex flex-column"
                    key={key}
                    onClick={() =>
                      navigate(
                        `/study-zone?section=chapter&unit=${key}&val=${id}&sub=${sub}`
                      )
                    }
                  >
                    <p className="title d-flex align-center justify-between">
                      {data}{" "}
                      {/* <p
                        className={`status ${
                          data.val === 0
                            ? "not-started"
                            : data.val === 100
                            ? "completed"
                            : "in-progress"
                        }`}
                      >
                        {data.val === 0
                          ? "Not Started"
                          : data.val === 100
                          ? "Completed"
                          : "In Progress"}{" "}
                      </p> */}
                    </p>

                    {/* <div className="sub">{`${data.} • Chapters`}</div> */}

                    {/* <LinearProgressWithLabel
                      value={data.val}
                      bgcolor={data.color}
                    /> */}
                  </div>
                ))}
            </div>
          </div>
        </>
      ) : section === "chapter" ? (
        <>
          <div
            className="goback d-flex align-center"
            onClick={() =>
              navigate(
                `/study-zone?section=unit&unit=${unit}&val=${id}&sub=${sub}`
              )
            }
          >
            <img src={Back} alt="back" /> Back to Units
          </div>
          <div className="quick-actions-wrapper d-flex flex-column ">
            <h3>
              {
                units&&units[
                  unit as string
                ]
              }
            </h3>
            <div className="video-card-wrapper video-grid d-flex flex-column ">
              {chapters &&
                Object.entries(
              
                 chapters
                )?.map(([key, data], idx) => (
                  <div
                    className="card video-card d-flex flex-column"
                    key={idx}
                    onClick={() =>
                      navigate(
                        `/study-zone?section=topic&unit=${unit}&val=${id}&chapter=${key}&sub=${sub}`
                      )
                    }
                  >
                    <p className="title d-flex align-center justify-between">
                      {data}{" "}
                      {/* <p
                        className={`status ${
                          parseInt(data.progress) === 0
                            ? "not-started"
                            : data.completed
                            ? "completed"
                            : "in-progress"
                        }`}
                      >
                        {parseInt(data.progress) === 0
                          ? "Not Started"
                          : data.completed
                          ? "Completed"
                          : "In Progress"}{" "}
                      </p> */}
                    </p>
{/* 
                    <div className="sub">{`${data.total_lectures} • Topics `}</div>

                    <LinearProgressWithLabel
                      value={parseInt(data.progress)}
                      bgcolor={"#2563EB"}
                    /> */}
                  </div>
                ))}
            </div>
          </div>
        </>
      ) : section === "topic" ? (
        <>
          <div
            className="goback d-flex align-center"
            onClick={() =>
              navigate(
                `/study-zone?section=unit&unit=${unit}&val=${id}&chapter=${Chapter}&sub=${sub}`
              )
            }
          >
            <img src={Back} alt="back" /> Back to Chapters
          </div>
          <div className="quick-actions-wrapper d-flex flex-column ">
            <h3>
              {
              chapters&&chapters[Chapter as string]
              }
            </h3>
            <div className="topics-wrapper d-flex flex-column ">
              {lecture &&
                Object.entries(
                lecture
                  
                )?.map(([key, data], idx) => (
                 
                  <div
                    className="card video-card d-flex align-center justify-between"
                    key={idx}
                    onClick={() => {
                      navigate(
                        `/study-zone?section=video&unit=${unit}&val=${id}&chapter=${Chapter}&sub=${sub}`
                      );
                      getVideoUrl(data.bucket_path);
                    }}
                  >
               
                    <div className="icon-details-wrapper d-flex align-center">
                      {/* <div
                        className={`img ${
                          parseInt(data.progress) === 100
                            ? "Done"
                            : parseInt(data.progress) === 0
                            ? "Lock"
                            : "Continue"
                        }`}
                      >
                        <img
                          alt={data.name}
                          src={
                            parseInt(data.progress) === 100
                              ? Done
                              : parseInt(data.progress) === 0
                              ? Lock
                              : Continue
                          }
                        />{" "} */}
                      </div>
                      <div className="details d-flex ">
                        <p className="title d-flex align-center justify-between">
                          {data.name}
                        </p>

                       
                      </div>
                    </div>
                    // {/* {parseInt(data.progress) !== 100 ||
                    // parseInt(data.progress) !== 0 ? (
                    //   <button>Continue</button>
                    // ) : (
                    //   <img alt="alt" src={Arrow} />
                    // )} */}
                 
                ))}
            </div>
          </div>
        </>
      ) : section === "quiz" ? (
        <QuizApp subject={subject} fileName={fileName} />
      ) : (
        <>
          <div
            className="goback d-flex align-center"
            onClick={() => {
              navigate(
                `/study-zone?section=topic&unit=${unit}&val=${id}&chapter=${Chapter}&sub=${sub}`
              );
              setVideoUrl("");
            }}
          >
            <img src={Back} alt="back" /> Back to Topics
          </div>
          {videoUrl ? <VideoPlayer url={videoUrl} /> : <>Loding</>}
        </>
      )}
    </div>
  );
};

export default StudyZone;

import React, { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../Context/UserDataContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"


function Home() {
  const { serverUrl, userData, setUserData, getGeminiResponse } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [listeining, setListeining] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      // console.log(result);
      navigate("/signin");
      setUserData(null);
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start")
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }

  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "auto";
    const voices = window.speechSynthesis.getVoices();
    const hindi = voices.find((v) => v.lang === "hi-IN");
    if (hindi) {
      utterance.voice = hindi;
    }

    isSpeakingRef.current = true;

    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800)
    };
    synth.cancel()
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1; // Normal pitch
    utterance.volume = 100; // Full volume
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type) {
      const query = encodeURIComponent(userInput);

      switch (type) {
        /* ------------------ SEARCH TYPES ------------------ */
        case "google-search":
          window.open(`https://www.google.com/search?q=${query}`, "_blank");
          break;

        case "youtube-search":
          window.open(
            `https://www.youtube.com/results?search_query=${query}`,
            "_blank"
          );
          break;

        case "weather-show":
          window.open(
            `https://www.google.com/search?q=weather+in+${query}`,
            "_blank"
          );
          break;

        /* ------------------ PLAY MEDIA TYPES ------------------ */
        case "youtube-play":
        case "play-song":
          window.open(
            `https://www.youtube.com/results?search_query=${query}+song`,
            "_blank"
          );
          break;

        /* ------------------ OPEN WEBSITES (General) ------------------ */
        case "open-google":
          window.open("https://www.google.com/", "_blank");
          break;

        case "open-youtube":
          window.open("https://www.youtube.com/", "_blank");
          break;

        case "open-instagram":
          window.open("https://www.instagram.com/", "_blank");
          break;

        case "open-facebook":
          window.open("https://www.facebook.com/", "_blank");
          break;

        case "open-twitter":
          window.open("https://twitter.com/", "_blank");
          break;

        case "open-github":
          window.open("https://github.com/", "_blank");
          break;

        case "open-reddit":
          window.open("https://www.reddit.com/", "_blank");
          break;

        case "open-linkedin":
          window.open("https://www.linkedin.com/", "_blank");
          break;

        case "open-naukri":
          window.open("https://www.naukri.com/", "_blank");
          break;

        case "open-unstop":
          window.open("https://unstop.com/", "_blank");
          break;

        /* ------------------ SHOPPING ------------------ */
        case "open-amazon":
          window.open("https://www.amazon.in/", "_blank");
          break;

        case "open-flipkart":
          window.open("https://www.flipkart.com/", "_blank");
          break;

        case "open-snapdeal":
          window.open("https://www.snapdeal.com/", "_blank");
          break;

        /* ------------------ ENTERTAINMENT ------------------ */
        case "open-netflix":
          window.open("https://www.netflix.com/", "_blank");
          break;

        case "open-spotify":
          window.open("https://open.spotify.com/", "_blank");
          break;

        /* ------------------ FOOD DELIVERY ------------------ */
        case "open-swiggy":
          window.open("https://www.swiggy.com/", "_blank");
          break;

        case "open-zomato":
          window.open("https://www.zomato.com/", "_blank");
          break;

        /* ------------------ KNOWLEDGE ------------------ */
        case "open-wikipedia":
          window.open("https://www.wikipedia.org/", "_blank");
          break;

        case "open-quora":
          window.open("https://www.quora.com/", "_blank");
          break;

        case "open-medium":
          window.open("https://medium.com/", "_blank");
          break;

        case "open-stackoverflow":
          window.open("https://stackoverflow.com/", "_blank");
          break;

        /* ------------------ CHATTING ------------------ */
        case "open-whatsapp":
          window.open("https://web.whatsapp.com/", "_blank");
          break;

        case "open-whatsapp-chat":
          // userInput = "9876543210" (number)
          const num = userInput.replace(/\D/g, "");
          window.open(`https://wa.me/${num}`, "_blank");
          break;

        case "open-telegram":
          window.open("https://web.telegram.org/", "_blank");
          break;

        /* ------------------ APPS / EXTRA ------------------ */
        case "calculator-open":
          alert(
            "Browser cannot open Calculator. Showing online calculator instead."
          );
          window.open(
            "https://www.online-calculator.com/full-screen-calculator/",
            "_blank"
          );
          break;

        default:
        // console.log("Unknown command type:", type);
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false

    recognitionRef.current = recognition;

    let isMounted = true

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start")
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error(error);
          }
        }
      }
    }, 1000)


    recognition.onstart = () => {
      // console.log("Recognition started");
      isRecognizingRef.current = true;
      setListeining(true);
    };

    recognition.onend = () => {
      // console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListeining(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
              console.log("Recognition Restarted")
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log(error)
              }
            }
          }
        })
      }
    };


    recognition.onerror = (event) => {
      // console.warn("Recognition Error: ", event.error);
      isRecognizingRef.current = false;
      setListeining(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
              console.log("Recognition restarted after error")
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log(error)
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      // console.log("heard :", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        // console.log("command :", transcript);
        setAiText("")
        setUserText(transcript)
        recognition.stop();
        isRecognizingRef.current = false;
        setListeining(false);
        const data = await getGeminiResponse(transcript);
        // console.log(data);
        handleCommand(data);
        setAiText(data.response)
        setUserText("")
      }
    };


    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, What can I help you?`)
    greeting.lang = 'hi-IN'
    window.speechSynthesis.speak(greeting)

    return () => {
      isMounted = false;
      clearTimeout(startTimeout)
      recognition.stop();
      setListeining(false);
    };
  }, []);

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-t from-[black] to-[#030348] flex justify-center items-center flex-col gap-4 overflow-hidden">

      <CgMenuRight
        className="text-white  h-[25px] w-[25px] absolute right-[20px] top-[20px] cursor-pointer"
        onClick={() => setHam(true)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-1/3 bg-[#00000057] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start overflow-hidden transform transition-transform duration-300 ease-in-out ${ham ? "translate-x-0" : "translate-x-full"}`}>

        <RxCross1
          className="text-white h-[25px] w-[25px] absolute right-[20px] top-[20px] cursor-pointer"
          onClick={() => setHam(false)}
        />

        <button
          className="px-10 py-3 bg-white rounded-full text-black font-semibold mt-[30px] cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          className="px-10 py-3 bg-white rounded-full text-black font-semibold sm:mt-[10px] cursor-pointer"
          onClick={() => navigate("/customize")}
        >
          Customize Your Assistant
        </button>

        {/* line */}
        <div className="w-full h-1 bg-gray-400"></div>

        <h1 className="text-white font-semibold text-2xl">History</h1>

        <div className="w-full h-[400px] flex flex-col gap-[2px] overflow-y-auto">

          {userData?.history?.reverse().map((his, index) => (
            <ul key={index}>
              <li className="text-white truncate">{his}</li>
            </ul>
          ))}
        </div>
      </div>

      {/* <button
        className="px-10 py-3 bg-white rounded-full text-black font-semibold absolute top-[10px] right-6 hidden lg:block"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        className="px-10 py-3 bg-white rounded-full text-black font-semibold absolute top-[80px] right-6 hidden lg:block"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button> */}

      <div className="w-[80%] h-[50%] lg:w-[350px] lg:h-[450px] bg-[#020231] border-3 border-white rounded-2xl overflow-hidden flex items-center justify-center shadow-blue-950">
        <img
          src={userData?.assistantImage}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-white font-semibold text-2xl">
        I'm {userData?.assistantName}
      </h1>

      {!aiText && <img src={userImg} className="w-[200px]" />}
      {aiText && <img src={aiImg} className="w-[200px]" />}


      <h3 className="text-white text-[16px] text-wrap text-center px-4">
        {userText ? userText : aiText ? aiText : null}
      </h3>

    </div>

  );
}

export default Home;

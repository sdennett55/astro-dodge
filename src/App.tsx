import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import cx from "classnames";
import { useRequestAnimationFrame } from "./useRequestAnimationFrame";
import { generateRandomTuple } from "./generateRandomTuple";
import Stars from "./images/vector-space.png";
import Alien from "./images/alien.png";
import Flame from "./images/flame.png";
import Asteroid from "./images/asteroid.png";
import { AnimatedBackground } from "./AnimatedBackground";

const NUM_OF_PILLARS = 5;
const DIST_BETWEEN_PILLARS = 300;

// type HighScore = {
//   name: string
//   score: number
// }

export default function App() {
  const [numOfLevel, setNumOfLevel] = useState(1);
  const [startGame, setStartGame] = useState(false);
  const [playerUp, setPlayerUp] = useState(false);
  const [levelScore, setLevelScore] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [showNewLevelScreen, setShowNewLevelScreen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showFlame, setShowFlame] = useState(false);
  const [hasOverlap, setHasOverlap] = useState(false);
  const [endOfLevelReached, setEndOfLevelReached] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerWidth);
  const playerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [pillarRefHeights, setPillarRefHeights] = useState<[number, number][]>(
    []
  );

  const [showTitleScreen, setShowTitleScreen] = useState(true);

  // const [highScores, setHighScores] = useState<HighScore[]>([
  //   { name: "steve", score: 10 },
  //   { name: "steve", score: 23 }
  // ])

  const [pillarRefs, setPillarRefs] = useState<
    [React.RefObject<HTMLDivElement>, React.RefObject<HTMLDivElement>][]
  >([]);

  useEffect(() => {
    setHasMounted(true);

    const updatewindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", updatewindowHeight);

    return () => {
      window.removeEventListener("resize", updatewindowHeight);
    };
  }, []);

  useEffect(() => {
    if (hasOverlap) {
      setPlayerUp(false);

      setTimeout(() => {
        setGameOver(true);
        setHasOverlap(false);
        setStartGame(false);
      }, 3000);
    }
  }, [hasOverlap]);

  // set up pillars on new level change or when the game ends
  useLayoutEffect(() => {
    setPillarRefs([]);
    const numberOfDivs = NUM_OF_PILLARS + numOfLevel * 2;
    // Initialize the refs with useRef and add them to the divRefs array
    for (let i = 0; i < numberOfDivs; i++) {
      setPillarRefs((prevRefs) => [
        ...prevRefs,
        [React.createRef(), React.createRef()],
      ]);

      const multiplier = numOfLevel * 5;

      if (i === 0) {
        // need more leniency here, first one.
        const minHeight = Math.min(10 + multiplier / 2, 75);
        const maxHeight = Math.min(45 + multiplier / 2, 60);
        setPillarRefHeights([generateRandomTuple(minHeight, maxHeight)]);
      } else {
        const minHeight = Math.min(50 + multiplier / 2, 80);
        const maxHeight = Math.min(80 + multiplier / 2, 85);
        setPillarRefHeights((prevHeights) => [
          ...prevHeights,
          generateRandomTuple(minHeight, maxHeight),
        ]);
      }
    }
    setHasMounted(true);
  }, [windowHeight, gameOver, numOfLevel]);

  useEffect(() => {
    // reach end of level
    if (levelScore === NUM_OF_PILLARS + numOfLevel * 2) {
      setEndOfLevelReached(true);
      setPlayerUp(true);
      setTimeout(() => {
        setShowNewLevelScreen(true);
        setShowFlame(false);
      }, 3000);
    }
  }, [levelScore, numOfLevel]);

  useEffect(() => {
    if (levelScore) {
      setGameScore((prevScore) => prevScore + 1);
    }
  }, [levelScore]);

  const callback = useCallback(() => {
    if (!playerRef.current) {
      return;
    }
    if (!startGame) {
      return;
    }
    if (!hasMounted) {
      return;
    }
    if (hasOverlap) {
      return;
    }
    if (endOfLevelReached) {
      return;
    }

    const player = playerRef.current.getBoundingClientRect();

    const pillarCoords = pillarRefs
      .flatMap((refTuple) => refTuple)
      .filter((ref) => ref.current !== null)
      .map((ref) => ref.current!.getBoundingClientRect());

    const isOverlapping = pillarCoords.some((rect) => {
      // Check for overlap
      const overlap =
        !(
          player.right < rect.left ||
          player.left > rect.right ||
          player.bottom < rect.top ||
          player.top > rect.bottom
        ) ||
        player.y < 0 ||
        player.y > window.innerHeight - player.height;
      return overlap;
    });

    if (isOverlapping) {
      setHasOverlap(true);
    }

    const score =
      pillarCoords.filter((pillar) => player.left - player.width > pillar.left)
        .length / 2;
    setLevelScore(score);
  }, [hasOverlap, startGame, endOfLevelReached, hasMounted, pillarRefs]);

  useRequestAnimationFrame(callback);

  useEffect(() => {
    let timeout: number;

    const goUp = (e: PointerEvent) => {
      e.preventDefault();
      if (!startGame) {
        return;
      }
      if (endOfLevelReached) {
        return;
      }
      if (hasOverlap) {
        return;
      }
      setPlayerUp(true);
    };
    const goDown = (e: PointerEvent) => {
      e.preventDefault();
      if (!startGame) {
        return;
      }
      if (endOfLevelReached) {
        return;
      }
      if (hasOverlap) {
        return;
      }
      setPlayerUp(false);
    };

    window.addEventListener("pointerdown", goUp);
    window.addEventListener("pointerup", goDown);

    return () => {
      window.removeEventListener("pointerdown", goUp);
      window.removeEventListener("pointerup", goDown);
      clearTimeout(timeout);
    };
  }, [endOfLevelReached, hasOverlap, startGame]);

  const getTranslateX = (index: number) => {
    if (index === 0) {
      return `translateX(70vw)`;
    } else {
      return `translateX(calc(70vw + ${DIST_BETWEEN_PILLARS * index}px)`;
    }
  };

  const getDistanceToScroll = () => {
    const numPillars = NUM_OF_PILLARS + numOfLevel * 2;

    return window.innerWidth * 0.7 + numPillars * DIST_BETWEEN_PILLARS;
  };

  const getSpeedOfScroll = () => {
    return (getDistanceToScroll() / 2.5) * 10;
  };

  const getPlayerTransform = () => {
    if ((endOfLevelReached || startGame) && !playerUp) {
      return `translateY(${window.innerHeight * 2}px)`;
    } else if (playerUp) {
      return `translateY(${window.innerHeight * -1}px)`;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden text-white">
      <div className="ImageWrap fixed inset-0 w-screen h-full">
        <img
          src={Stars}
          className={cx(
            "absolute left-0 bottom-0 h-auto w-[3077px] transition-transform max-w-none"
          )}
          style={{
            transform: startGame ? `translateX(-300px)` : undefined,
            transitionDuration: startGame ? "30000ms" : undefined,
          }}
          width={3000}
          height={1834}
          alt=""
        />
        <img
          src={Stars}
          className={cx(
            "absolute left-[3000px] bottom-0 h-auto w-[3077px] transition-transform max-w-none",
            {
              "duration-[30000ms]": startGame,
            }
          )}
          style={{
            transform: startGame ? `translateX(-300px) scaleX(-1)` : undefined,
            transitionDuration: startGame ? "30000ms" : undefined,
          }}
          width={3000}
          height={1834}
          alt=""
        />
        <div
          className="w-full h-full opacity-50"
          style={{ background: "radial-gradient(rgb(26 31 59), rgb(0, 0, 0))" }}
        />
      </div>
      {!showTitleScreen && !gameOver && (
        <div className="fixed top-0 p-4 h-16 w-full text-2xl z-10">
          Score: {gameScore}
        </div>
      )}

      {/* @TODO: decide how far to translate based on level pillars */}
      <div
        ref={mapRef}
        className={cx("relative h-full z-1", {
          "transition-transform ease-linear": startGame,
        })}
        style={{
          transform: startGame
            ? `translateX(${getDistanceToScroll() * -1}px)`
            : undefined,
          transitionDuration: startGame ? `${getSpeedOfScroll()}ms` : undefined,
        }}
      >
        {pillarRefs.map(([refA, refB], index) => {
          return (
            <div key={index}>
              <div
                className={`absolute top-0 w-16 bg-bottom`}
                ref={refA}
                style={{
                  backgroundImage: `url(${Asteroid})`,
                  transform: getTranslateX(index),
                  height: pillarRefHeights[index][0] + "%",
                  backgroundSize: "100%",
                }}
              />
              <div
                className={`absolute bottom-0 w-16`}
                ref={refB}
                style={{
                  backgroundImage: `url(${Asteroid}) `,
                  transform: getTranslateX(index),
                  height: pillarRefHeights[index][1] + "%",
                  backgroundSize: "100%",
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        ref={playerRef}
        className={cx(
          "fixed left-1/4 top-1/2 -mt-8 w-16 h-16 ease-in will-change-transform",
          {
            "ease-in": (endOfLevelReached || startGame) && !playerUp,
            "ease-out-in": playerUp,
          }
        )}
        style={{
          transform: getPlayerTransform(),
          transitionDuration:
            (endOfLevelReached || startGame) && !playerUp
              ? `2000ms`
              : playerUp
              ? `2000ms`
              : undefined,
          transitionProperty: "transform",
        }}
      >
        <div
          className={cx({
            "duration-0 transition-transform ": !hasOverlap,
            "rotate-180 duration-500": hasOverlap,
            "animate-idle-hover": !startGame,
          })}
        >
          <img src={Alien} alt="" />
          {showFlame && (
            <img
              src={Flame}
              alt=""
              className={cx(
                "m-auto max-w-none transition-opacity duration-200",
                {
                  "opacity-1": playerUp,
                  "opacity-0": !playerUp,
                }
              )}
              width={41}
              height={51}
            />
          )}
        </div>
      </div>

      <div
        className={cx(
          "veil fixed w-full h-full inset-0 bg-black bg-opacity-50 text-white text-4xl flex justify-center items-center",
          {
            hidden: !gameOver,
          }
        )}
      >
        <AnimatedBackground startGame={startGame} />
        <div className=" relative p-4 w-screen flex flex-col gap-2 justify-center items-center text-center">
          <h2 className="text-7xl mb-8">GAME OVER </h2>
          <p className="text-2xl">Level: {numOfLevel}</p>
          <p className="text-2xl">Final Score: {gameScore}</p>
          {/* <div className="mt-8">
              <h4 className="mb-2">Top Ten</h4>
              {highScores
                .sort((a, b) => (a.score > b.score ? -1 : 1))
                .map(({ name, score }) => (
                  <div className="grid grid-cols-12 text-left">
                    <div className="col-span-10">{name}</div>{" "}
                    <div className="col-span-2 text-right">{score}</div>
                  </div>
                ))}
            </div> */}
          <div className="mt-8 flex justify-center items-center gap-8 flex-wrap">
            <button
              onClick={() => {
                setHasOverlap(false);
                setGameOver(false);
                setShowNewLevelScreen(false);
                setEndOfLevelReached(false);
                setGameScore(0);
                setLevelScore(0);
                setNumOfLevel(1);
              }}
              className="animate-pulse px-4 py-2 rounded-md bg-[#5caa91] text-black outline-none hover:bg-[#7dcab1] focus:bg-[#7dcab1] transition-all"
            >
              Try again
            </button>
          </div>
        </div>
      </div>

      <div
        className={cx(
          "veil fixed w-full h-full inset-0 text-7xl duration-0 flex justify-center items-center",
          {
            "animate-level-screen": showNewLevelScreen,
          }
        )}
        style={{
          transform: "translateY(-100%)",
        }}
        onAnimationEnd={() => {
          setPlayerUp(false);
          setEndOfLevelReached(false);
          setHasOverlap(false);
          setStartGame(false);
          setShowNewLevelScreen(false);
          setNumOfLevel((prevLevel) => prevLevel + 1);
        }}
      >
        Level {numOfLevel + 1}
      </div>

      {/* Essentially an invisible veil over the screen to prevent iOS long tapping issues */}
      {startGame && (
        <div
          className=" veil fixed w-full h-full inset-0 text-7xl duration-0 flex justify-center items-center"
          onTouchStart={(e) => {
            e.preventDefault();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
          }}
          onTouchMove={(e) => {
            e.preventDefault();
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
          }}
        />
      )}
      {!startGame && !gameOver && (
        <div
          className="wtfwtfwtf veil fixed w-full h-full inset-0 text-7xl duration-0 flex justify-center items-center"
          onClick={() => {
            setGameOver(false);
            setStartGame(true);
            setHasOverlap(false);
            setShowFlame(true);
          }}
        />
      )}
      {showTitleScreen && (
        <div
          className="veil leading-none fixed w-full h-full bg-[#091c3e] inset-0 text-white text-4xl flex flex-col justify-center items-center"
          onClick={() => {
            setShowTitleScreen(false);
          }}
        >
          <AnimatedBackground startGame={startGame} />
          <div className="animate-pulse relative text-4xl">
            <h1 className="skew-x-6 leading-none rotate-[-20deg] text-7xl absolute inset-0 -mt-0.5 -ml-0.5">
              <p className="leading-none text-[#fff]">ASTRO</p>
              <p className="ml-5 leading-none -mt-4  text-[#fff]">DODGE</p>
            </h1>
            <h1 className="skew-x-6 leading-none rotate-[-20deg] text-7xl">
              <p className="leading-none text-[#6fc4a9]">ASTRO</p>
              <p className="ml-5 leading-none -mt-4 text-[#8db5e7]">DODGE</p>
            </h1>
          </div>
          <p className="relative mt-16 text-lg">Tap to play</p>
        </div>
      )}
    </div>
  );
}

import {useState,useEffect,useRef} from "react";
import Buttons from './components/Buttons';
import './App.scss';


function App() {

  //Array of colors used in the game
  const colors:string[]=["red","green","yellow","blue"];

  //Sound refrences
  const redAudioRef = useRef(new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'));
  const greenAudioRef = useRef(new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'));
  const yellowAudioRef = useRef(new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'));
  const blueAudioRef = useRef(new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'));
  const sounds = [redAudioRef, greenAudioRef, yellowAudioRef, blueAudioRef];



  //Initial state of the game
  type startPlay={
    display:boolean,
    colors:string[],
    score:number,
    highest:number,
    userPlay:boolean,
    userColors:string[]

  }
  //Highest score state
  const [highScore,setHighScore]=useState(0);
  const startplay:startPlay={
    display:false,
    colors:[],
    score:0,
    highest:highScore,
    userPlay:false,
    userColors:[]
};

//Highest scor local storeage get
useEffect(() => {
  let highest = localStorage.getItem("highestScore");
  if (highest) {
    setHighScore(+highest);
  }
}, []);

const [isOn,setIsOn] = useState(false);
const [play,setPlay]=useState(startplay);
const [flashColor, setFlashColor] = useState("")

//Function to start the game
function start(){
  setIsOn(true);
}

//Function to end the game
function end() {
  if(!play.display){
   setIsOn(false);
  }
}

//Display the game when the game is on
useEffect(() => {
  if (isOn) {
    setPlay({...startplay, display: true });
  } else {
    setPlay(startplay);
  }
}, [isOn]);

//Random color when the game is on and the gmae displaied
useEffect(()=>{
  if(isOn && play.display){
      let newColor:string = colors[Math.floor(Math.random()*4)];
      const selectedColors:string[] = [...play.colors]
      selectedColors.push(newColor)
      setPlay({...play,colors:selectedColors})   
  }
},[isOn,play.display])

//Show the color
useEffect(()=>{
if(isOn && play.display && play.colors.length){
    displayColors()
}
},[isOn,play.display,play.colors.length])


function timeout(ms:number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



//Display color function, show the color that randomly choosed with the right sound.
async function displayColors(){
  await timeout(500);
  for(let i = 0; i<play.colors.length;i++){
      setFlashColor(play.colors[i]);
      switch(play.colors[i]){
        case 'red':
          redAudioRef.current.pause();
          redAudioRef.current.play();
          break;       
        case 'green':
          greenAudioRef.current.pause();
          greenAudioRef.current.play();
          break;  
        case 'yellow':
          yellowAudioRef.current.pause();
          yellowAudioRef.current.play();
          break;
        default:
          blueAudioRef.current.pause();
          blueAudioRef.current.play();
      }

      await timeout(500);
      setFlashColor("");
      await timeout(200);

      //Check if it is the last color
      if(i == play.colors.length - 1){
          const selectedColors = [...play.colors];
          setPlay({
              ...play,
              display:false,
              userPlay:true,
              userColors:selectedColors.reverse(),
          })
      }

  }

}


//Function that check if the right color clicked
async function colorClick(color:string){
  if(!play.display && play.userPlay){
      const userColorsCopy = [...play.userColors];
      const lastColor = userColorsCopy.pop();
      setFlashColor(color)
      await timeout(100);
      switch(color){
        case 'red':
          redAudioRef.current.pause();
          redAudioRef.current.play();
          break;       
        case 'green':
          greenAudioRef.current.pause();
          greenAudioRef.current.play();
          break;  
        case 'yellow':
          yellowAudioRef.current.pause();
          yellowAudioRef.current.play();
          break;
        default:
          blueAudioRef.current.pause();
          blueAudioRef.current.play();
      }

  
      //Check if you right in your last click
      if(color == lastColor){
          if(userColorsCopy.length){
              setPlay({...play, userColors:userColorsCopy}) 
          }
          else{
              await timeout(100);
              if(highScore<=play.score){
                setHighScore(play.colors.length);
                localStorage.setItem("highestScore", play.colors.length.toString());
                setPlay({
                  ...play,
                  display:true,
                  userPlay:false,
                  score:play.colors.length,
                  highest:play.colors.length,
                  userColors:[]})
              }
              else{
              setPlay({
                  ...play,
                  display:true,
                  userPlay:false,
                  score:play.colors.length,
                  userColors:[]})
              }
          }
      }

  else{
      await timeout(200);
      setPlay({...startplay,score:play.colors.length-1})
      }
      setFlashColor("")
      await timeout(200);

}
}

  return(
    <div className="App">
        <header className="App-header">
          {isOn &&(
            <div className="circleColor">
                {colors &&
        colors.map((v, i) => (
          <Buttons
            onClick={() => {
                colorClick(v);
            }}
            flash={flashColor === v}
            color={v}
          ></Buttons>
        ))}
    </div>
    )}
    
    {isOn && !play.display && !play.userPlay && (
      <div className="lost">
        <div>FinalScore: {play.score}</div>
        <button onClick={end}>Close</button>
      </div>
    )}
    {!isOn && (
      [<section className="wrapper">
      <div className="top">Simon</div>
      <div className="bottom" aria-hidden="true">Simon</div>
    </section>,
      <div className="simon">       
      Do what Simon Says...<br />
      Follow the pattern of lights and sounds<br />
      for as long as you can... if you can!<br /><br />
      <button onClick={start} className="startbutton">:: play ::</button>
      </div>]

    )}
        {isOn && (play.display || play.userPlay) && (
      [<div className="score">score: {play.score}</div>,
      <div className="score">highest: {play.highest}</div>,
      <button onClick={end} className="endbutton">quit</button>]

    )}
    </header>
</div>
);
}

export default App;

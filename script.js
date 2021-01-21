window.saveDataAcrossSessions = true;
const left_off = window.innerWidth/4;
const right_off= window.innerWidth - window.innerWidth /4;
const look_delay= 1000;
let startlook=Number.POSITIVE_INFINITY; //setting a random time unachieveable 
let lookDirection=null;

let imageElement=getNewImage();
let nextImageElement=getNewImage(true);

webgazer.setGazeListener((data,timestamp)=>{
    if(data === null || lookDirection === 'STOP') return

    if(data.x <left_off && lookDirection !== "LEFT" && lookDirection !== "RESET"){
        startlook=timestamp; //setting the time you start looking to the left
        lookDirection="LEFT"; //setting the dfirection to left to that timestamp doesn't keep getting updated
    }
    else if (data.x >right_off && lookDirection !== "RIGHT" && lookDirection !== "RESET"){
        startlook=timestamp; //setting the time you start looking to the right
        lookDirection="RIGHT"; //setting direction to right so timestart doesn't keep getting reset
    }
    else if (data.x >=left_off && data.x <=right_off){
        startlook=Number.POSITIVE_INFINITY; //resetting time when you look at center
        lookDirection=null; //resetting direction
    }

    //checking when you started looking + 1 second delay vs the time right now
    if( startlook+look_delay < timestamp){
        if(lookDirection = "LEFT"){
            imageElement.classList.add('left');
        }
        else{
            imageElement.classList.add('right');
        }
        startlook=Number.POSITIVE_INFINITY; //resetting the timestamp
        lookDirection='STOP'; //stop so that new image can load
        setTimeout(() => {
            imageElement.remove();
            nextImageElement.classList.remove('next');
            imageElement=nextImageElement;
            nextImageElement=getNewImage(true);
            lookDirection='RESET';
        }, 200);
    }
}).begin()

webgazer.showVideoPreview(false).showPredictionPoints(false);

function getNewImage(next = false){
    const img=document.createElement("img");
    img.src="https://picsum.photos/1000?"+Math.random()
    if(next) img.classList.add("next");
    document.body.append(img);
    return img
}
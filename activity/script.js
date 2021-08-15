let videoElem = document.querySelector("#video_elem");
let captureBtn = document.querySelector("#capture");
let timingEle = document.querySelector("#timing");
let clearObj;
let allFilter = document.querySelectorAll(".filter");
let uiFilter = document.querySelector(".ui_filter");
let filterColor = "";
let zoomInElem = document.querySelector("#plus_container");
let zoomOutElem = document.querySelector("#minus_container");
let zoomLevel = 1;
// let audioElem = document.querySelector("audio");

let constraints = {
    video: true,
    audio: true
}
let mediaRecorder;
let buffer = [];

//local machine
navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
        videoElem.srcObject = mediaStream;
        // audioElem.srcObject = mediaStream;
        //new obbject
        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.addEventListener("dataavailable", function (e) {
            buffer.push(e.data);
        })
        mediaRecorder.addEventListener("stop", function () {
            //convert data into blob
            //mime type
            let blob = new Blob(buffer, { type: "video/mp4" });
            // blob convert -> uRL
            const url = window.URL.createObjectURL(blob);
            addMediaToDb(url, "video");
            //download btn
            // let a = document.createElement("a");
            // //download
            // a.download = "file.mp4";
            // a.href = url;
            // a.click();
        })
    }
    ).catch(function (err) {
        console.log(err);
    })

let videoRecorder = document.querySelector("#record_video");
let recordState = false;
videoRecorder.addEventListener("click", function () {
    if (!mediaRecorder) {
        alert("First allow permission");
        return;
    }
    if (recordState == false) {
        mediaRecorder.start();
        // videoRecorder.innerHTML = "Recording...."
        videoRecorder.classList.add("record_animation");
        startCounting();
        recordState = true;
    } else {
        mediaRecorder.stop();
        videoRecorder.classList.remove("record_animation");
        stopCounting();
        // videoRecorder.innerHTML = "Record"
        recordState = false;
    }
})
captureBtn.addEventListener("click", function () {
    let canvas = document.createElement("canvas");
    canvas.width = videoElem.videoWidth;
    canvas.height = videoElem.videoHeight;
    let tool = canvas.getContext("2d");
    captureBtn.classList.add("capture_animation");

    tool.scale(zoomLevel, zoomLevel);
    let x = (canvas.width / zoomLevel - canvas.width) / 2;
    let y = (canvas.height / zoomLevel - canvas.height) / 2;

    tool.drawImage(videoElem, x, y);

    if (filterColor) {
        tool.fillStyle = filterColor;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }
    let link = canvas.toDataURL();
    addMediaToDb(link, "img");
    // let anchor = document.createElement("a");
    // anchor.href = link;
    // anchor.download = "file.png";
    // anchor.click();
    // anchor.remove();
    // canvas.remove();
    setTimeout(function () {
        captureBtn.classList.remove("capture_animation")
    }, 1000);

})

function startCounting() {
    timingEle.classList.add("timing_active");
    let timeCount = 0;
    clearObj = setInterval(function () {
        let second = (timeCount % 60) < 10 ? `0${timeCount % 60}` : `${timeCount % 60}`;
        let minute = (timeCount / 60) < 10 ? `0${Number.parseInt(timeCount / 60)}` : `${Number.parseInt(timeCount / 60)}`;
        let hour = (timeCount / 3600) < 10 ? `0${Number.parseInt(timeCount / 3600)}` : `${Number.parseInt(timeCount / 3600)}`;
        timingEle.innerText = `${hour}:${minute}:${second}`;
        timeCount++;

    }, 1000)

}
function stopCounting() {
    timingEle.classList.remove("timing_active");
    timingEle.innerText = "00:00:00";
    clearInterval(clearObj);
}

for (let i = 0; i < allFilter.length; i++) {
    allFilter[i].addEventListener("click", function () {
        let color = allFilter[i].style.backgroundColor;
        if (color) {
            uiFilter.classList.add("ui_filter_active");
            uiFilter.style.backgroundColor = color;
            filterColor = color;
        } else {
            uiFilter.classList.remove("ui_filter_active");
            uiFilter.style.backgroundColor = "";
            filterColor = "";

        }
    })
}

zoomInElem.addEventListener("click", function () {
    if (zoomLevel < 3) {
        zoomLevel += 0.2;
        videoElem.style.transform = `scale(${zoomLevel})`;
    }
})

zoomOutElem.addEventListener("click", function () {
    if (zoomLevel > 1) {
        zoomLevel -= 0.2;
        videoElem.style.transform = `scale(${zoomLevel})`;
    }
})

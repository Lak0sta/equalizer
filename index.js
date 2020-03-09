const file = document.getElementById("thefile");
const audio = document.getElementById("audio");
(function() {
    file.onchange = function(e) {
        const song = e.target.files[0];
        const context = new AudioContext();
        const canvas = document.getElementById("canvas");
        const src = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();
        const ctx = canvas.getContext("2d");

        audio.src = URL.createObjectURL(song);
        audio.load();
        audio.play();
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        src.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 512;
    
        const bufferLength = analyser.frequencyBinCount;
        // console.log(bufferLength);
    
        const dataArray = new Uint8Array(bufferLength);
    
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
    
        const barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
    
        function renderFrame() {
          requestAnimationFrame(renderFrame);
    
          x = 0;
    
          analyser.getByteFrequencyData(dataArray);
    
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            
            const r = barHeight + (25 * (i/bufferLength));
            const g = 250 * (i/bufferLength);
            const b = 50;
    
            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    
            x += barWidth + 1;
          }
        }
    
        audio.play();
        renderFrame();
      };
}());
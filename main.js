 const array = 
    [[ 65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.8, 110.0, 116.5, 123.5 ], 
    [ 130.8, 138.6, 146.8, 155.6, 164.8, 174.6, 185.0, 196.0, 207.7, 220.0, 233.1, 246.9 ], 
    [ 261.6, 277.2, 293.7, 311.1, 329.6, 349.2, 370.0, 392.0, 415.3, 440.0, 466.2, 493.9 ], 
    [ 523.3, 554.4, 587.3, 622.3, 659.3, 698.5, 740.0, 784.0, 830.6, 880.0, 932.3, 987.8 ], 
    [ 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976 ], 
    [ 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951 ],
    [ 4186, 4435, 4699, 4978, 5274, 5588, 5920, 6272, 6645, 7040, 7459, 7902 ]];

const names = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];
const play = document.querySelector('#play');
const octaves = document.querySelectorAll('.octave');
const score = document.querySelector('.score');
let random1, random2;

var context = new AudioContext();

var gainNode = context.createGain();
gainNode.gain.value = 0.2;
gainNode.connect(context.destination);

var oscillator = context.createOscillator();
oscillator.type = 'sine';

let firstPress = false;
play.addEventListener('click', () => {
    if(play.classList.contains('active')) {
        if(!firstPress) { // start the oscillator only the first time the button is clicked
            oscillator.start();
            firstPress = true;
        }

        octaves.forEach(octave => { // remove any active classes from octave buttons
            octave.classList.value = 'octave';
        });

        random1 = Math.floor(Math.random() * 7); // generate the random values
        random2 = Math.floor(Math.random() * 12);

        oscillator.frequency.value = array[random1][random2]; // choose the oscillator's freq
        console.log(`${names[random2]}${random1 + 2}`, " :", array[random1][random2]);

        oscillator.connect(gainNode); // start sound

        setTimeout(() => { 
            oscillator.disconnect(gainNode); // after 1 and a half sec stop the sound and activate the octave buttons

            play.classList.value = ""; // deactivate the play button until the test is finished
            octaves.forEach(octave => {
                octave.classList.add('active');
            });
        }, 1500);
    }
});

function verify(element) {
    const correct = random1 + 2;
    const answer = element.firstChild.textContent;

    octaves.forEach(octave => {
        octave.classList.remove('active');
    });

    play.classList.add('active');
    
    if(correct == answer) {
        element.classList.add('success');

        updateScore('success');
    }
    else {
        element.classList.add('fail');
        updateScore('fail');
        octaves[correct - 2].classList.add('success');
    }
}

octaves.forEach(octave => {
    octave.addEventListener('click', e => {
        if(octave.classList.contains('active')) {
            verify(e.currentTarget);
        }
    })
});

let all = 0;
let right = 0;

function updateScore(answer) {
    all ++;
    if(answer == 'success')
        right ++;

    console.log(answer);
    score.textContent = `${right} / ${all} - ${names[random2]}${random1 + 2}`;
}

// test buttons
const octaveTests = document.querySelectorAll('.octave-test');

octaveTests.forEach(octaveTest => {
    octaveTest.addEventListener('click', e => {
        const current = e.currentTarget;
        const value = current.firstChild.textContent - 2;
        const frequency = array[value][6]; // get the F# of all of the octaves

        conditionlessPlay(frequency);
    })
})

function conditionlessPlay(frequency) {
    if(!firstPress) {
        oscillator.start();
        firstPress = true;
    }
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    setTimeout(() => {oscillator.disconnect(gainNode);}, 1500);
}

const noteTests = document.querySelectorAll('.note-test');

noteTests.forEach(noteTest => {
    noteTest.addEventListener('click', e => {
        const current = e.currentTarget;
        const value = current.getAttribute('number');
        const frequency = array[3][value];

        conditionlessPlay(frequency);
    })
})
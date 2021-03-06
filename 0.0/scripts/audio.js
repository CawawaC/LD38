/*jshint es5: false */

//                  //
//      CLASSES     //
//                  //


class Oscillator {
    constructor(audioContext, output) {
        this.context = audioContext;

        this.osc = audioContext.createOscillator();
        this.osc.type = "sine";
        this.osc.frequency.value = frequencyFromNoteNumber(80);
        this.osc.start();

        this.envelope = context.createGain();
        this.envelope.connect(output);
        this.envelope.gain.value = 0;

        this.envelopeAD = [1, 0.1, 0, 0.5];

        this.osc.connect(this.envelope);
    }
            
    setFrequency(f) {
        this.osc.frequency.value = f;
    }

    setNote(note) {
//        this.setFrequency(frequencyFromNoteNumber(note));
        this.osc.frequency.setValueAtTime(frequencyFromNoteNumber(note), 0);
    }

    playNote(note) {
        console.info("je joue une note : " + note);
        this.setNote(note);
        this.linearAmplitudeBurst(context.currentTime, this.envelopeAD[0], this.envelopeAD[1], this.envelopeAD[2], this.envelopeAD[3]);
    }

    playNoteAtTime(note, time) {
        this.osc.frequency.setValueAtTime(frequencyFromNoteNumber(note), time);
        this.linearAmplitudeBurst(time, this.envelopeAD[0], this.envelopeAD[1], this.envelopeAD[2], this.envelopeAD[3]);
    }

    //Disconnects from all outputs !!!
    connect(output) {
        this.envelope.disconnect();
        this.envelope.connect(output);
    }

    linearAmplitudeBurst(startTime, value1, attackLength, value2, decayTime) {

        this.linearADSR(startTime, this.envelope.gain, value1, attackLength, value2, decayTime);
    }

    linearADSR(startTime, audioParam, value1, time1, value2, time2) {
        var now = startTime;
        audioParam.cancelScheduledValues(now);
        audioParam.linearRampToValueAtTime(value1, now + time1);
        audioParam.linearRampToValueAtTime(value2, now + time1+time2);    
    }

    /*frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2,(note-69)/12);
    }*/
}
        
function Modulator (type, freq, gain) {
    this.osc = audioCtx.createOscillator();
    this.gain = audioCtx.createGain();
    this.osc.type = type;
    this.osc.frequency.value = freq;
    this.gain.gain.value = gain;
    this.osc.connect(this.gain);
    this.osc.start(0);
}

class FMOscillator extends Oscillator {
    constructor(audioContext, output) {
        super(audioContext, output);

        this.modulator = new Oscillator(audioContext, output);
        this.modulator.setFrequency(400);
        this.modulator.envelope.disconnect();
        this.modulator.envelope.connect(this.osc.frequency);
        this.modulator.envelope.gain.value = 300;
    }
    
    play() {
        this.linearAmplitudeBurst(context.currentTime, this.envelopeAD[0], this.envelopeAD[1], this.envelopeAD[2], this.envelopeAD[3]);
    }
}
        
class PinkNoise {
    constructor(audioContext, output) {
        var bufferSize = 4096;
        var pinkNoise = (function() {
            var b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
            node.onaudioprocess = function(e) {
                var output = e.outputBuffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    var white = Math.random() * 2 - 1;
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    b3 = 0.86650 * b3 + white * 0.3104856;
                    b4 = 0.55000 * b4 + white * 0.5329522;
                    b5 = -0.7616 * b5 - white * 0.0168980;
                    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                    output[i] *= 0.11; // (roughly) compensate for gain
                    b6 = white * 0.115926;
                }
            }
            return node;
        })();

        this.envelope = audioContext.createGain();
        this.envelope.gain.value = 0;

        pinkNoise.connect(this.envelope);
        this.envelope.connect(output);
    }
}

class WhiteNoise {
    constructor(audioContext, audioOutput){
        var bufferSize = 2 * audioContext.sampleRate,
            noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate),
            output = noiseBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        var whiteNoise = audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.start(0);

        this.envelope = audioContext.createGain();
        this.envelope.gain.value = 0;

        this.filter = audioContext.createBiquadFilter();
        this.filter.type = "highpass";
        this.filter.frequency.value = 10000;
        //filter.gain.value = 25;

        whiteNoise.connect(this.filter);
        this.filter.connect(this.envelope);
        this.envelope.connect(audioOutput);
    }
}
  
class SonDeForme extends Oscillator {
    constructor(audioContext, output) {
        super(audioContext, output);
    }
    
    jouerNote(figure, position, couleur) {
        var noteRelative = notesDeFigures[figure];
        var octave = 3-position;  //Descendant
//        var octave = 2; //octave fix
//        var octave = position +1;   //Ascendant
        
        var noteAbsolue = noteRelative + octave*7 + 12;
        //this.osc.setPeriodicWave(timbreDeCouleur(couleur));
        
        Timbre.appliquerTimbreDeCouleur(couleur, this);
//        console.info(this.osc.type);
//        this.setNote(noteAbsolue);
        
        this.playNote(noteAbsolue);
    }
}

class Timbre {
    constructor(audioContext) {
        this.audioContext = audioContext;
        
        var real = new Float32Array(4);
        var imag = new Float32Array(4);

        real[0] = 0;
        imag[0] = 0;
        real[1] = 1;
        imag[1] = 0;
        real[2] = 1;
        
        this.onde = context.createPeriodicWave(real, imag);
        
//        this.aleatoire();
//        return this.onde;
    }
    
    changer(real, imag) {
        this.onde = context.createPeriodicWave(real, imag);
        return this.onde;
    }
    
    aleatoire() {
        var tailleDeTableau = 10;
        var real = new Float32Array(tailleDeTableau);
        var imag = new Float32Array(tailleDeTableau);

        for(var i = 0 ; i < tailleDeTableau ; ++i){
            real[i] = Math.random() *2 - 1;
//            console.info(real[i]);
            imag[i] = Math.random() *2 - 1;            
        }
        
        this.onde = context.createPeriodicWave(real, imag);
    }
    

    static timbreDeCouleur(couleur) {
        return timbres[couleur].onde;
    }

    static appliquerTimbreDeCouleur(couleur, oscillateur) {
        switch(couleur) {
            case 0:
                var real = new Float32Array(4);
                var imag = new Float32Array(4);

                real[0] = 0;
                imag[0] = 0;
                real[1] = 1;
                imag[1] = 0;
                real[2] = 1;

                var onde = oscillateur.context.createPeriodicWave(real, imag);
                oscillateur.osc.setPeriodicWave(onde);
                break;
            case 1:
                oscillateur.osc.type = "sine";
                break;
            case 2:
                oscillateur.osc.type = "triangle";
                break;
                
        }
    }
}


//                      //
//      VARIABLES       //
//                      //


var notesDeFigures = [32, 34, 36];
var timbres = [];
var sonsDeFormes = [];
var musicOsc, musicLFO1, musicLFO2;

var masterGain;
var spectrogramme;
//    sineEnvelope,
//    context,
//    sine,
//    kick, snare, hihat, testOsc, fmOsc,
var sequencerInterval;

var oscillateurFeedback;


//                           //
//      INITIALISATION       //
//                           //


function audioInit() {
    context = new (window.AudioContext || window.webkitAudioContext)();

    masterGain = context.createGain();
    masterGain.gain.value = 0.5;

    oscillateurFeedback = new Oscillator(context, masterGain);
    var real = new Float32Array(4);
    var imag = new Float32Array(4);

    real[0] = 0;
    imag[0] = 0;
    real[1] = 1;
    imag[1] = 0;
    real[2] = 1;
    var onde = context.createPeriodicWave(real, imag);
    oscillateurFeedback.osc.setPeriodicWave(onde);
    
    /*kick = context.createOscillator();
    //kick.gain.value = 1;
    kick.connect(masterGain);
    kick.gain.value = 0;
    kick.start();*/

    testOsc = new Oscillator(context, masterGain);
    testOsc.setNote(25);

    fmOsc = new FMOscillator(context, masterGain);

    kick = new Oscillator(context, masterGain);
    kick.osc.type = 'triangle';
    kick.envelope.gain.value = 0;
    kick.osc.frequency.value = frequencyFromNoteNumber(42);

    snare = new PinkNoise(context, masterGain);

    hihat = new WhiteNoise(context, masterGain);
//            snare.osc.frequency.value = 
        
    var sommeSonsDeFormes = context.createGain();
    
   
    
    var filtre = context.createBiquadFilter();
    filtre.type = "peaking";
    filtre.frequency.value = 1300;
    filtre.Q.value = 0.1;
    filtre.gain.value = -6;
    
    var delay = context.createDelay();
    delay.delayTime.value = .2;
    var delayGain = context.createGain();
    delayGain.gain.value = 0.65;
    delay.connect(delayGain);
    delayGain.connect(delay);
    
    oscillateurFeedback.connect(masterGain);

    spectrogramme = context.createAnalyser();
    
    creerSonsDeFormes(sommeSonsDeFormes);
    sommeSonsDeFormes.connect(delay);
    delay.connect(filtre);
    filtre.connect(masterGain);
    masterGain.connect(spectrogramme);
    masterGain.connect(context.destination);
    
    
    /*musicOsc = new Oscillator(context, delay);
    musicOsc.osc.type = "triangle";
    musicOsc.setNote(30);
    
    musicLFO1 = new Oscillator(context, delay);
    musicLFO1.envelope.disconnect();
    musicLFO1.osc.frequency.value = 0.5;
    musicLFO1.envelope.gain.value = 300;

    musicLFO2 = new Oscillator(context, delay);
    musicLFO2.envelope.disconnect();
    musicLFO2.osc.frequency.value = 4.1;
    musicLFO2.envelope.gain.value = 1;
    
    musicFilter = context.createBiquadFilter();
    musicFilter.type = "peaking";
    
    musicLFO1.connect(musicFilter.frequency);
//    musicLFO2.connect(musicOsc.envelope.gain);
    musicOsc.envelope.gain.value = 0.5;
    musicOsc.envelope.connect(musicFilter);
    musicFilter.connect(delay);*/
    
    
//    var delay = context.createDelay();
//    delay.delayTime.value = 0.5;
//
//    var feedback = context.createGain();
//    feedback.gain.value = 0.9;
//
//    delay.connect(feedback);
//    feedback.connect(delay);
//
//    masterGain.connect(delay);
////    masterGain.connect(context.destination);
////    console.log(masterGain.channelCount);
//    delay.connect(context.destination);
}

function creerSonsDeFormes(output) {
    for (var i = 0 ; i < 3 ; ++i) {
        sonsDeFormes.push(new SonDeForme(context, output));
        
        var timbre = new Timbre(context);
        timbre.aleatoire();
        timbres.push(timbre);
    }
}

//                                     //
//      LES FONCTIONS DE LA VIE        //
//                                     //

function jouerUnSonDePattern(figure, position, couleur, oscillo = 0) {
    sonsDeFormes[oscillo].jouerNote(figure, position, couleur);
}

/* supertableau :
[[figure, position, couleur],
 [figure, position, couleur],
 ...]*/
function jouerUnSonDeForme(superTableau) {
    //Harmonique
//    for(var i = 0 ; i < superTableau.length ; ++i) {
//        console.info(superTableau[i][0]);
//        jouerUnSonDePattern(
//            superTableau[i][0],
//            superTableau[i][1],
//            superTableau[i][2],
//            i);
//    }
    
    //Mélodique
    var i = 0;
    var troisCoups = setInterval(
        function(){ 
            jouerUnSonDePattern(
            superTableau[i][0],
            superTableau[i][1],
            superTableau[i][2],
            i);
            
            ++i;
            if(i >= 3) clearInterval(troisCoups);
        },
        200);    //set interval is in ms
    
    //ondulerLaPrairie();
}

/*function ondulerLaPrairie() {
    var bufferLength = spectrogramme.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    spectrogramme.getByteTimeDomainData(dataArray);
    
    console.info(traceDePrairie.segments[0].point.length);

    for(var i = 0 ; i < traceDePrairie.segments.length ; ++i) {
        var centre = new Point(prairie.x, prairie.y);
        var pointRelatif = centre - traceDePrairie.segments[i].point;
//        console.info(pointRelatif);
//        console.info(traceDePrairie.segments[i].point.x);
//        traceDePrairie.segments[i].point.length = traceDePrairie.segments[i].point.length +1;
    }
    
}
*/

//              //
//  SEQUENCER   //
//              //

var bpm = 120;
var bps = bpm/60;
var beatLength = 1/bps;
var measureLength = 4*beatLength;

function startLoop() {
    sequencer();
    testOsc.setNote(60);
}

function stopLoop() {
    clearInterval(sequencerInterval);
}

function sequencer() {            
    sequence(context.currentTime);
    sequencerInterval = setInterval(
        function(){ 
            sequence(context.currentTime); 
        },
        measureLength*1000);    //set interval is in ms
}

function sequence(startTime) {
    var barStart = context.currentTime;
    var beatStart = barStart;

    //First beat
    testOsc.linearADSR(beatStart, testOsc.osc.frequency, 220, 0.01, 50, 0.1);
    testOsc.playNote(25);

    //Second beat
    beatStart = beatStart+beatLength;
    testOsc.linearADSR(beatStart, testOsc.osc.frequency, 220, 0.01, 50, 0.1);
    testOsc.playNoteAtTime(25, beatStart);

    //Third beat
    beatStart = beatStart+beatLength;
    testOsc.linearADSR(beatStart, testOsc.osc.frequency, 220, 0.01, 50, 0.1);
    testOsc.playNoteAtTime(25, beatStart);

    //Fourth beat
    beatStart = beatStart+beatLength;
    testOsc.linearADSR(beatStart, testOsc.osc.frequency, 220, 0.01, 50, 0.1);
    testOsc.playNoteAtTime(25, beatStart);
}


//                  //
//      BUTTONS     //
//                  //

function sonFM() {
    var f = Math.random()*10+1;
    fmOsc.modulator.osc.frequency.setValueAtTime(f, 0);
    fmOsc.modulator.envelope.gain.value = Math.random()*300;
    fmOsc.osc.frequency.setValueAtTime(Math.random()*1000+30, 0);

    var lop = context.createBiquadFilter();
    lop.frequency.value = 200;
    
    lop.type = "lowpass";
    lop.frequency.value = 500;
    lop.gain.value = 25;
    
//    console.info(lop);
    lop.connect(context.destination);
    fmOsc.envelope.disconnect();
    fmOsc.envelope.connect(lop);

    fmOsc.play();
}

function stop() {
    //kick.envelope.gain.value = 0;
}

function fireBurst() {            
    linearADSR(kick.envelope.gain, 1, 0.1, 0, 0.5);
    linearADSR(kick.osc.frequency, 100, 0, 50, 0.5);
}

function playOscillatorAtTime(oscillator, time) {
    linearADSR(time, oscillator.envelope.gain, 1, 0, 0, 0.3);
    linearADSR(time, oscillator.osc.frequency, 100, 0, 50, 0.3);
}

function linearADSR(startTime, audioParam, value1, time1, value2, time2) {
    var now = startTime;
    audioParam.cancelScheduledValues(now);
    audioParam.exponentialRampToValueAtTime(value1, now + time1);
    audioParam.linearRampToValueAtTime(value2, now + time1+time2);    
}

function playNoiseAtTime(oscillator, time) {
    linearADSR(time, oscillator.envelope.gain, 1, 0, 0, 0.3);
}


//              //
//  UTILITIES   //
//              //

function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2,(note-69)/12);
}

function centsOffFromPitch(frequency, note) {
    return Math.floor(1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2));
}


//                  //
//      TESTS       //
//                  //

function son1() {
    jouerUnSonDePattern(0, 0, 0);
}
function son2() {
    jouerUnSonDePattern(0, 0, 1);
}
function son3() {
    jouerUnSonDeForme([
        [0, 1, 0],
        [0, 1, 1],
        [3, 1, 0]]);
}


function feedbackAudioPositif() {
    oscillateurFeedback.envelope.gain.linearRampToValueAtTime(1, context.currentTime+0.01)
    oscillateurFeedback.osc.frequency.setValueAtTime(500, context.currentTime);
    oscillateurFeedback.osc.frequency.linearRampToValueAtTime(900, context.currentTime+0.1);
    oscillateurFeedback.envelope.gain.linearRampToValueAtTime(0, context.currentTime+0.1);
}

function feedbackAudioNegatif() {
    oscillateurFeedback.envelope.gain.linearRampToValueAtTime(1, context.currentTime+0.01)
    oscillateurFeedback.osc.frequency.setValueAtTime(500, context.currentTime);
    oscillateurFeedback.osc.frequency.linearRampToValueAtTime(100, context.currentTime+0.1);
    oscillateurFeedback.envelope.gain.linearRampToValueAtTime(0, context.currentTime+0.1);
}

function musique() {
    
}
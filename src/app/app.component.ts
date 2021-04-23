import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { VoiceRecognitionService } from './services/voice-recognition.service'
import { SpeechSynthesisService } from './services/speech-synthesis.service'
import { NlpAgentService } from './services/nlp-agent.service';
import { faMicrophone, faRedoAlt, faQuestion } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [VoiceRecognitionService, SpeechSynthesisService]
})


export class AppComponent implements OnInit {
  small = this.multipleBoxShadow(700);
  medium = this.multipleBoxShadow(200);
  big = this.multipleBoxShadow(100); 
    
  faMicro = faMicrophone;
  faRepeat = faRedoAlt;
  faQuestion = faQuestion;
  title = 'sdc-chatbot-ui';
  showingWelcome = true;
  classificationCount = 0;
  lastMeteorSound;

  lastRecognition = '';

  constructor(
    public voiceRecognitionService: VoiceRecognitionService,
    private nlpAgentService: NlpAgentService,
    public speechSynthesisService: SpeechSynthesisService,
  ) { 
    this.voiceRecognitionService.init();
    nlpAgentService.createUUID();
  }

  ngOnInit() {
    this.classificationCount = 0;
    this.voiceRecognitionService.setIsStoppedSpeechRecog(true); 
  }

  async accessApp() {
    this.showingWelcome = false;
    await this.processInput("Hola"); 
    this.voiceRecognitionService.setIsStoppedSpeechRecog(false); 
    //this.startVoiceRecognition();
    this.voiceRecognitionService.lastTextObservable.subscribe(recognition => {
      this.processInput(recognition);
    });
  }

  startVoiceRecognition() {
    this.voiceRecognitionService.start()
  }

  stopVoiceRecognition() {
    this.voiceRecognitionService.stop()
  }

  async speak(message) {
    await this.speechSynthesisService.speak(message);
  }

  playSound(url) {
    const audio = new Audio(url);
    audio.play();
    return new Promise(resolve => {
      audio.onended = resolve;
    }); 
  }

  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  playAudio() {
    let audio = new Audio();
    audio.src = "../../../assets/audio/sdc-videotutorial.wav";
    audio.load();
    audio.play();
    return new Promise(resolve => {
      audio.onended = resolve;
    })
  }

  playLastMeteorSound() {
    if (this.lastMeteorSound != null) {
      this.playSound(this.lastMeteorSound);
    }
  }

  multipleBoxShadow(n) {
    let value = Math.floor(Math.random()*2000) + "px " + Math.floor(Math.random()*2000) + "px " + "#FFF";
    for (let index = 2; index < n; index++) {
        value = value + " , " +Math.floor(Math.random()*2000) + "px " + Math.floor(Math.random()*2000) + "px " + "#FFF";
    }
    return value; 
  }

  async processInput(recognition) {
    this.lastRecognition = recognition;
    const agentResponse:Array<any> = await this.nlpAgentService.sendToBot(this.lastRecognition);
    /*const agentResponse:Array<any> = [
      {
          "recipient_id": "noe",
          "text": "¡Hola! Qué bien verte por el espacio, esto es Sonidos del Cielo,  el proyecto de Ciencia Ciudadana para la clasificación de meteoros a través de sus sonidos."
      },
      {
          "recipient_id": "noe",
          "text": "¿Qué te gustaría hacer, escuchar la explicación del juego o empezar a jugar?"
      }
    ]*/
    console.log('agentResponse',agentResponse);

    const soundmsg = {
      "custom": {
        "sample": {
          "id": 1,
          "audio": "https://dl.espressif.com/dl/audio/gs-16b-2c-44100hz.mp3"
        }
      }
    }
    const countmsg = {
      "custom": {
        "clasification": {
          "nueva": true
        }
      }
    }

    //agentResponse.splice(1,0,countmsg);
    //agentResponse.splice(2,0,soundmsg);
    //agentResponse.splice(1,0,tutorialtmsg);

    for (const agentMsg of agentResponse) {
      console.log('agentMsg',agentMsg);
      if ('text' in agentMsg) {
        console.log('agentMsg',agentMsg.text);
        await this.speak(agentMsg.text); 
      } 
      else if ('custom' in agentMsg) {
        if ('sample' in agentMsg.custom) {
          await this.playSound(agentMsg.custom.sample.audio);
          this.lastMeteorSound = agentMsg.custom.sample.audio;
        } 
        else if ('video' in agentMsg.custom) {
          console.log('Playing audio...');
          await this.playAudio();
        }
        else if ('clasification' in agentMsg.custom) {
          this.classificationCount++;
          if (this.classificationCount == 1) {
            await this.speak("Enhorabuena, has realizado tu primera clasificación. ¡Te has ganado una pegatina para decorar tu espacio!"); 
          } else if ([5, 10, 15, 20].includes(this.classificationCount)) {
            await this.speak("Enhorabuena, has realizado " + this.classificationCount.toString() + " clasificaciones. Has ganado una nueva pegatina."); 
          }
        }
      }
    } 
    console.log('rearranco recogni');
    this.startVoiceRecognition();
  }
}


 
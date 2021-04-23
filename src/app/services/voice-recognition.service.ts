import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  private lastText = new Subject<string>();
  public lastTextObservable = this.lastText.asObservable();

 recognition =  new webkitSpeechRecognition();
  public isStoppedSpeechRecog = false;
  public text = '';
  tempWords = '';

  constructor() { }

  public init() {

    this.recognition.interimResults = true;
    this.recognition.lang = 'es-ES';

    this.recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
    });

    this.recognition.addEventListener('end', (condition) => {
      console.log("Event: End speech recognition")
      this.stop();
    });
  }

  public setIsStoppedSpeechRecog(value) {
    this.isStoppedSpeechRecog = value;
  }

  public start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
  }
  public stop() {
    this.isStoppedSpeechRecog = true;
    this.text = this.tempWords; // this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';
    if (this.text.length!=0) {
      this.lastText.next(this.text);
      this.recognition.stop();
      console.log("End speech recognition")
    } else {
      this.start();
    }
  }

  public getStatus() {
    return this.isStoppedSpeechRecog;
  }
}
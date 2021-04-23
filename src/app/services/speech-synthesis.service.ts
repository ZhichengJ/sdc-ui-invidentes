import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechSynthesisService {
  synth = window.speechSynthesis;

  constructor() { }

  public speak(message) {
    const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.pitch = 1.6;
    utterThis.rate = 1.1;
    this.synth.speak(utterThis);
    this.synth.speaking

    return new Promise(resolve => {
      utterThis.onend = resolve;
    });
  }
}

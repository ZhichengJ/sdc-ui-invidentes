import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  
  @Output() closeEvent = new EventEmitter();
  faClose = faTimes;
  constructor() { }

  ngOnInit() {
  }

  closeVideo() {
    this.closeEvent.emit();
  }
}

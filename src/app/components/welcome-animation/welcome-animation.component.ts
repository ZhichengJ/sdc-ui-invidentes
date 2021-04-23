import { Component, OnInit } from '@angular/core';
import { faHandPointUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-welcome-animation',
  templateUrl: './welcome-animation.component.html',
  styleUrls: ['./welcome-animation.component.scss']
})
export class WelcomeAnimationComponent implements OnInit {
  faPointing = faHandPointUp;

  constructor() { }

  ngOnInit() {
  }

}

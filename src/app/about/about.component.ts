import { Component, OnInit } from '@angular/core';
import {Leader} from '../shared/Leader';
import { LeadersService } from '../services/leaders.service';
import { baseURL } from '../shared/baseurl';
import { BasePortalOutlet } from '@angular/cdk/portal';
import { visibility, flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    visibility(),flyInOut(),expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders!: Leader[];
  BaseURL= baseURL;

  constructor(private leadersServie:LeadersService) { }

  ngOnInit(): void {
    this.leadersServie.getLeaders().subscribe(leaders => this.leaders=leaders);
  }

}

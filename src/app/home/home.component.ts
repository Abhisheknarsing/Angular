import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/Dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/Promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/Leader';
import { LeadersService } from '../services/leaders.service';

import { baseURL } from '../shared/baseurl';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish!: Dish;
  promotion!: Promotion;
  leader!: Leader;
  BaseURL = baseURL;
  errMess!:any;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderService: LeadersService) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish=dish,errmess => this.errMess = <any>errmess);
     this.leaderService.getFeatureLeader().subscribe(leader => this.leader=leader,errmess => this.errMess = <any>errmess);
   this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion=promotion,errmess => this.errMess = <any>errmess);
  }

}

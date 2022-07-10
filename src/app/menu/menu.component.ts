import { Component, OnInit, Inject } from '@angular/core';
import {Dish} from '../shared/Dish';
import { DishService } from '../services/dish.service';
import { baseURL } from '../shared/baseurl';
import { flyInOut } from '../animations/app.animations';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut()
    ]
})
export class MenuComponent implements OnInit {

  dishes!: Dish[];

  selectedDish!: Dish;

  BaseUrl=baseURL;

  errMess!: string;

  constructor(private dishService: DishService) {
   
   }

  ngOnInit(): void {
    console.log("before");
    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = dishes,
      errmess => this.errMess = <any>errmess);
  }

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }

  

}

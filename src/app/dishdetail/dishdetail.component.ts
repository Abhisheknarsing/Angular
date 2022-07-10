import { Component, Inject, Input, OnInit,ViewChild } from '@angular/core';
import { Dish } from '../shared/Dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Comment} from '../shared/Comment';
import { baseURL } from '../shared/baseurl';
import { visibility, flyInOut, expand } from '../animations/app.animations';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility(),flyInOut(),expand()
  ]
})
export class DishdetailComponent implements OnInit {

  @Input()
  dish!: Dish|any;

  @ViewChild('cform') commentFormDirective:any;
  
  dishIds!: string[];
  prev!: string;
  next!: string;
  size!: number;

  dishcopy!: Dish|any;
  visibility = 'shown';

  commentForm! : FormGroup;
  comment! : Comment;
  BaseURL=baseURL;
  errMess!:any;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder, 
    ) { 
      this.createForm();
    }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
     
      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
    
    }

    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required,Validators.minLength(2)] ],
      rating: [5, Validators.required ],
      comment: ['', Validators.required ],
      date:""
    });
    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged();
  }

  onSubmit() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.commentForm.value.date = mm + '/' + dd + '/' + yyyy;

    this.dishcopy.comments.push(this.comment);

    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    

    this.dish.comments.push(this.commentForm.value);
    this.size++;

    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });

    this.commentFormDirective.resetForm();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;

    if(this.commentForm.status==="VALID")
    {
      if(this.size !== this.dish.comments.length)
      {
        this.dish.comments.pop();
      }
      this.dish.comments.push(this.commentForm.value);
    }
    

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  formErrors: any = {
    'author': '',
    'rating': 5,
    'comment': ''
  };

  validationMessages:any = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Auther Name must be at least 2 characters long.',
    },
    'rating': {
      'required':      'Last Name is required.'
    },
    'comment': {
      'required':      'Tel. number is required.'
    },
  };

}

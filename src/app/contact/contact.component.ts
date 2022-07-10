import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/Feedback';
import { FeedbackService } from '../services/feedback.service';
import { visibility, flyInOut, expand } from '../animations/app.animations';
import { delay } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
    visibility(),flyInOut(),expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm!: FormGroup;
  feedback!: Feedback;
  contactType = ContactType;
  returnFeedback!: Feedback;
  feedErr:any;
  stopLoading:boolean=true;
  successForm!:Feedback|any;
  form:boolean=true;

  @ViewChild('fform') feedbackFormDirective:any;

  constructor(private fb: FormBuilder,private feedbackService:FeedbackService) {
    this.createForm();
  }

  ngOnInit() {
  }

 
  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', Validators.required ],
      lastname: ['', Validators.required ],
      telnum: ['', Validators.required ],
      email: ['', Validators.required ],
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.stopLoading=false;
    this.form=false;
    this.feedbackService.postFeedback(this.feedback).subscribe(
      feed => {
        this.successForm = feed;
        this.stopLoading=true;
        setTimeout(() => {
          this.successForm=null;
          this.form=true;
        }, 5000);
      },
      err => {this.feedErr=err;this.stopLoading=true});

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

}

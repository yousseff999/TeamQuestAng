import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event as MyEvent } from 'src/app/models/event';

@Component({
  selector: 'app-eventcategory',
  templateUrl: './eventcategory.component.html',
  styleUrls: ['./eventcategory.component.css']
})
export class EventcategoryComponent implements OnInit {
  events: MyEvent[] = [];
  selectedCategory: string = '';
  constructor(private eventService: EventService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category');
      if (category) {
        this.eventService.showEventsByCategory(category).subscribe({
          next: (data) => this.events = data,
          error: (err) => console.error(err)
        });
      }
    });
  }
}